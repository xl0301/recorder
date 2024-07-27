import { WebContainer } from "@webcontainer/api";
import { files } from "./file";
let webcontainerInstance;

async function installDependencies() {
  // Install dependencies
  const installProcess = await webcontainerInstance.spawn("npm", ["install"]);
  // Wait for install command to exit
  //读取指令
  installProcess.output.pipeTo(
    new WritableStream({
      write(data) {
        console.log(data);
      },
    })
  );
  return installProcess.exit;
}
async function startDevServer() {
  // Run `npm run start` to start the Express app
  const res = await webcontainerInstance.spawn("npm", ["run", "start"]);
  res.output.pipeTo(
    new WritableStream({
      write(data) {
        console.log(data);
      },
    })
  );
  // Wait for `server-ready` event
}

// window.addEventListener("load", async () => {
//   // Call only once
//   console.log(files);
//   webcontainerInstance = await WebContainer.boot();
//   await webcontainerInstance.mount(files);
//   const packageJSON = await webcontainerInstance.fs.readFile(
//     "package.json",
//     "utf-8"
//   );
//   console.log(packageJSON);
//   const exitCode = await installDependencies();
//   if (exitCode !== 0) {
//     throw new Error("Installation failed");
//   }
//   startDevServer();
// });
