import React, { FC, useEffect, useState } from "react";
import { audioContext, core } from "./";
import { PlayPauseButton } from "./PlayPauseButton";
import { PlayPauseCoreAudioProps } from "./PlayPauseCoreAudio.types";

export const PlayPauseCoreAudio: FC<PlayPauseCoreAudioProps> = ({
  playing = false,
  onPlay,
  signalLeft,
  signalRight,
  ...props
}: PlayPauseCoreAudioProps) => {
  const [contextPlaying, setContextPlaying] = useState<boolean>(false);

  useEffect(() => {
    if (audioContext.state !== "running") {
      audioContext.resume();
    }
    return () => {
      audioContext.suspend();
    };
  }, []);

  useEffect(() => {
    if (core && signalLeft && signalRight) {
      core.render(signalLeft, signalRight);
    }
  }, [core, signalLeft, signalRight]);

  const togglePlay = () => {
    if (contextPlaying) {
      audioContext.suspend();
    } else {
      audioContext.resume();
    }
    onPlay && onPlay(!contextPlaying);
    setContextPlaying((play) => !play);
  };

  return (
    <div>
      <PlayPauseButton
        {...props}
        playing={contextPlaying}
        onClick={togglePlay}
      />
    </div>
  );
};
