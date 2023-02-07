import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { JuliaSynth } from "../";

export default {
  title: "Experiments/JuliaSynth",
  component: JuliaSynth,
} as ComponentMeta<typeof JuliaSynth>;

const Template: ComponentStory<typeof JuliaSynth> = () => <JuliaSynth />;

export const Default = Template.bind({});
