import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Sphere } from "../";
import { SphereProps } from "../Sphere.types";

export default {
  title: "UI/Sphere",
  component: Sphere,
} as ComponentMeta<typeof Sphere>;

const Template: ComponentStory<typeof Sphere> = (args: SphereProps) => (
  <Sphere {...args} />
);

export const Default = Template.bind({});

Default.args = {
  diameter: "300px",
  perspective: "100px",
  backgroundColor: "#000",
  fillColor: "#FF0000",
};
