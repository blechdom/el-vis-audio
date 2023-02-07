import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { HilbertTransform } from "../";

export default {
  title: "Experiments/HilbertTransform",
  component: HilbertTransform,
} as ComponentMeta<typeof HilbertTransform>;

const Template: ComponentStory<typeof HilbertTransform> = () => (
  <HilbertTransform />
);

export const Default = Template.bind({});
