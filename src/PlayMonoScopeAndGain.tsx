import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { el, NodeRepr_t } from "@elemaudio/core";
import { PlayMonoScopeAndGainProps } from "./PlayMonoScopeAndGain.types";
import {
  core,
  PlayPauseCoreAudio,
  KnobParamLabel,
  Oscilloscope,
  Spectrogram,
} from "./";

export const PlayMonoScopeAndGain: FC<PlayMonoScopeAndGainProps> = ({
  signal = null,
  backgroundColor = "#FF0000",
  width = 200,
  height = 80,
  oscilloscope = true,
  spectrogram = true,
  gain = true,
  isPlaying,
}) => {
  const [playing, setPlaying] = useState(false);
  const [audioVizData, setAudioVizData] = useState<Array<number>>([]);
  const [fftVizData, setFftVizData] = useState<Array<number>>([]);
  const [mainVolume, setMainVolume] = useState<number>(0);

  const updatePlaying = (play: boolean) => {
    setPlaying(play);
    isPlaying && isPlaying(play);
  };

  const signalSynth = useCallback(() => {
    if (playing && signal) {
      let synth = signal;
      if (gain) {
        synth = el.mul(
          synth,
          el.sm(el.const({ key: `main-amp`, value: mainVolume }))
        ) as NodeRepr_t;
      }
      if (oscilloscope) {
        synth = el.scope({ name: "scope" }, synth);
      }
      if (spectrogram) {
        synth = el.fft({ name: "fft" }, synth);
      }
      return synth as NodeRepr_t;
    }
  }, [core, mainVolume, playing, signal]);

  if (oscilloscope) {
    core.on("scope", function (e) {
      if (e.source === "scope") {
        e.data.length && setAudioVizData(e.data[0]);
      }
    });
  }
  if (spectrogram) {
    core.on("fft", function (e) {
      if (e.source === "fft") {
        setFftVizData(e.data.real);
      }
    });
  }

  return (
    <PlayMonoScopeAndGainFlexBox>
      <PlayPauseCoreAudio
        onPlay={updatePlaying}
        signalLeft={signalSynth() as NodeRepr_t}
        signalRight={signalSynth() as NodeRepr_t}
      />
      {playing && gain && (
        <KnobParamLabel
          id={"gain"}
          label={"GAIN"}
          knobValue={mainVolume}
          onKnobInput={setMainVolume}
        />
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
  border: 2px solid #ff0000;
`;
