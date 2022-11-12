import React, { useState } from "react";
import { Story, Meta } from "@storybook/react";
import { Slider } from "../Slider";
import { SliderProps } from "../Slider.types";

const Demo = (args: SliderProps) => {
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

const Template: Story<SliderProps> = (args) => <Demo {...args} />;

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

export const withTicks = Template.bind({});

withTicks.args = {
  ...Default.args,
  tickList: ["dog", "cat", "bird", "fish", "horse", "cow", "pig", "sheep"],
  tickColor: "#FF0000",
  tickPadding: "0.75em",
};
