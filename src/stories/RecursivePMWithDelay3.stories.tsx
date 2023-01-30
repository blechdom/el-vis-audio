import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { RecursivePMWithDelay3 } from "../";

export default {
  title: "Experiments/Recursive PM With Delay 3",
  component: RecursivePMWithDelay3,
} as ComponentMeta<typeof RecursivePMWithDelay3>;

const Template: ComponentStory<typeof RecursivePMWithDelay3> = () => (
  <RecursivePMWithDelay3 />
);

export const Default = Template.bind({});
