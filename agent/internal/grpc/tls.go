package agentgrpc

import (
	"crypto/tls"
	"crypto/x509"
	"fmt"
	"os"

	"google.golang.org/grpc/credentials"
)

// BuildTLSCredentials builds gRPC transport credentials for the agent.
// If caCertFile is empty, the system root CAs are used.
// If skipVerify is true, TLS certificate verification is disabled (insecure — dev/testing only).
// Structured to slot in mTLS client certificate in a future session.
func BuildTLSCredentials(caCertFile string, skipVerify bool) (credentials.TransportCredentials, error) {
	tlsCfg := &tls.Config{
		MinVersion:         tls.VersionTLS12,
		InsecureSkipVerify: skipVerify, //nolint:gosec // controlled by explicit user config
	}

	if !skipVerify && caCertFile != "" {
		caBytes, err := os.ReadFile(caCertFile)
		if err != nil {
			return nil, fmt.Errorf("reading CA cert %s: %w", caCertFile, err)
		}
		pool := x509.NewCertPool()
		if !pool.AppendCertsFromPEM(caBytes) {
			return nil, fmt.Errorf("parsing CA cert %s", caCertFile)
		}
		tlsCfg.RootCAs = pool
	}
	// caCertFile == "" && !skipVerify → uses system roots (tlsCfg.RootCAs nil = system default)

	return credentials.NewTLS(tlsCfg), nil
}
