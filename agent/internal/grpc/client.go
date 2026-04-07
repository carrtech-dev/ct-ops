package agentgrpc

import (
	"fmt"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/keepalive"
)

// Connect establishes a gRPC connection to the ingest service.
func Connect(address, caCertFile string, skipVerify bool) (*grpc.ClientConn, error) {
	creds, err := BuildTLSCredentials(caCertFile, skipVerify)
	if err != nil {
		return nil, fmt.Errorf("building TLS credentials: %w", err)
	}

	// Keepalive is essential: the heartbeat stream is mostly idle (one send
	// every 30s) and stateful middleboxes (NAT, conntrack, cloud LBs) silently
	// evict idle TCP flows after 1–4 hours. Without HTTP/2 PINGs the agent
	// keeps writing to a half-open socket and never notices the stream is dead
	// until the OS gives up — which can take much longer than the user will
	// tolerate. PermitWithoutStream lets us keep the connection warm even
	// during reconnect backoff windows.
	kp := keepalive.ClientParameters{
		Time:                30 * time.Second,
		Timeout:             10 * time.Second,
		PermitWithoutStream: true,
	}

	conn, err := grpc.NewClient(address,
		grpc.WithTransportCredentials(creds),
		grpc.WithKeepaliveParams(kp),
	)
	if err != nil {
		return nil, fmt.Errorf("connecting to %s: %w", address, err)
	}
	return conn, nil
}
