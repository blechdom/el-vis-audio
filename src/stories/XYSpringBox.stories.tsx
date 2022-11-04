import React, { useState } from "react";
import { Story, Meta } from "@storybook/react";
import { XYSpringBox } from "../XYSpringBox";
import { XYSpringProps } from "../XYSpringBox.types";
import { Sphere } from "../Sphere";

const Demo = () => {
  return (
    <XYSpringBox
      width={500}
      height={300}
      offset={100} // size of sphere in pixels
      children={<Sphere diameter={"100px"} perspective={"25px"} />}
    />
  );
};

const meta: Meta = {
  title: "gesture/XY Spring",
  component: Demo,
};

export default meta;

const Template: Story = (args) => <Demo />;

export const Default = Template.bind({});

Default.args = {};
