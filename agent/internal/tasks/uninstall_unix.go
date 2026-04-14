//go:build !windows

package tasks

import (
	"fmt"
	"os"
	"os/exec"
	"syscall"
)

// launchDetachedUninstaller spawns the agent binary with -uninstall in a new
// session so it survives when systemd / launchd terminates the current process.
// Stdout and stderr are redirected to /tmp/infrawatch-uninstall.log so an
// operator can see the uninstall outcome after the agent has gone.
func launchDetachedUninstaller(binPath string) error {
	const logPath = "/tmp/infrawatch-uninstall.log"
	logFile, err := os.OpenFile(logPath, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0644)
	if err != nil {
		// Logging is best-effort — don't abort the uninstall just because
		// we can't open a log file (unusual but possible on read-only /tmp).
		logFile = nil
	}

	cmd := exec.Command(binPath, "-uninstall")
	cmd.SysProcAttr = &syscall.SysProcAttr{Setsid: true}
	if logFile != nil {
		cmd.Stdout = logFile
		cmd.Stderr = logFile
	}

	if err := cmd.Start(); err != nil {
		if logFile != nil {
			_ = logFile.Close()
		}
		return fmt.Errorf("starting uninstaller: %w", err)
	}
	// Intentionally do not Wait — the child runs independently and this
	// process is about to be terminated by the service manager.
	return nil
}
