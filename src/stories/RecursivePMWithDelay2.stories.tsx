import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { RecursivePMWithDelay2 } from "../";

export default {
  title: "Experiments/Recursive PM With Delay 2",
  component: RecursivePMWithDelay2,
} as ComponentMeta<typeof RecursivePMWithDelay2>;

const Template: ComponentStory<typeof RecursivePMWithDelay2> = () => (
  <RecursivePMWithDelay2 />
);

export const Default = Template.bind({});
