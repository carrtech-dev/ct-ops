//go:build !windows

package updater

import "syscall"

// reExec replaces the current process with a new invocation of `exe`, using
// the supplied args and env. On success this never returns — the kernel
// overlays the current process image with the new binary, preserving PID and
// cgroup membership so systemd does not tear the service down.
func reExec(exe string, args, env []string) error {
	return syscall.Exec(exe, args, env)
}
