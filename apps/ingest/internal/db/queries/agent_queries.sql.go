package queries

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

// PendingAgentQuery is a non-expired, pending one-shot query for a host.
type PendingAgentQuery struct {
	ID        string
	QueryType string
}

// GetPendingQueriesForHost returns non-expired pending queries for a host.
func GetPendingQueriesForHost(ctx context.Context, pool *pgxpool.Pool, hostID string) ([]PendingAgentQuery, error) {
	const q = `
		SELECT id, query_type
		FROM agent_queries
		WHERE host_id = $1
		  AND status = 'pending'
		  AND expires_at > NOW()
		  AND deleted_at IS NULL
	`
	rows, err := pool.Query(ctx, q, hostID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []PendingAgentQuery
	for rows.Next() {
		var row PendingAgentQuery
		if err := rows.Scan(&row.ID, &row.QueryType); err != nil {
			return nil, err
		}
		result = append(result, row)
	}
	return result, rows.Err()
}

// CompleteAgentQuery stores the result and marks the query done.
// resultJSON should be a valid JSON document (or nil for error cases).
func CompleteAgentQuery(
	ctx context.Context,
	pool *pgxpool.Pool,
	queryID, status, errorMsg string,
	resultJSON []byte,
) error {
	const q = `
		UPDATE agent_queries
		SET status = $2,
		    result = $3::jsonb,
		    error = NULLIF($4, ''),
		    completed_at = NOW(),
		    updated_at = NOW()
		WHERE id = $1
	`
	var resultArg any
	if len(resultJSON) > 0 {
		resultArg = string(resultJSON)
	} else {
		resultArg = nil
	}
	_, err := pool.Exec(ctx, q, queryID, status, resultArg, errorMsg)
	return err
}
