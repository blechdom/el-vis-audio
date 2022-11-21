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
      <br />
      <br />
      <div>
        <WACSlider
          width={500}
          height={50}
          knobsrc={"./images/golfball-75.png"}
        />
      </div>
      <br />
      <br />
      <div>
        <WACSlider
          width={500}
          height={56}
          knobsrc={"./images/golfball-50.png"}
        />
      </div>
      <br />
      <br />
      <div>
        <WACSlider
          width={24}
          height={300}
          knobsrc={"./images/golfball-50.png"}
          colors={"#000000;#00ff00;#00ffff"}
        />
      </div>
    </>
  );
};

const Template: ComponentStory<typeof WACSlider> = (args) => (
  <WACSlider {...args} />
);

export const Default = Template.bind({});

Default.args = {};
