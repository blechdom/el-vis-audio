import React, { useState, useCallback, useEffect } from "react";
import { el, NodeRepr_t } from "@elemaudio/core";
import { Meta, Story } from "@storybook/react";
import styled from "styled-components";
import { core, Button, Oscilloscope, PlayPauseAudio, Slider } from "../.";
require("events").EventEmitter.defaultMaxListeners = 0;

const Demo = () => {
  const [playing, setPlaying] = useState(false);
  const [audioVizData, setAudioVizData] = useState<Array<number>>([]);
  const [pitch, setPitch] = useState<number>(670);
  const [tone, setTone] = useState<number>(4000);
  const [attack, setAttack] = useState<number>(0.018);
  const [decay, setDecay] = useState<number>(0.18);
  const [speed, setSpeed] = useState<number>(1.3);
  const [mainVolume, setMainVolume] = useState<number>(0);

  function cycle(freq: NodeRepr_t | number, phaseOffset: NodeRepr_t | number) {
    let t = el.add(el.phasor(freq, 0), phaseOffset);
    let p = el.sub(t, el.floor(t));

    return el.sin(el.mul(2 * Math.PI, p));
  }

  useEffect(() => {
    if (playing) {
      const smoothPitch: NodeRepr_t = el.sm(
        el.const({ key: `pitch`, value: pitch })
      );

      const smoothAttack: NodeRepr_t = el.sm(
        el.const({ key: `attack`, value: attack })
      );

      const smoothDecay: NodeRepr_t = el.sm(
        el.const({ key: `decay`, value: decay })
      );

      const smoothTone: NodeRepr_t = el.sm(
        el.const({ key: `tone`, value: tone })
      );

      const smoothSpeed: NodeRepr_t = el.sm(
        el.const({ key: `speed`, value: speed })
      );

      let m2 = el.noise();
      let m1 = cycle(el.mul(2, smoothPitch), el.mul(2, m2));
      let m0 = cycle(smoothPitch, el.mul(2, m1));

      let f = el.bandpass(smoothTone, 1.214, m0);

      let env = el.adsr(
        smoothAttack,
        smoothDecay,
        0.0,
        0.1,
        el.train(smoothSpeed)
      );

      let synth = el.mul(f, env) as NodeRepr_t;

      const scaledSynth = el.mul(
        synth,
        el.sm(el.const({ key: `main-amp`, value: mainVolume / 100 }))
      );
      core.render(el.scope({ name: "scope" }, scaledSynth), scaledSynth);
    }
  }, [mainVolume, core, playing, pitch, tone, attack, decay, speed]);

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
      <h1>Nick Thompson's Drumsynth - Hat</h1>
      <h5>
        <a
          href={"https://github.com/nick-thompson/drumsynth/blob/master/hat.js"}
        >
          https://github.com/nick-thompson/drumsynth/blob/master/hat.js
        </a>
      </h5>
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
        speed = <SliderLabel>{speed}</SliderLabel>
      </h2>
      <Slider
        value={speed}
        min={0}
        step={0.1}
        max={40}
        onChange={(event) => setSpeed(parseFloat(event.target.value))}
      />
      <h2>
        frequency = <SliderLabel>{pitch}</SliderLabel>
      </h2>
      <Slider
        value={pitch}
        step={0.01}
        min={317}
        max={3170}
        onChange={(event) => setPitch(parseFloat(event.target.value))}
      />
      <h2>
        tone = <SliderLabel>{tone}</SliderLabel>
      </h2>
      <Slider
        value={tone}
        step={0.01}
        min={800}
        max={18000}
        onChange={(event) => setTone(parseFloat(event.target.value))}
      />
      <h2>
        attack = <SliderLabel>{attack}</SliderLabel>
      </h2>
      <Slider
        value={attack}
        step={0.001}
        min={0.005}
        max={0.2}
        onChange={(event) => setAttack(parseFloat(event.target.value))}
      />
      <h2>
        decay = <SliderLabel>{decay}</SliderLabel>
      </h2>
      <Slider
        value={decay}
        step={0.001}
        min={0.005}
        max={4.0}
        onChange={(event) => setDecay(parseFloat(event.target.value))}
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
  title: `experiments/Nick Thompson's DrumSynth Hat`,
  component: Demo,
};
export default meta;

const Template: Story = () => <Demo />;

export const Default = Template.bind({});
