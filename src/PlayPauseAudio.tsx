import React, { FC, useCallback, useEffect, useState } from "react";
import { PlayPauseButton } from "./PlayPauseButton";
import { PlayPauseAudioProps } from "./PlayPauseAudio.types";
import { audioContext, core } from "./";

export const PlayPauseAudio: FC<PlayPauseAudioProps> = ({
  playing = false,
  signal,
  onPlay,
  ...props
}: PlayPauseAudioProps) => {
  const [contextPlaying, setContextPlaying] = useState<boolean>(false);

  useEffect(async () => {
    console.log("contextPlaying", contextPlaying);
    onPlay && onPlay(contextPlaying);
    if (!contextPlaying) {
      await audioContext.suspend();
    } else {
      await audioContext.resume();
      signal && core && core.render(signal, signal);
    }
  }, [contextPlaying, signal, core]);

  const togglePlay = () => {
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
