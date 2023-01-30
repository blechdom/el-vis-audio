import React, { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Modal } from "./";
import { PresetsProps } from "./Presets.types";

export const Presets: FC<PresetsProps> = ({
  allowAdd = true,
  allowEdit = false,
  allowDownload = false,
  allowUpload = false,
  allowLocalStorage = false,
  currentSetting = [],
  presetList = [],
  presetsName = "defaultPresets",
  onUpdateCurrentPreset,
  onUpdatePresetList,
}: PresetsProps) => {
  const [showEditPresets, setShowEditPresets] = useState<boolean>(false);

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

  function saveToLocalStorage(presetData: string) {
    allowLocalStorage && localStorage.setItem(presetsName, presetData);
  }

  function editPresets() {
    setShowEditPresets(true);
  }

  function deletePreset(index: number): void {
    const updatedPresetList = presetList.filter(
      (preset: [], i: number) => i !== index
    );
    allowLocalStorage && saveToLocalStorage(JSON.stringify(updatedPresetList));
    onUpdatePresetList && onUpdatePresetList(updatedPresetList);
    setShowEditPresets(false);
  }
  return (
    <>
      <PresetsContainer>
        {presetList?.map((preset: [], i: number) => (
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
          {allowEdit && (
            <>
              <StyledButton
                key={`edit`}
                onClick={editPresets}
                label={`Edit Presets`}
              />
              <Modal
                active={showEditPresets}
                hideModal={() => setShowEditPresets(false)}
                title="Edit Presets"
                footer={
                  <StyledButton
                    onClick={() => setShowEditPresets(false)}
                    label="Cancel"
                  />
                }
              >
                <PresetsContainer>
                  {presetList.map((preset: [], i: number) => (
                    <StyledButton
                      key={`preset-${i}`}
                      onClick={() => deletePreset(i)}
                      label={`Delete Preset ${i + 1}`}
                    />
                  ))}
                </PresetsContainer>
              </Modal>
            </>
          )}
        </div>
      )}
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
