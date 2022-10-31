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
  const [modAmp, setModAmp] = useState<number>(9583);
  const [startFreq, setStartFreq] = useState<number>(3.32);
  const [startOffset, setStartOffset] = useState<number>(6335);
  const [modAmpDiv, setModAmpDiv] = useState<number>(2.48);
  const [mainVolume, setMainVolume] = useState<number>(0);

  const [presets, setPresets] = useState([
    [3, 7307, 3.32, 3.68, 0],
    [2, 6508, 5.25, 5.56, 5057],
    [2, 1650, 0.06, 0.18, 0],
    [5, 4236, 0.18, 1.53, 4000],
    [3, 2340, 7, 0.75, 2000],
  ]);

  const recursiveFM = useCallback(
    (t: NodeRepr_t, amp: number, counter: number): NodeRepr_t => {
      return counter > 0
        ? recursiveFM(
            el.cycle(
              el.mul(t, el.sm(el.const({ key: `amp-${counter}`, value: amp })))
            ),
            amp / modAmpDiv,
            counter - 1
          )
        : t;
    },
    [modAmpDiv]
  );
  useEffect(() => {
    if (playing) {
      const synth = recursiveFM(
        el.cycle(
          el.add(
            el.mul(
              el.cycle(
                el.sm(el.const({ key: `start-freq`, value: startFreq }))
              ),
              el.sm(el.const({ key: `start-amp`, value: modAmp }))
            ),
            el.sm(el.const({ key: `start-amp-offset`, value: startOffset }))
          )
        ),
        modAmp,
        steps
      );

      core.render(
        el.scope(
          { name: "scope" },
          el.mul(
            synth,
            el.sm(el.const({ key: `main-amp-left`, value: mainVolume / 100 }))
          )
        ),
        el.mul(
          synth,
          el.sm(el.const({ key: `main-amp-right`, value: mainVolume / 100 }))
        )
      );
    }
  }, [
    modAmp,
    steps,
    startOffset,
    startFreq,
    recursiveFM,
    mainVolume,
    core,
    playing,
  ]);

  function loadPreset(i: number) {
    setSteps(presets[i][0]);
    setModAmp(presets[i][1]);
    setStartFreq(presets[i][2]);
    setModAmpDiv(presets[i][3]);
    setStartOffset(presets[i][4]);
  }

  function addNewPreset() {
    setPresets((presets) => [
      ...presets,
      [steps, modAmp, startFreq, modAmpDiv],
    ]);
  }

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
      <h1>Recursive FM Synthesis</h1>
      <PlayPauseAudio onPlay={setPlaying} />
      <Oscilloscope
        audioVizData={audioVizData}
        color={"#FF0000"}
        width={400}
        height={100}
      />
      <br />
      <Presets>
        {presets.map((preset, i) => (
          <StyledButton
            key={`preset-${i}`}
            onClick={() => loadPreset(i)}
            label={`Preset ${i + 1}`}
          />
        ))}
      </Presets>
      <div>
        <StyledButton
          key={`plus`}
          onClick={addNewPreset}
          label={`+ Add Preset`}
        />
      </div>
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
        min={0}
        max={20000}
        onChange={(event) => setModAmp(parseFloat(event.target.value))}
      />
      <h2>
        starting offset (modulator bias) ={" "}
        <SliderLabel>{startOffset}</SliderLabel>
      </h2>
      <Slider
        value={startOffset}
        min={0}
        max={modAmp * 2}
        onChange={(event) => setStartOffset(parseFloat(event.target.value))}
      />
      <h2>
        starting frequency = <SliderLabel>{startFreq}</SliderLabel>
      </h2>
      <Slider
        value={startFreq}
        step={0.01}
        min={0}
        max={40}
        onChange={(event) => setStartFreq(parseFloat(event.target.value))}
      />
      <h2>
        modulation amplitude divisor = <SliderLabel>{modAmpDiv}</SliderLabel>
      </h2>
      <Slider
        value={modAmpDiv}
        min={0.01}
        step={0.01}
        max={8}
        onChange={(event) => setModAmpDiv(parseFloat(event.target.value))}
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

export const meta: Meta = {
  title: "experiments/Recursive FM",
  component: Demo,
};

const Template: Story = () => <Demo />;

export const Default = Template.bind({});
