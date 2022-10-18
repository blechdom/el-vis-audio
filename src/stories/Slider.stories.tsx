import React, { useState } from "react";
import { Story, Meta } from "@storybook/react";
import { Slider } from "../Slider";

type DemoProps = {
  color: string;
  height: number;
  width: number;
};

const Demo = (args: DemoProps) => {
  const [sliderValue, setSliderValue] = useState<number>(100);

  return (
    <>
      <h2>value = {sliderValue}</h2>
      <Slider
        value={sliderValue}
        onChange={(event) => setSliderValue(parseFloat(event.target.value))}
        {...args}
      />
    </>
  );
};

const meta: Meta = {
  title: "ui/Slider",
  component: Demo,
};

export default meta;

const Template: Story<DemoProps> = (args) => <Demo {...args} />;

export const Default = Template.bind({});

Default.args = {
  diameter: "1.5em",
  fillColor: "#FF0000",
  trackHeight: "0.4em",
  trackColor: "#FF7000",
  min: 0,
  max: 100,
  step: 0.1,
};
