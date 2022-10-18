import React, { useState } from "react";
import { ComponentMeta } from "@storybook/react";
import { audioContext, PlayPauseAudio } from "../";

export default {
  title: "webaudio/Play-Pause Audio",
  component: PlayPauseAudio,
  args: {
    backgroundColor: "#FF0000",
    hoverColor: "#FF7000",
  },
  argTypes: {
    playing: {
      control: false,
    },
  },
} as ComponentMeta<typeof PlayPauseAudio>;

export const Default = ({ ...args }) => {
  const [playing, setPlaying] = useState<boolean>(false);
  const [audioContextState, setAudioContextState] = useState<string>(
    audioContext.state
  );

  audioContext.onstatechange = () => {
    setAudioContextState(audioContext.state);
  };

  return (
    <>
      <PlayPauseAudio {...args} onPlay={setPlaying} />
      <br />
      <p>Playing: {playing ? "true" : "false"}</p>
      <p>Audio Context State: {audioContextState}</p>
    </>
  );
};
