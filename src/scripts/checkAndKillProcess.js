const { exec } = require("child_process");

const DELAY_BEFORE_KILL = 20000;

/* Kill the processes whose ports are at 4000 and the states are CLOSE_WAIT */
const checkAndKillProcess = () => {
  exec(
    "pids=$(lsof -i tcp:4000 | grep CLOSE_WAIT | awk '{print $2}'); for pid in $pids; do echo \"Killing process with PID $pid\"; kill -9 $pid; done",
    (error, stdout) => {
      if (error) {
        console.error("Error:", error);
        return;
      }
      console.log(stdout);
    }
  );
};

/* Wait for DELAY_BEFORE_KILL before killing the processes */
/* CLOSE_WAIT processes do not immediately appear in the process list */
const checkAndKillProcessAfterDelay = () => setTimeout(checkAndKillProcess, DELAY_BEFORE_KILL);

module.exports = { checkAndKillProcessAfterDelay };
