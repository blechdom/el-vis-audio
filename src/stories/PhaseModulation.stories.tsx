import React, { useState, useCallback, useEffect } from "react";
import { el, NodeRepr_t } from "@elemaudio/core";
import { Meta, Story } from "@storybook/react";
import styled from "styled-components";
import { core, Button, Oscilloscope, PlayPauseAudio, Slider } from "../.";
require("events").EventEmitter.defaultMaxListeners = 0;

const Demo = () => {
  const [playing, setPlaying] = useState(false);
  const [audioVizData, setAudioVizData] = useState<Array<number>>([]);
  const [indexOfMod, setIndexOfMod] = useState<number>(1);
  const [carrierFreq, setCarrierFreq] = useState<number>(400);
  const [startFreq, setStartFreq] = useState<number>(1);
  const [freqDiv, setFreqDiv] = useState<number>(1);
  const [ampDiv, setAmpDiv] = useState<number>(1);
  const [mainVolume, setMainVolume] = useState<number>(0);

  function cycleByPhasor(phasor: NodeRepr_t | number) {
    return el.sin(el.mul(2 * Math.PI, phasor));
  }

  useEffect(() => {
    if (playing) {
      const smoothCarrierFreq: NodeRepr_t = el.sm(
        el.const({ key: `carrierFreq`, value: carrierFreq })
      );
      const smoothModulationFreq: NodeRepr_t = el.sm(
        el.const({ key: `startFreq`, value: startFreq })
      );

      const indexOfModulation: NodeRepr_t = el.sm(
        el.const({ key: `indexOfMod`, value: indexOfMod })
      );

      const carrierPhasor = el.phasor(smoothCarrierFreq, 0);
      const modulatorPhasor = el.phasor(smoothModulationFreq, 0);

      const synth = cycleByPhasor(
        el.mod(
          el.add(
            modulatorPhasor,
            el.mul(cycleByPhasor(carrierPhasor), indexOfModulation)
          ),
          1
        )
      );

      const scaledSynth = el.mul(
        synth,
        el.sm(el.const({ key: `main-amp`, value: mainVolume / 100 }))
      );
      core.render(el.scope({ name: "scope" }, scaledSynth), scaledSynth);
    }
  }, [
    indexOfMod,
    carrierFreq,
    startFreq,
    mainVolume,
    core,
    playing,
    freqDiv,
    ampDiv,
  ]);

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
      <h1>Phase Modulation</h1>
      <PlayPauseAudio onPlay={setPlaying} />
      <Oscilloscope
        audioVizData={audioVizData}
        color={"#FF0000"}
        width={400}
        height={100}
      />
      <br />
      <h2>
        main volume = <SliderLabel>{mainVolume}</SliderLabel>
      </h2>
      <Slider
        value={mainVolume}
        min={0}
        step={0.1}
        max={100}
        onChange={(event) => setMainVolume(parseFloat(event.target.value))}
      />
      <h2>
        carrier frequency = <SliderLabel>{carrierFreq}</SliderLabel>
      </h2>
      <Slider
        value={carrierFreq}
        step={0.01}
        min={0}
        max={1200}
        onChange={(event) => setCarrierFreq(parseFloat(event.target.value))}
      />
      <h2>
        modulator frequency = <SliderLabel>{startFreq}</SliderLabel>
      </h2>
      <Slider
        value={startFreq}
        step={0.01}
        min={0}
        max={400}
        onChange={(event) => setStartFreq(parseFloat(event.target.value))}
      />
      <h2>
        index of modulation = <SliderLabel>{indexOfMod}</SliderLabel>
      </h2>
      <Slider
        value={indexOfMod}
        step={0.01}
        min={0}
        max={20}
        onChange={(event) => setIndexOfMod(parseFloat(event.target.value))}
      />
    </>
  );
};

const StyledButton = styled(Button)`
  background-color: #0f9ff5;
  color: #ffffff;
  border: none;
  margin: 0.5em 0.5em 0.5em 0;
  padding: 0.5em;
  :hover {
    background-color: #ffab00;
    color: #000000;
  }
`;

const SliderLabel = styled.span`
  display: inline-block;
  width: 150px;
  text-align: left;
`;

const Presets = styled.div`
  margin-right: 25px;
`;

const meta: Meta = {
  title: "experiments/Phase Modulation",
  component: Demo,
};
export default meta;

const Template: Story = () => <Demo />;

export const Default = Template.bind({});
