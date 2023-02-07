import React, { useState } from "react";
import { NodeRepr_t } from "@elemaudio/core";
import { Meta, Story } from "@storybook/react";
import { AudioIn, PlayMonoScopeAndGain } from "../";
require("events").EventEmitter.defaultMaxListeners = 0;

const Demo = () => {
  const [playing, setPlaying] = useState<boolean>(false);
  const [audioInSignal, setAudioInSignal] = useState<NodeRepr_t | null>(null);

  return (
    <>
      <PlayMonoScopeAndGain
        signal={playing ? audioInSignal : null}
        isPlaying={setPlaying}
      />
      <br />
      <AudioIn playing={playing} onSignal={setAudioInSignal} />
    </>
  );
};

const meta: Meta = {
  title: "elementary/AudioInAndOut",
  component: Demo,
};

export default meta;

const Template: Story = () => <Demo />;

export const Default = Template.bind({});
