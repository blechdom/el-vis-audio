import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { el, NodeRepr_t } from "@elemaudio/core";
import { Meta, Story } from "@storybook/react";
import { core, Oscilloscope, PlayPauseAudio, Slider } from "../";
require("events").EventEmitter.defaultMaxListeners = 0;

type OptionType = {
  value: string;
  label: string;
};

const options: OptionType[] = [
  { value: "blepsaw", label: "blepsaw" },
  { value: "blepsquare", label: "blepsquare" },
  { value: "bleptriangle", label: "bleptriangle" },
  { value: "cycle", label: "cycle" },
  { value: "phasor", label: "phasor" },
  { value: "saw", label: "saw" },
  { value: "square", label: "square" },
  { value: "triangle", label: "triangle" },
];

type DemoProps = {
  color: string;
  height: number;
  width: number;
};

const Demo = (args: DemoProps) => {
  const [playing, setPlaying] = useState(false);
  const [audioVizData, setAudioVizData] = useState<Array<number>>([]);
  const [waveform, setWaveform] = useState<OptionType>(options[3]);
  const [frequency, setFrequency] = useState(200);

  const waveformSynth: NodeRepr_t = useMemo(() => {
    switch (waveform.value) {
      case "blepsaw":
        return el.blepsaw(frequency);
      case "blepsquare":
        return el.blepsquare(frequency);
      case "bleptriangle":
        return el.bleptriangle(frequency);
      case "cycle":
        return el.cycle(frequency);
      case "phasor":
        return el.phasor(frequency, 0);
      case "saw":
        return el.saw(frequency);
      case "square":
        return el.square(frequency);
      case "triangle":
        return el.triangle(frequency);
      default:
        return el.cycle(frequency);
    }
  }, [waveform.value, frequency]);

  useEffect(() => {
    if (playing) {
      const synth = el.scope(
        { name: "scope" },
        el.mul(waveformSynth, el.const({ key: "amp", value: 0.25 }))
      );
      core.render(synth, synth);
    }
  }, [playing, waveformSynth]);

  function handleScopeData(data: Array<Array<number>>) {
    if (data.length) {
      setAudioVizData(data[0]);
    }
  }

  core?.on("scope", function (e) {
    if (e.source === "scope") {
      handleScopeData(e.data);
    }
  });

  return (
    <>
      <PlayPauseAudio onPlay={setPlaying} />
      <br />
      <Select
        options={options}
        value={waveform}
        onChange={(option) => setWaveform(option ? option : options[3])}
      />
      <br />
      <Slider
        value={frequency}
        min={0.1}
        max={1000}
        step={0.1}
        onChange={(event) => setFrequency(parseFloat(event.target.value))}
      />
      <br />
      <Oscilloscope audioVizData={audioVizData} {...args} />
    </>
  );
};

const meta: Meta = {
  title: "elementary/Oscillators",
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
