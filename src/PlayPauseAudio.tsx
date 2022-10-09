import { useState } from "react";
import { audioContext } from "./utils/audioContext";
import { PlayPauseButton } from "./PlayPauseButton";

interface PlayPauseAudioProps {
  backgroundColor?: string;
  hoverColor?: string;
  playing?: boolean;
  onPlay?: (playing: boolean) => void;
}

export const PlayPauseAudio = ({
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
