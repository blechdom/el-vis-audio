import WebRenderer from "@elemaudio/web-renderer";
import { audioContext } from "./audioContext";

export const core: WebRenderer = new WebRenderer();

async function main() {
  console.log("Initializing WebRenderer Core");
  let node = await core.initialize(audioContext, {
    numberOfInputs: 0,
    numberOfOutputs: 1,
    outputChannelCount: [2],
  });
  node.connect(audioContext.destination);
}

main();

core.on("load", () => {
  console.log("Core Successfully Loaded");
});
