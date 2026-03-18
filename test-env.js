const { spawn } = require("child_process");
async function getDesktopEnv() {
  return new Promise((resolve) => {
    const child = spawn("systemctl", ["--user", "show-environment"]);
    let output = "";
    child.stdout.on("data", (chunk) => { output += chunk.toString(); });
    child.on("exit", () => {
      const env = {};
      for (const line of output.split("\n")) {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) env[match[1]] = match[2];
      }
      resolve(env);
    });
    child.on("error", () => resolve({}));
  });
}
getDesktopEnv().then(env => console.log(env.DISPLAY, env.WAYLAND_DISPLAY, env.DBUS_SESSION_BUS_ADDRESS));
