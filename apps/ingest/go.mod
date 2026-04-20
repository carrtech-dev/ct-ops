module github.com/infrawatch/ingest

go 1.25.0

require (
	github.com/coder/websocket v1.8.14
	github.com/golang-jwt/jwt/v5 v5.2.1
	github.com/infrawatch/proto v0.0.0
	github.com/jackc/pgx/v5 v5.7.2
	google.golang.org/grpc v1.68.0
	gopkg.in/yaml.v3 v3.0.1
)

require (
	github.com/jackc/pgpassfile v1.0.0 // indirect
	github.com/jackc/pgservicefile v0.0.0-20240606120523-5a60cdf6a761 // indirect
	github.com/jackc/puddle/v2 v2.2.2 // indirect
	github.com/kr/text v0.2.0 // indirect
	github.com/robfig/cron/v3 v3.0.1 // indirect
	github.com/rogpeppe/go-internal v1.14.1 // indirect
	golang.org/x/crypto v0.48.0 // indirect
	golang.org/x/net v0.50.0 // indirect
	golang.org/x/sync v0.20.0 // indirect
	golang.org/x/sys v0.42.0 // indirect
	golang.org/x/text v0.35.0 // indirect
	google.golang.org/genproto/googleapis/rpc v0.0.0-20241118233622-e639e219e697 // indirect
	google.golang.org/protobuf v1.35.2 // indirect
)

// Local workspace module — resolved via go.work in the repo root.
replace github.com/infrawatch/proto => ../../proto/gen/go
