import React, { useState, useCallback, useEffect } from "react";
import { el, NodeRepr_t } from "@elemaudio/core";
import { Meta, Story } from "@storybook/react";
import styled from "styled-components";
import { core, Button, Oscilloscope, PlayPauseAudio, Slider } from "../";
require("events").EventEmitter.defaultMaxListeners = 0;

const Demo = () => {
  const [playing, setPlaying] = useState(false);
  const [audioVizData, setAudioVizData] = useState<Array<number>>([]);
  const [steps, setSteps] = useState<number>(3);
  const [modAmp, setModAmp] = useState<number>(1);
  const [carrierFreq, setCarrierFreq] = useState<number>(400);
  const [startFreq, setStartFreq] = useState<number>(1);
  const [freqDiv, setFreqDiv] = useState<number>(1);
  const [ampDiv, setAmpDiv] = useState<number>(1);
  const [mainVolume, setMainVolume] = useState<number>(0);

  const recursiveWave = useCallback(
    (frequency: NodeRepr_t, amp: NodeRepr_t, count: number): NodeRepr_t => {
      const smoothFreqDiv: NodeRepr_t = el.sm(
        el.const({ key: `freqDiv`, value: 1 / freqDiv })
      );
      const smoothAmpDiv: NodeRepr_t = el.sm(
        el.const({ key: `ampDiv`, value: 1 / ampDiv })
      );
      return count > 0
        ? (el.mul(
            el.sin(
              el.mul(
                2 * Math.PI,
                el.mod(
                  el.add(
                    el.phasor(frequency, 0),
                    recursiveWave(
                      el.mul(frequency, smoothFreqDiv) as NodeRepr_t,
                      el.mul(amp, smoothAmpDiv) as NodeRepr_t,
                      count - 1
                    )
                  ),
                  1
                )
              )
            ),
            amp
          ) as NodeRepr_t)
        : (el.mul(
            el.sin(el.mul(2 * Math.PI, el.phasor(frequency, 0))),
            amp
          ) as NodeRepr_t);
    },
    [freqDiv, ampDiv]
  );

  useEffect(() => {
    if (playing) {
      const smoothCarrierFreq: NodeRepr_t = el.sm(
        el.const({ key: `carrierFreq`, value: carrierFreq })
      );
      const smoothFreq: NodeRepr_t = el.sm(
        el.const({ key: `startFreq`, value: startFreq })
      );
      const smoothAmp: NodeRepr_t = el.sm(
        el.const({ key: `modAmp`, value: modAmp })
      );

      const synth = el.sin(
        el.mul(2 * Math.PI, el.phasor(smoothCarrierFreq, 0))
      );
      //const synth = recursiveWave(smoothFreq, smoothAmp, steps);
      const scaledSynth = el.mul(
        synth,
        el.sm(el.const({ key: `main-amp`, value: mainVolume / 100 }))
      );
      core.render(el.scope({ name: "scope" }, scaledSynth), scaledSynth);
    }
  }, [
    modAmp,
    steps,
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
      <h1>Recursive PM Synthesis v2</h1>
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
        modulation amplitude = <SliderLabel>{modAmp}</SliderLabel>
      </h2>
      <Slider
        value={modAmp}
        min={0.01}
        max={2}
        onChange={(event) => setModAmp(parseFloat(event.target.value))}
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
        starting modulator frequency = <SliderLabel>{startFreq}</SliderLabel>
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
      <h2>
        amplitude divisor = <SliderLabel>{ampDiv}</SliderLabel>
      </h2>
      <Slider
        value={ampDiv}
        min={0.01}
        step={0.01}
        max={2}
        onChange={(event) => setAmpDiv(parseFloat(event.target.value))}
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
  title: "experiments/Recursive PM v2",
  component: Demo,
};
export default meta;

const Template: Story = () => <Demo />;

export const Default = Template.bind({});
