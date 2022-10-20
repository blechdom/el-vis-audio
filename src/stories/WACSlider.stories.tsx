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
        src={"./img/hsliderbody.png"}
        knobsrc={"./img/hsliderknob.png"}
        tracking={"rel"}
      />
      <br />
      <WACSlider
        src={"./img/vsliderbody.png"}
        knobsrc={"./img/vsliderknob.png"}
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
