import React, { useMemo, useState } from "react";
import { Meta, Story } from "@storybook/react";
import { Presets } from "../";
import { PresetsProps } from "../Presets.types";

type PresetType = [number, string, boolean, number];

const Demo = (args: Partial<PresetsProps>) => {
  const [intVal, setIntVal] = useState<number>(0);
  const [stringVal, setStringVal] = useState<string>("test");
  const [boolVal, setBoolVal] = useState<boolean>(true);
  const [floatVal, setFloatVal] = useState<number>(0.43);

  const [presetList, setPresetList] = useState<PresetType[]>(
    args.presetList ?? [[0, "test", true, 0.3]]
  );
  const [currentSetting, setCurrentSetting] = useState<PresetType>(
    presetList[0]
  );

  useMemo(() => {
    setCurrentSetting([intVal, stringVal, boolVal, floatVal]);
  }, [intVal, stringVal, boolVal, floatVal]);

  function updatePresetList(presetList: PresetType[]) {
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
        value={currentSetting[0]}
        onChange={(val) => setIntVal(parseInt(val.target.value))}
      />{" "}
      <br />
      <br />
      String:{" "}
      <input
        type="text"
        value={currentSetting[1]}
        onChange={(val) => setStringVal(val.target.value as string)}
      />{" "}
      <br />
      <br />
      Boolean:{" "}
      <input
        type="checkbox"
        checked={currentSetting[2]}
        onChange={(val) => setBoolVal(val.target.checked)}
      />{" "}
      <br />
      <br />
      Float:{" "}
      <input
        type="number"
        value={currentSetting[3]}
        onChange={(val) => setFloatVal(parseFloat(val.target.value))}
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

const Template: Story = (args) => <Demo {...args} />;

export const Default = Template.bind({});

Default.args = {
  presetList: [
    [3, "dog", true, 7.7],
    [14, "cat", false, 5.56],
    [2, "bird", false, -3.14],
  ],
  allowAdd: true,
};

export const WithLocalStorage = Template.bind({});

WithLocalStorage.args = {
  ...Default.args,
  allowLocalStorage: true,
  presetsName: "storybookPresets",
};

export const WithEdit = Template.bind({});

WithEdit.args = {
  ...Default.args,
  allowEdit: true,
};

export const EditAndLocalStorage = Template.bind({});

EditAndLocalStorage.args = {
  ...Default.args,
  allowEdit: true,
  allowLocalStorage: true,
};

export const WithJSON = Template.bind({});

WithJSON.args = {
  ...WithEdit.args,
};
