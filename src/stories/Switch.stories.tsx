import { ComponentStory, ComponentMeta } from "@storybook/react";
import React from "react";

import Switch from "../Switch";

export default {
  title: "UI/Switch",
  component: Switch,
} as ComponentMeta<typeof Switch>;

const Template: ComponentStory<typeof Switch> = (args) => <Switch {...args} />;

export const Default = Template.bind({});

Default.args = {
  backgroundColor: "#FF0000",
};
