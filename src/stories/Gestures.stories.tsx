import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Gestures } from "../";
import { GesturesProps } from "../Gestures.types";

export default {
  title: "UI/Gestures",
  component: Gestures,
} as ComponentMeta<typeof Gestures>;

const Template: ComponentStory<typeof Gestures> = (args: GesturesProps) => (
  <Gestures {...args} />
);

export const Default = Template.bind({});

Default.args = {};
