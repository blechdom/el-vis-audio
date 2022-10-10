export interface PlayPauseAudioProps {
  backgroundColor?: string;
  hoverColor?: string;
  playing?: boolean;
  onPlay?: (playing: boolean) => void;
}
