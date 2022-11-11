import React, { FC, useEffect } from "react";
import styled from "styled-components";
import { Button } from "./";
import { PresetsProps } from "./Presets.types";

export const Presets: FC<PresetsProps> = ({
  allowAdd = true,
  allowDelete = false,
  allowDownload = false,
  allowUpload = false,
  allowLocalStorage = false,
  currentSetting = [],
  presetList = [],
  presetsName = "defaultPresets",
  onUpdateCurrentPreset,
  onUpdatePresetList,
}: PresetsProps) => {
  useEffect(() => {
    if (allowLocalStorage) {
      const storedPresets = localStorage.getItem(presetsName);
      if (storedPresets && onUpdatePresetList) {
        onUpdatePresetList(JSON.parse(storedPresets));
      }
    }
  }, []);

  function addNewPreset() {
    const newPresetList: unknown[][] = presetList.concat([currentSetting]);
    allowLocalStorage && saveToLocalStorage(JSON.stringify(newPresetList));
    onUpdatePresetList && onUpdatePresetList(newPresetList);
  }

  function deletePreset() {
    const newPresetList: unknown[][] = presetList.concat([currentSetting]);
    allowLocalStorage && saveToLocalStorage(JSON.stringify(newPresetList));
    onUpdatePresetList && onUpdatePresetList(newPresetList);
  }

  function saveToLocalStorage(presetData: string) {
    allowLocalStorage && localStorage.setItem(presetsName, presetData);
  }

  return (
    <>
      <PresetsContainer>
        {presetList?.map((preset, i) => (
          <StyledButton
            key={`preset-${i}`}
            onClick={() => onUpdateCurrentPreset && onUpdateCurrentPreset(i)}
            label={`Preset ${i + 1}`}
          />
        ))}
      </PresetsContainer>
      {allowAdd && (
        <div>
          <StyledButton
            key={`plus`}
            onClick={addNewPreset}
            label={`+ Add Preset`}
          />
        </div>
      )}
      {allowDelete && (
        <div>
          <StyledButton
            key={`delete`}
            onClick={deletePreset}
            label={`- Delete Preset`}
          />
        </div>
      )}{" "}
    </>
  );
};

const StyledButton = styled(Button)`
  background-color: #0f9ff5;
  color: #ffffff;
  border: none;
  margin: 0.5em 0.5em 0.5em 0;
  padding: 0.5em;
  :hover {
    background-color: #ffab00;
    color: #000000;
  }
`;

const PresetsContainer = styled.div`
  margin-right: 25px;
`;
