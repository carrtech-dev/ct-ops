package identity

import (
	"crypto/sha256"
	"crypto/x509"
	"encoding/hex"
	"encoding/pem"
	"errors"
	"fmt"
	"os"
	"path/filepath"
)

// serverCertFile is the on-disk name for the pinned browser/nginx-facing
// server cert. It is bundled into agent enrolment zips as server-cert.pem and
// may be replaced from the server over the heartbeat stream when the cert is
// rotated. Distinct from agent_ca.pem (which is the agent CA for the mTLS
// client cert) and from server-ca.crt (which is the ingest gRPC server cert).
const serverCertFile = "server_cert.pem"

// LoadPinnedServerCert returns the PEM bytes and SHA-256 fingerprint of the
// locally pinned nginx-facing server cert. Returns empty values with a nil
// error when no cert is pinned yet (e.g. agent upgraded from a version that
// did not track a pin).
func LoadPinnedServerCert(dataDir string) ([]byte, string, error) {
	if dataDir == "" {
		return nil, "", nil
	}
	path := filepath.Join(dataDir, serverCertFile)
	pemBytes, err := os.ReadFile(path)
	if errors.Is(err, os.ErrNotExist) {
		return nil, "", nil
	}
	if err != nil {
		return nil, "", fmt.Errorf("reading pinned server cert: %w", err)
	}
	fp, err := fingerprintPEM(pemBytes)
	if err != nil {
		return pemBytes, "", err
	}
	return pemBytes, fp, nil
}

// SavePinnedServerCert writes the PEM atomically (0o644 — the cert is public
// material). No-op when dataDir or certPEM is empty.
func SavePinnedServerCert(dataDir string, certPEM []byte) error {
	if dataDir == "" || len(certPEM) == 0 {
		return nil
	}
	if err := os.MkdirAll(dataDir, 0o755); err != nil {
		return err
	}
	final := filepath.Join(dataDir, serverCertFile)
	tmp := final + ".tmp"
	if err := os.WriteFile(tmp, certPEM, 0o644); err != nil {
		return fmt.Errorf("writing pinned server cert tmp: %w", err)
	}
	if err := os.Rename(tmp, final); err != nil {
		return fmt.Errorf("renaming pinned server cert: %w", err)
	}
	return nil
}

// fingerprintPEM returns the SHA-256 hex of the first CERTIFICATE block in
// the supplied PEM bundle.
func fingerprintPEM(pemBytes []byte) (string, error) {
	block, _ := pem.Decode(pemBytes)
	if block == nil || block.Type != "CERTIFICATE" {
		return "", errors.New("no CERTIFICATE block in PEM")
	}
	leaf, err := x509.ParseCertificate(block.Bytes)
	if err != nil {
		return "", fmt.Errorf("parsing cert: %w", err)
	}
	sum := sha256.Sum256(leaf.Raw)
	return hex.EncodeToString(sum[:]), nil
}
