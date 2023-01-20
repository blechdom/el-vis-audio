import React, { FC, useCallback, useState } from "react";
import styled from "styled-components";
import { el, NodeRepr_t } from "@elemaudio/core";
import { PlayMonoScopeAndGainProps } from "./PlayMonoScopeAndGain.types";
import {
  core,
  PlayPauseCoreAudio,
  KnobParamLabel,
  OscilloscopeSpectrogram,
} from "./";

export const PlayMonoGainScopeOverlay: FC<PlayMonoScopeAndGainProps> = ({
  signal,
  backgroundColor = "#FF0000",
  width = 200,
  height = 80,
  gain = true,
}) => {
  const [playing, setPlaying] = useState(false);
  const [audioVizData, setAudioVizData] = useState<Array<number>>([]);
  const [fftVizData, setFftVizData] = useState<Array<number>>([]);
  const [mainVolume, setMainVolume] = useState<number>(0);

  const signalSynth = useCallback(() => {
    if (playing && signal) {
      let synth = signal;
      if (gain) {
        synth = el.mul(
          synth,
          el.sm(el.const({ key: `main-amp`, value: mainVolume }))
        ) as NodeRepr_t;
      }
      return el.scope({ name: "scope" }, el.fft({ name: "fft" }, synth));
    }
  }, [core, mainVolume, playing, signal]);
  core.on("scope", function (e) {
    if (e.source === "scope") {
      e.data.length && setAudioVizData(e.data[0]);
    }
  });
  core.on("fft", function (e) {
    if (e.source === "fft") {
      setFftVizData(e.data.real);
    }
  });
  return (
    <PlayMonoScopeAndGainFlexBox>
      <PlayPauseCoreAudio
        onPlay={setPlaying}
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
      {playing && (
        <OscilloscopeSpectrogram
          audioVizData={audioVizData}
          fftVizData={fftVizData}
          oscilloscopeColor={backgroundColor}
          spectrogramColor={"#444444"}
          width={width}
          height={height}
        />
      )}
    </PlayMonoScopeAndGainFlexBox>
  );
};

const PlayMonoScopeAndGainFlexBox = styled.div`
  justify-content: space-between;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  padding: 20px;
  border: 2px solid #ff0000;
`;
