const { exec } = require("child_process");

const DELAY_BEFORE_KILL = 3600000; // 1 hour in milliseconds

/* Check and Kill the processes whose ports are at 4000 and the states are CLOSE_WAIT */
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

/* Do it every DELAY_BEFORE_KILL seconds */
const checkAndKillProcessAfterDelay = () => setInterval(checkAndKillProcess, DELAY_BEFORE_KILL);

module.exports = { checkAndKillProcessAfterDelay };
