import { el } from "@elemaudio/core";
import { Meta, Story } from "@storybook/react";
import React, { useEffect, useState } from "react";
import { core, PlayPauseAudio, Spectrogram } from "../";

type DemoProps = {
  color: string;
  height: number;
  width: number;
};

const Demo = (args: DemoProps) => {
  const [playing, setPlaying] = useState<boolean>(false);
  const [fftVizData, setFftVizData] = useState<Array<number>>([]);

  useEffect(() => {
    if (playing) {
      playSynth();
    }
    return core.reset();
  }, [playing]);

  const playSynth = () => {
    const synth = el.fft({ name: "fft" }, el.mul(el.cycle(200), 0.25));
    core.render(synth, synth);
  };

  core?.on("fft", function (e) {
    if (e.source === "fft") {
      setFftVizData(e.data.real);
    }
  });

  return (
    <>
      <PlayPauseAudio onPlay={setPlaying} />
      <br />
      <Spectrogram fftVizData={fftVizData} {...args} />
    </>
  );
};

const meta: Meta = {
  title: "analyzer/Spectrogram",
  component: Demo,
};

export default meta;

const Template: Story<DemoProps> = (args) => <Demo {...args} />;

export const Default = Template.bind({});

Default.args = {
  color: "#FF0000",
  width: 500,
  height: 250,
};
