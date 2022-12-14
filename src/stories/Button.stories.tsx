import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { Button } from "../";

export default {
  title: "UI/Button",
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Default = Template.bind({});

Default.args = {
  backgroundColor: "#FF0000",
  hoverColor: "#FF7000",
  label: "Button",
};
