import subprocess
import sys

log_file = open("git_log.txt", "w")

def run_git(args):
    try:
        result = subprocess.run(["git"] + args, capture_output=True, text=True)
        log_file.write(f"Command: git {' '.join(args)}\n")
        if result.returncode == 0:
            log_file.write(f"Success\n")
            if result.stdout:
                log_file.write(f"Stdout: {result.stdout}\n")
        else:
            log_file.write(f"Error (Exit Code {result.returncode})\n")
            if result.stderr:
                log_file.write(f"Stderr: {result.stderr}\n")
            if result.stdout:
                log_file.write(f"Stdout: {result.stdout}\n")
    except Exception as e:
        log_file.write(f"Exception: {e}\n")

# Remove existing origin just in case
run_git(["remote", "remove", "origin"])

# Add origin
run_git(["remote", "add", "origin", "https://github.com/charoensinko/mastersheet.git"])

# Verify remote
run_git(["remote", "-v"])

# Rename branch
run_git(["branch", "-M", "main"])

# Fetch
run_git(["fetch", "origin"])

# Status
run_git(["status"])

# Pull (might fail if unrelated histories)
run_git(["pull", "origin", "main", "--allow-unrelated-histories"])

log_file.close()
