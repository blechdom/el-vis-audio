import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Delay } from "../";

export default {
  title: "Elementary/Delay",
  component: Delay,
} as ComponentMeta<typeof Delay>;

const Template: ComponentStory<typeof Delay> = () => <Delay />;

export const Default = Template.bind({});
