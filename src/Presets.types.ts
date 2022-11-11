export interface PresetsProps {
  currentSetting?: unknown[];
  presetList: unknown[][];
  allowAdd?: boolean;
  allowEdit?: boolean;
  allowLocalStorage?: boolean;
  allowDownload?: boolean;
  allowUpload?: boolean;
  presetsName?: string;
  onUpdateCurrentPreset: (i: number) => void;
  onUpdatePresetList?: (presetList: unknown[][]) => void;
}
