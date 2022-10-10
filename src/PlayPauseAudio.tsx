import React, { FC, useState } from "react";
import { audioContext } from "./utils/audioContext";
import PlayPauseButton from "./PlayPauseButton";
import { PlayPauseAudioProps } from "./PlayPauseAudio.types";

const PlayPauseAudio: FC<PlayPauseAudioProps> = ({
  playing = false,
  onPlay,
  ...props
}: PlayPauseAudioProps) => {
  const [contextPlaying, setContextPlaying] = useState<boolean>(false);

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

export default PlayPauseAudio;
