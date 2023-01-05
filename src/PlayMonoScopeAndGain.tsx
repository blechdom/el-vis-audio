import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import {el, NodeRepr_t} from "@elemaudio/core";
import { WebAudioKnob } from "webaudio-controls-react-typescript";
import { PlayMonoScopeAndGainProps } from "./PlayMonoScopeAndGain.types";
import {
  core,
  PlayPauseAudio,
  Oscilloscope,
  Spectrogram, audioContext,
} from "./";

export const PlayMonoScopeAndGain: FC<PlayMonoScopeAndGainProps> = ({
  signal,
  backgroundColor = "#FF0000",
  hoverColor = "#FF7000",
  width = 200,
  height = 80,
  playAudio = true,
  oscilloscope = true,
  spectrogram = true,
  gain = true,
  gainLabel = true,
}) => {
  //const volumeKnob = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [audioVizData, setAudioVizData] = useState<Array<number>>([]);
  const [fftVizData, setFftVizData] = useState<Array<number>>([]);
  const [mainVolume, setMainVolume] = useState<number>(0);

  const signalSynth = useCallback(() => {
    console.log("playing", playing);
    console.log("audioContext status is: ", audioContext.state);

    if (playing && signal) {
      let synth = signal;
      if (gain) {
        synth = el.mul(
          synth,
          el.sm(el.const({ key: `main-amp`, value: mainVolume }))
        ) as NodeRepr_t;
      }
     if(oscilloscope){
       synth = el.scope(
        { name: "scope" },
        synth
      );
     }
     if(spectrogram){
      synth = el.fft({ name: "fft" }, synth);
     }
     return synth as NodeRepr_t;
    }
  }, [core, mainVolume, playing, signal]);

  if(oscilloscope) {
    core.on("scope", function (e) {
      if (e.source === "scope") {
        e.data.length && setAudioVizData(e.data[0]);
      }
    });
  }
  if(spectrogram){
  core.on("fft", function (e) {
    if (e.source === "fft") {
      setFftVizData(e.data.real);
    }
  });}

  return (
    <PlayMonoScopeAndGainFlexBox>
      <PlayPauseAudio onPlay={setPlaying} signal={signalSynth() as NodeRepr_t}/>
      {playing && gain && (
      <WebAudioKnob
        src={"./images/SimpleFlat3.png"}
        min={0}
        step={0.01}
        max={1}
        value={mainVolume}
        onKnobInput={setMainVolume}
      />)}

      {playing && gain && gainLabel && (
        <h4>
          gain =<SliderLabel>{mainVolume.toFixed(2)}</SliderLabel>
        </h4>
      )}

      {playing && oscilloscope && (
        <Oscilloscope
          audioVizData={audioVizData}
          color={backgroundColor}
          width={width}
          height={height}
        />
      )}
      {playing && spectrogram && (
        <Spectrogram
          height={height}
          width={width}
          fftVizData={fftVizData}
          color={backgroundColor}
        />
      )}
    </PlayMonoScopeAndGainFlexBox>
  );
};

const PlayMonoScopeAndGainFlexBox = styled.div`
  justify-content: space-evenly;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  padding: 10px;
  border: 2px solid #FF0000;
`;
const SliderLabel = styled.span`
  padding: 0px;
  margin: 0px;
  width: 150px;
  text-align: left;
`;
