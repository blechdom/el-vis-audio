import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { WACSlider } from "../WACSlider";

export default {
  title: "WebAudio-Controls/WACSlider",
  component: WACSlider,
} as ComponentMeta<typeof WACSlider>;

export const Gallery = () => {
  return (
    <>
      <WACSlider />
      <WACSlider
        src={"./images/hsliderbody.png"}
        knobsrc={"./images/hsliderknob.png"}
        tracking={"rel"}
      />
      <br />
      <WACSlider
        src={"./images/vsliderbody.png"}
        knobsrc={"./images/vsliderknob.png"}
        tracking={"rel"}
      />
    </>
  );
};

const Template: ComponentStory<typeof WACSlider> = (args) => (
  <WACSlider {...args} />
);

export const Default = Template.bind({});

Default.args = {};
