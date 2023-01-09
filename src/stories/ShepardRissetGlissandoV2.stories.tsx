import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { ShepardRissetGlissando } from "../";

export default {
  title: "Experiments/ShepardRissetGlissando2",
  component: ShepardRissetGlissando,
} as ComponentMeta<typeof ShepardRissetGlissando>;

const Template: ComponentStory<typeof ShepardRissetGlissando> = () => (
  <ShepardRissetGlissando />
);

export const Default = Template.bind({});
