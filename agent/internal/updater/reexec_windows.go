//go:build windows

package updater

import (
	"fmt"
	"os"
	"os/exec"
)

// reExec on Windows spawns the new binary as a child process and exits the
// current one. Windows has no equivalent of syscall.Exec, so the service
// manager is expected to be configured to restart the service on exit.
func reExec(exe string, args, env []string) error {
	cmd := exec.Command(exe, args[1:]...) //nolint:gosec // exe is our own binary
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Env = env

	if err := cmd.Start(); err != nil {
		return fmt.Errorf("starting updated agent process: %w", err)
	}
	os.Exit(0)
	return nil // unreachable
}
