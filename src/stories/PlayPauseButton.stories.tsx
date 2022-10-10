import React from "react";
import { ComponentMeta } from "@storybook/react";
import { useArgs } from "@storybook/client-api";
import { PlayPauseButton } from "../PlayPauseButton";

export default {
  title: "UI/Play-Pause Button",
  component: PlayPauseButton,
  args: {
    backgroundColor: "#FF0000",
    hoverColor: "#FF7000",
    playing: false,
  },
} as ComponentMeta<typeof PlayPauseButton>;

export const Default = ({ ...args }) => {
  const [{ playing }, updateArgs] = useArgs();

  return (
    <PlayPauseButton
      {...args}
      playing={playing}
      onClick={() => updateArgs({ playing: !playing })}
    />
  );
};
