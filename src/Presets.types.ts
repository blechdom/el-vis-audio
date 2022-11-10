export interface PresetsProps {
  currentSetting?: unknown[];
  presetList: unknown[][];
  allowAdd?: boolean;
  allowDelete?: boolean;
  allowDownload?: boolean;
  allowUpload?: boolean;
  onUpdateCurrentPreset: (i: number) => void;
  onUpdatePresetList?: (presetList: unknown[][]) => void;
}
