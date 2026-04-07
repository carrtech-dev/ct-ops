package handlers

import (
	"bytes"
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"log/slog"
	"net/http"
	"time"
)

// AlertEvent is the payload sent to webhook notification channels.
type AlertEvent struct {
	Event     string `json:"event"`     // "alert.fired" | "alert.resolved"
	Severity  string `json:"severity"`  // "info" | "warning" | "critical"
	Host      string `json:"host"`
	Rule      string `json:"rule"`
	Message   string `json:"message"`
	Timestamp string `json:"timestamp"` // ISO 8601
}

// postWebhook POSTs an AlertEvent to a single URL. If secret is non-empty, an
// HMAC-SHA256 signature is added as X-Infrawatch-Signature. Failures are logged
// and discarded — webhook delivery is best-effort.
func postWebhook(ctx context.Context, url, secret string, event AlertEvent) {
	body, err := json.Marshal(event)
	if err != nil {
		slog.Warn("webhook: marshalling event", "url", url, "err", err)
		return
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader(body))
	if err != nil {
		slog.Warn("webhook: building request", "url", url, "err", err)
		return
	}
	req.Header.Set("Content-Type", "application/json")
	if secret != "" {
		mac := hmac.New(sha256.New, []byte(secret))
		mac.Write(body)
		req.Header.Set("X-Infrawatch-Signature", "sha256="+hex.EncodeToString(mac.Sum(nil)))
	}

	client := &http.Client{Timeout: 5 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		slog.Warn("webhook: delivery failed", "url", url, "err", err)
		return
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 400 {
		slog.Warn("webhook: non-2xx response", "url", url, "status", resp.StatusCode)
	}
}
