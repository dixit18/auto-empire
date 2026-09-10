"""Empire watchdog: independent second process that keeps the orchestrator honest.
Every 60s it checks bus freshness; if the bus is quiet >180s it kills any
stuck orchestrator and starts a fresh one. Logs to empire/runner/watchdog.log.
Run: python scripts/watchdog.py   (detached, survives on its own)
Why separate: the orchestrator can wedge silently while staying alive;
only an outside observer can tell 'alive' from 'working'."""
import os
import subprocess
import sys
import time
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BUS = os.path.join(ROOT, "empire", "_bus", "log.jsonl")
WLOG = os.path.join(ROOT, "empire", "runner", "watchdog.log")
STALE_SEC = 180
CHECK_SEC = 60


def note(msg):
    line = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S") + " WATCHDOG " + msg
    print(line, flush=True)
    try:
        with open(WLOG, "a", encoding="utf-8") as f:
            f.write(line + "\n")
    except Exception:
        pass


def orch_procs():
    # PID-file first (deterministic); process-scan only as fallback.
    out = []
    try:
        with open(os.path.join(ROOT, "empire", "runner", "orchestrator.pid"), encoding="utf-8") as f:
            pid = int(f.read().strip().split()[0])
        os.kill(pid, 0)
        return [pid]
    except Exception:
        pass
    try:
        ps = subprocess.run(["wmic", "process", "where", "name='python.exe' or name='pythonw.exe'",
                             "get", "ProcessId,CommandLine", "/format:csv"],
                            capture_output=True, text=True, timeout=20).stdout.splitlines()
        for line in ps[1:]:
            if "orchestrator.py" in line:
                parts = line.strip().split(",")
                try:
                    out.append(int(parts[-1]))
                except Exception:
                    pass
    except Exception:
        pass
    return out


def bus_age_sec():
    try:
        best = 0.0
        with open(BUS, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line.startswith("{"):
                    continue
                try:
                    import json
                    ts = json.loads(line).get("ts", "")
                    dt = datetime.fromisoformat(ts)
                    if dt.tzinfo is None:
                        dt = dt.replace(tzinfo=timezone.utc)
                    best = max(best, dt.timestamp())
                except Exception:
                    continue
        if not best:
            return 1e9
        return time.time() - best
    except Exception:
        return 1e9


def start_fresh():
    creation = 0
    if sys.platform == "win32":
        creation = getattr(subprocess, "CREATE_NO_WINDOW", 0x08000000)
    subprocess.Popen([sys.executable, os.path.join("empire", "runner", "orchestrator.py"), "--auto"],
                     cwd=ROOT, stdout=open(os.path.join(ROOT, "empire", "runner", "run.log"), "a"),
                     stderr=subprocess.STDOUT, creationflags=creation)


def main():
    note("watching (bus >%ds stale = restart)" % STALE_SEC)
    while True:
        try:
            age = bus_age_sec()
            procs = orch_procs()
            if age > STALE_SEC:
                note("bus quiet %.0fs, restarting %d stuck proc(s)" % (age, len(procs)))
                for pid in procs:
                    try:
                        if sys.platform == "win32":
                            subprocess.run(["taskkill", "/PID", str(pid), "/F"], capture_output=True, timeout=15)
                        else:
                            os.kill(pid, 9)
                    except Exception as e:
                        note("kill failed %s: %s" % (pid, e))
                time.sleep(3)
                start_fresh()
                note("fresh orchestrator started")
            time.sleep(CHECK_SEC)
        except Exception as e:
            note("loop error (surviving): %s" % e)
            time.sleep(CHECK_SEC)


if __name__ == "__main__":
    main()
