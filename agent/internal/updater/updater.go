// Package updater handles automatic agent self-updates.
//
// When the ingest service signals that a newer agent version is available, this
// package downloads the new binary from the server, atomically replaces the
// current executable, and re-execs so the updated agent runs without a gap in
// monitoring.
//
// On failure at any step the error is returned to the caller. The caller must
// log it and continue — a failed update should never stop the agent.
package updater

import (
	"crypto/tls"
	"crypto/x509"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
	"time"
)

// Update downloads the agent binary for the current OS/arch from downloadBaseURL,
// atomically replaces the running executable, and re-execs into the new binary.
// pinnedServerCertPEM, when non-empty, is appended to the system CA pool so
// the agent can verify HTTPS downloads even when the server's cert is signed
// by a private CA not in the host trust store. This covers the common Linux
// VM scenario where an operator has replaced the self-signed bundled cert
// with one from their internal CA.
// If Update returns, an error occurred and the caller should continue running.
func Update(latestVersion, downloadBaseURL string, pinnedServerCertPEM []byte) error {
	url := fmt.Sprintf(
		"%s?os=%s&arch=%s",
		downloadBaseURL,
		runtime.GOOS,
		runtime.GOARCH,
	)

	slog.Info("downloading agent update", "url", url, "version", latestVersion)

	// Determine current executable path.
	exe, err := os.Executable()
	if err != nil {
		return fmt.Errorf("resolving current executable path: %w", err)
	}

	// Download to a temp file in the same directory so the rename is atomic
	// (same filesystem, no cross-device move).
	dir := filepath.Dir(exe)
	tmp, err := os.CreateTemp(dir, ".ct-ops-agent-update-*")
	if err != nil {
		return fmt.Errorf("creating temp file for update: %w", err)
	}
	tmpPath := tmp.Name()

	// Ensure the temp file is cleaned up on any error path.
	success := false
	defer func() {
		if !success {
			os.Remove(tmpPath)
		}
	}()

	client, err := buildHTTPClient(pinnedServerCertPEM)
	if err != nil {
		tmp.Close()
		return fmt.Errorf("building HTTP client: %w", err)
	}

	resp, err := client.Get(url) //nolint:gosec // URL is constructed from server-supplied base URL
	if err != nil {
		tmp.Close()
		return fmt.Errorf("downloading update: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		tmp.Close()
		return fmt.Errorf("download returned HTTP %d", resp.StatusCode)
	}

	if _, err := io.Copy(tmp, resp.Body); err != nil {
		tmp.Close()
		return fmt.Errorf("writing update to temp file: %w", err)
	}
	tmp.Close()

	// Make the new binary executable before replacing.
	if err := os.Chmod(tmpPath, 0o755); err != nil {
		return fmt.Errorf("chmod update binary: %w", err)
	}

	// Atomic replace — rename is atomic within the same filesystem.
	if err := os.Rename(tmpPath, exe); err != nil {
		return fmt.Errorf("replacing binary (may need write permission on %s): %w", exe, err)
	}
	success = true

	slog.Info("update downloaded, restarting agent", "version", latestVersion)

	// Re-exec into the updated binary. This is platform-specific:
	//   - On Unix we use syscall.Exec so the running process is replaced in
	//     place (same PID). This keeps systemd happy — it never sees the
	//     service exit, and the cgroup is reused without being torn down.
	//   - On Windows syscall.Exec is unavailable; reExec there spawns the new
	//     binary as a child and exits, and the Windows service manager is
	//     expected to be configured to restart on exit.
	if err := reExec(exe, os.Args, os.Environ()); err != nil {
		return fmt.Errorf("re-execing updated agent: %w", err)
	}
	return nil // unreachable on unix (syscall.Exec replaces the process)
}

// buildHTTPClient returns an HTTP client whose TLS config trusts both the
// system CA pool and the supplied pinned cert PEM. When pinnedPEM is empty,
// the client falls back to the system pool alone. A modest timeout keeps a
// hung connection from blocking the agent indefinitely.
func buildHTTPClient(pinnedPEM []byte) (*http.Client, error) {
	tr := http.DefaultTransport.(*http.Transport).Clone()

	roots, err := x509.SystemCertPool()
	if err != nil || roots == nil {
		roots = x509.NewCertPool()
	}
	if len(pinnedPEM) > 0 {
		if !roots.AppendCertsFromPEM(pinnedPEM) {
			slog.Warn("pinned server cert PEM contained no valid certificates — falling back to system trust only")
		}
	}
	tr.TLSClientConfig = &tls.Config{
		MinVersion: tls.VersionTLS12,
		RootCAs:    roots,
	}
	return &http.Client{
		Transport: tr,
		Timeout:   10 * time.Minute,
	}, nil
}
