import React, { useState } from "react";
import { Meta, Story } from "@storybook/react";
import { Presets } from "../";
import { PresetsProps } from "../Presets.types";

const Demo = (args: Partial<PresetsProps>) => {
  const [presetList, setPresetList] = useState<unknown[][]>([
    [3, "dog", true, 7.7],
    [14, "cat", false, 5.56],
    [2, "bird", false, -3.14],
  ]);
  const [currentSetting, setCurrentSetting] = useState<unknown[]>(
    presetList[0]
  );

  function updatePresetList(presetList: unknown[][]) {
    setPresetList(presetList);
  }

  return (
    <>
      <Presets
        {...args}
        currentSetting={currentSetting}
        presetList={presetList}
        onUpdateCurrentPreset={(i) => setCurrentSetting(presetList[i])}
        onUpdatePresetList={updatePresetList}
      />
      <br />
      <br />
      <h3>Test Inputs</h3>
      <br />
      Integer:{" "}
      <input
        type="number"
        value={currentSetting[0] as number}
        onChange={(val) =>
          setCurrentSetting([
            parseInt(val.target.value),
            ...currentSetting.slice(1),
          ])
        }
      />{" "}
      <br />
      <br />
      String:{" "}
      <input
        type="text"
        value={currentSetting[1] as string}
        onChange={(val) =>
          setCurrentSetting([
            currentSetting[0],
            val.target.value,
            ...currentSetting.slice(2),
          ])
        }
      />{" "}
      <br />
      <br />
      Boolean:{" "}
      <input
        type="checkbox"
        checked={currentSetting[2] as boolean}
        onChange={(val) =>
          setCurrentSetting([
            ...currentSetting.slice(0, 2),
            val.target.checked,
            currentSetting[3],
          ])
        }
      />{" "}
      <br />
      <br />
      Float:{" "}
      <input
        type="number"
        value={currentSetting[3] as number}
        onChange={(val) =>
          setCurrentSetting([
            ...currentSetting.slice(0, 3),
            parseFloat(val.target.value),
          ])
        }
      />{" "}
      <br />
      <br />
      <h3>Current State:</h3>
      <br />
      CurrentSetting: {JSON.stringify(currentSetting)}
      <br />
      <br />
      PresetList: <br />
      <br />
      {presetList?.map((preset) => (
        <div>{JSON.stringify(preset)}</div>
      ))}
      <br />
      <br />
      TODO: Add Delete, Download JSON, Upload JSON functionality
      <br />
    </>
  );
};

const meta: Meta = {
  title: "UI/Presets",
  component: Demo,
};
export default meta;

const Template: Story = () => <Demo />;

export const Default = Template.bind({});

Default.args = {
  allowAdd: true,
};

export const WithDelete = Template.bind({});

WithDelete.args = {
  ...Default.args,
  allowDelete: true,
};

export const WithJSON = Template.bind({});

WithJSON.args = {
  ...WithDelete.args,
  allowAdd: true,
  allowDelete: true,
};
