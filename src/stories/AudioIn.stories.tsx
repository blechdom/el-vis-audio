import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { AudioIn } from "../";

export default {
  title: "Elementary/AudioIn",
  component: AudioIn,
} as ComponentMeta<typeof AudioIn>;

const Template: ComponentStory<typeof AudioIn> = () => <AudioIn />;

export const Default = Template.bind({});
