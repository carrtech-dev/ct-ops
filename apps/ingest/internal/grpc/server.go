package ingestgrpc

import (
	"context"
	"fmt"
	"net"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
	"google.golang.org/grpc/keepalive"

	"github.com/infrawatch/ingest/internal/handlers"
	agentv1 "github.com/infrawatch/proto/agent/v1"
)

// ingestService implements agentv1.IngestServiceServer.
type ingestService struct {
	agentv1.UnimplementedIngestServiceServer
	reg *handlers.RegisterHandler
	hb  *handlers.HeartbeatHandler
}

func (s *ingestService) Register(ctx context.Context, req *agentv1.RegisterRequest) (*agentv1.RegisterResponse, error) {
	return s.reg.Register(ctx, req)
}

func (s *ingestService) Heartbeat(stream agentv1.IngestService_HeartbeatServer) error {
	return s.hb.Heartbeat(stream)
}

// Serve starts the gRPC server on the given port with TLS credentials.
// Blocks until the server stops.
func Serve(port int, creds credentials.TransportCredentials, reg *handlers.RegisterHandler, hb *handlers.HeartbeatHandler) error {
	lis, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		return fmt.Errorf("listening on :%d: %w", port, err)
	}

	// Permit the agent's 30s client pings (with safety margin) and proactively
	// ping idle agents from the server side too, so a dead peer is detected
	// within ~80s instead of waiting for the OS TCP timeout.
	enforcement := keepalive.EnforcementPolicy{
		MinTime:             10 * time.Second,
		PermitWithoutStream: true,
	}
	serverKp := keepalive.ServerParameters{
		Time:    60 * time.Second,
		Timeout: 20 * time.Second,
	}

	opts := []grpc.ServerOption{
		grpc.Creds(creds),
		grpc.KeepaliveEnforcementPolicy(enforcement),
		grpc.KeepaliveParams(serverKp),
		grpc.ChainUnaryInterceptor(RecoveryUnaryInterceptor, LoggingUnaryInterceptor),
		grpc.ChainStreamInterceptor(RecoveryStreamInterceptor, LoggingStreamInterceptor),
	}
	grpcServer := grpc.NewServer(opts...)

	svc := &ingestService{reg: reg, hb: hb}
	agentv1.RegisterIngestServiceServer(grpcServer, svc)

	return grpcServer.Serve(lis)
}
