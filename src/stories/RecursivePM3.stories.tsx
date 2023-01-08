import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { RecursivePM } from "../";

export default {
  title: "Experiments/RecursivePM3",
  component: RecursivePM,
} as ComponentMeta<typeof RecursivePM>;

const Template: ComponentStory<typeof RecursivePM> = () => <RecursivePM />;

export const Default = Template.bind({});
