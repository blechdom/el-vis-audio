import React, { FC, useState } from "react";
import styled from "styled-components";
import { Button } from "./";
import { PresetsProps } from "./Presets.types";

export const Presets: FC<PresetsProps> = ({
  allowAdd = true,
  allowDelete = false,
  allowDownload = false,
  allowUpload = false,
  currentSetting = [],
  presetList = [],
  onUpdateCurrentPreset,
  onUpdatePresetList,
}: PresetsProps) => {
  function addNewPreset() {
    const newPresetList: unknown[][] = presetList.concat([currentSetting]);
    onUpdatePresetList && onUpdatePresetList(newPresetList);
  }

  function deletePreset() {
    const newPresetList: unknown[][] = presetList.concat([currentSetting]);
    onUpdatePresetList && onUpdatePresetList(newPresetList);
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
