import React, { useEffect, useState } from "react";
import { el } from "@elemaudio/core";
import { Meta, Story } from "@storybook/react";
import { core, Oscilloscope, PlayPauseAudio } from "../";

type DemoProps = {
  color: string;
  height: number;
  width: number;
};

const Demo = (args: DemoProps) => {
  const [playing, setPlaying] = useState(false);
  const [audioVizData, setAudioVizData] = useState<Array<number>>([]);

  useEffect(() => {
    if (playing) {
      playSynth();
    }
  }, [playing]);

  function handleScopeData(data: Array<Array<number>>) {
    if (data.length) {
      setAudioVizData(data[0]);
    }
  }

  const playSynth = () => {
    console.log("playing synth");
    const synth = el.scope({ name: "scope" }, el.mul(el.cycle(200), 0.25));
    core.render(synth, synth);
  };

  core?.on("scope", function (e) {
    if (e.source === "scope") {
      handleScopeData(e.data);
    }
  });

  return (
    <>
      <PlayPauseAudio onPlay={setPlaying} />
      <br />
      <Oscilloscope audioVizData={audioVizData} {...args} />
    </>
  );
};

const meta: Meta = {
  title: "analyzer/Oscilloscope",
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
