export interface PresetsProps {
  currentSetting?: any;
  presetList: any;
  allowAdd?: boolean;
  allowEdit?: boolean;
  allowLocalStorage?: boolean;
  allowDownload?: boolean;
  allowUpload?: boolean;
  presetsName?: string;
  onUpdateCurrentPreset: (i: number) => void;
  onUpdatePresetList?: (presetList: any) => void;
}
