import WebRenderer from "@elemaudio/web-renderer";

export const audioContext: AudioContext = new AudioContext({
  latencyHint: "interactive",
  sampleRate: 44100,
});

export const core: WebRenderer = new WebRenderer();

export * from "./Oscilloscope";
export * from "./Slider";

core.on("load", () => {
  core.on("error", (e: unknown) => {
    console.error("conre error: ", e);
  });

  // required for audio stuff to happen
});

async function main() {
  let node = await core.initialize(audioContext, {
    numberOfInputs: 0,
    numberOfOutputs: 1,
    outputChannelCount: [2],
  });
  node.connect(audioContext.destination);
}

main();

export * from "./Oscilloscope";
export * from "./Slider";
