import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { RecursivePMWithDelay } from "../";

export default {
  title: "Experiments/Recursive PM With Delay",
  component: RecursivePMWithDelay,
} as ComponentMeta<typeof RecursivePMWithDelay>;

const Template: ComponentStory<typeof RecursivePMWithDelay> = () => (
  <RecursivePMWithDelay />
);

export const Default = Template.bind({});
