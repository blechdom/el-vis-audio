import React, { useState, useCallback, useEffect } from "react";
import { el, NodeRepr_t } from "@elemaudio/core";
import { Meta, Story } from "@storybook/react";
import styled from "styled-components";
import {
  core,
  Button,
  Oscilloscope,
  PlayPauseAudio,
  Slider,
  audioContext,
} from "../";
require("events").EventEmitter.defaultMaxListeners = 0;

const Demo = () => {
  const [playing, setPlaying] = useState(false);
  const [audioVizData, setAudioVizData] = useState<Array<number>>([]);
  const [steps, setSteps] = useState<number>(3);
  const [startFreq, setStartFreq] = useState<number>(400);
  const [freqDiv, setFreqDiv] = useState<number>(1);
  const [mainVolume, setMainVolume] = useState<number>(0);

  function cycleByPhasor(phasor: NodeRepr_t | number): NodeRepr_t {
    return el.sin(el.mul(2 * Math.PI, phasor)) as NodeRepr_t;
  }

  const recursiveWave = useCallback(
    (signal: NodeRepr_t, frequency: number, count: number): NodeRepr_t => {
      const newFreq = frequency / freqDiv;

      return count > 0 && newFreq < audioContext.sampleRate / 2
        ? recursiveWave(
            cycleByPhasor(
              el.mod(
                el.add(
                  el.phasor(
                    el.sm(
                      el.const({ key: `frequency-${count}`, value: newFreq })
                    ),
                    0
                  ),
                  signal
                ),
                1
              )
            ) as NodeRepr_t,
            newFreq,
            count - 1
          )
        : signal;
    },
    [freqDiv]
  );

  useEffect(() => {
    if (playing) {
      const smoothFreq: NodeRepr_t = el.sm(
        el.const({ key: `startFreq`, value: startFreq })
      );
      const synth = recursiveWave(
        cycleByPhasor(el.phasor(smoothFreq, 0)),
        startFreq,
        steps
      );
      const scaledSynth = el.mul(
        synth,
        el.sm(el.const({ key: `main-amp`, value: mainVolume / 100 }))
      );
      core.render(el.scope({ name: "scope" }, scaledSynth), scaledSynth);
    }
  }, [steps, startFreq, mainVolume, core, playing, freqDiv]);

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
      <h1>Recursive PM Synthesis</h1>
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
        number of recursions = <SliderLabel>{steps}</SliderLabel>
      </h2>
      <Slider
        value={steps}
        step={1}
        min={0}
        max={10}
        onChange={(event) => setSteps(parseFloat(event.target.value))}
      />
      <h2>
        starting frequency = <SliderLabel>{startFreq}</SliderLabel>
      </h2>
      <Slider
        value={startFreq}
        step={0.01}
        min={0}
        max={400}
        onChange={(event) => setStartFreq(parseFloat(event.target.value))}
      />
      <h2>
        frequency divisor = <SliderLabel>{freqDiv}</SliderLabel>
      </h2>
      <Slider
        value={freqDiv}
        min={0.01}
        step={0.01}
        max={20}
        onChange={(event) => setFreqDiv(parseFloat(event.target.value))}
      />{" "}
    </>
  );
};

const SliderLabel = styled.span`
  display: inline-block;
  width: 150px;
  text-align: left;
`;

const Presets = styled.div`
  margin-right: 25px;
`;

const meta: Meta = {
  title: "experiments/Recursive PM",
  component: Demo,
};
export default meta;

const Template: Story = () => <Demo />;

export const Default = Template.bind({});
