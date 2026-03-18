const { spawn } = require("child_process");
function serviceStatus(serviceName) {
  return new Promise((resolve) => {
    const child = spawn("systemctl", ["--user", "show", serviceName, "-p", "LoadState", "-p", "ActiveState", "-p", "SubState", "--value"]);
    let output = "";
    child.stdout.on("data", (chunk) => { output += chunk.toString(); });
    child.on("error", () => resolve("unknown"));
    child.on("exit", () => {
      const lines = output.trim().split("\n");
      if (lines.length >= 3) {
        const [loadState, activeState, subState] = lines;
        if (loadState === "not-found") return resolve("not found");
        return resolve(`${activeState} (${subState})`);
      }
      resolve("unknown");
    });
  });
}
serviceStatus("radar-db-tunnel.service").then(console.log);
serviceStatus("nonexistent.service").then(console.log);
