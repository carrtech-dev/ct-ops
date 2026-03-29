.PHONY: proto go-build go-test agent ingest clean

PROTO_OUT := proto/gen/go

# Generate Go code from .proto sources.
# Requires: protoc, protoc-gen-go, protoc-gen-go-grpc
# Install: go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
#          go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
proto:
	@echo "Generating Go proto bindings..."
	protoc \
		--go_out=$(PROTO_OUT) --go_opt=paths=source_relative \
		--go-grpc_out=$(PROTO_OUT) --go-grpc_opt=paths=source_relative \
		-I proto \
		proto/agent/v1/*.proto
	@echo "Done. Generated files in $(PROTO_OUT)/agent/v1/"
	@echo "NOTE: Remove $(PROTO_OUT)/agent/v1/codec.go after running proto generation."

# Build agent and ingest binaries.
go-build: agent ingest

agent:
	@echo "Building agent..."
	@mkdir -p dist
	docker run --rm \
		-v "$(CURDIR):/src" \
		-w /src \
		--user "$(shell id -u):$(shell id -g)" \
		golang:1.23 \
		go build -o dist/agent ./agent/cmd/agent
	@echo "Agent binary: dist/agent"

ingest:
	@echo "Building ingest service..."
	@mkdir -p dist
	docker run --rm \
		-v "$(CURDIR):/src" \
		-w /src \
		--user "$(shell id -u):$(shell id -g)" \
		golang:1.23 \
		go build -o dist/ingest ./apps/ingest/cmd/ingest
	@echo "Ingest binary: dist/ingest"

go-test:
	docker run --rm \
		-v "$(CURDIR):/src" \
		-w /src \
		golang:1.23 \
		go test ./agent/... ./apps/ingest/...

# Download all Go dependencies.
go-deps:
	docker run --rm \
		-v "$(CURDIR):/src" \
		-w /src \
		golang:1.23 \
		sh -c "go work sync && cd proto/gen/go && go mod tidy && cd /src/agent && go mod tidy && cd /src/apps/ingest && go mod tidy"

# Generate dev TLS certificates for local development (requires Docker).
dev-tls:
	@mkdir -p deploy/dev-tls
	docker run --rm \
		-v "$(CURDIR)/deploy/dev-tls:/out" \
		alpine/openssl req -x509 \
		-newkey rsa:4096 \
		-keyout /out/server.key \
		-out /out/server.crt \
		-days 365 \
		-nodes \
		-subj "/CN=localhost" \
		-addext "subjectAltName=DNS:localhost,DNS:ingest,IP:127.0.0.1" \
		2>/dev/null
	@echo "Generated deploy/dev-tls/server.crt and deploy/dev-tls/server.key"

clean:
	rm -rf dist/ deploy/dev-tls/
