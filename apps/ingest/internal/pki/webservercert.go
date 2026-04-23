package pki

import (
	"crypto/sha256"
	"crypto/x509"
	"encoding/hex"
	"encoding/pem"
	"errors"
	"fmt"
	"log/slog"
	"os"
	"sync/atomic"
	"time"
)

// WebServerCert holds the PEM and SHA-256 fingerprint of the browser-facing
// nginx TLS leaf certificate. It refreshes periodically from disk so a cert
// swap propagates to agents without restarting the ingest service.
//
// The fingerprint is computed over the DER-encoded leaf. Agents compare their
// pinned fingerprint against Fingerprint() on every heartbeat; on mismatch
// the ingest handler pushes PEM() so the agent can append it to its trust
// roots and keep verifying downloads after the operator rotates the cert.
type WebServerCert struct {
	path string
	pem  atomic.Pointer[string]
	fpr  atomic.Pointer[string]
}

// LoadWebServerCert reads the cert from path and starts a background refresher.
// When path is empty the returned struct reports empty PEM and fingerprint,
// which disables the rotation RPC — this is fine for environments where the
// operator fronts CT-Ops with an external proxy they manage themselves.
func LoadWebServerCert(path string) (*WebServerCert, error) {
	w := &WebServerCert{path: path}
	if path == "" {
		empty := ""
		w.pem.Store(&empty)
		w.fpr.Store(&empty)
		return w, nil
	}
	if err := w.refresh(); err != nil {
		return nil, fmt.Errorf("loading web server cert %s: %w", path, err)
	}
	return w, nil
}

// Run refreshes the cert from disk every interval. Non-fatal errors are
// logged and the previous value is retained, so a brief outage (e.g. nginx
// swapping the file atomically) does not cause agents to thrash.
func (w *WebServerCert) Run(stop <-chan struct{}, interval time.Duration) {
	if w.path == "" {
		return
	}
	t := time.NewTicker(interval)
	defer t.Stop()
	for {
		select {
		case <-stop:
			return
		case <-t.C:
			if err := w.refresh(); err != nil {
				slog.Warn("refreshing web server cert", "path", w.path, "err", err)
			}
		}
	}
}

// PEM returns the most recently loaded certificate as PEM bytes, or "" when
// no cert is configured.
func (w *WebServerCert) PEM() string {
	if p := w.pem.Load(); p != nil {
		return *p
	}
	return ""
}

// Fingerprint returns the SHA-256 fingerprint of the leaf as lowercase hex.
// Empty string means the cert is not configured.
func (w *WebServerCert) Fingerprint() string {
	if p := w.fpr.Load(); p != nil {
		return *p
	}
	return ""
}

func (w *WebServerCert) refresh() error {
	data, err := os.ReadFile(w.path)
	if err != nil {
		return err
	}
	block, _ := pem.Decode(data)
	if block == nil || block.Type != "CERTIFICATE" {
		return errors.New("no CERTIFICATE PEM block found")
	}
	leaf, err := x509.ParseCertificate(block.Bytes)
	if err != nil {
		return fmt.Errorf("parsing leaf: %w", err)
	}
	sum := sha256.Sum256(leaf.Raw)
	fp := hex.EncodeToString(sum[:])
	pemStr := string(data)
	w.pem.Store(&pemStr)
	w.fpr.Store(&fp)
	return nil
}
