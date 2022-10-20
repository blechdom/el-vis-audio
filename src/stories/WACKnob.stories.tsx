import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { WACKnob } from "../WACKnob";

export default {
  title: "WebAudio-Controls/WACKnob",
  component: WACKnob,
} as ComponentMeta<typeof WACKnob>;

export const Gallery = () => {
  return (
    <>
      <WACKnob />
      <WACKnob src={"./knobs/lineshadow.png"} />
      <WACKnob src={"./knobs/Aqua.png"} />
      <WACKnob src={"./knobs/Carbon.png"} />
      <WACKnob src={"./knobs/Chromed.png"} />
      <WACKnob src={"./knobs/Jambalaya.png"} />
      <WACKnob src={"./knobs/JP8000.png"} />
      <WACKnob src={"./knobs/lineshadow2.png"} />
      <WACKnob src={"./knobs/LittlePhatty.png"} />
      <WACKnob src={"./knobs/m400.png"} />
      <WACKnob src={"./knobs/MiniMoog_Main.png"} />
      <WACKnob src={"./knobs/nice_lamp_knob.png"} />
      <WACKnob src={"./knobs/plastic_knob.png"} />
      <WACKnob src={"./knobs/simpleBlue.png"} />
      <WACKnob src={"./knobs/SimpleFlat3.png"} />
      <WACKnob src={"./knobs/simplegray.png"} />
      <WACKnob src={"./knobs/vernier.png"} />
      <WACKnob src={"./knobs/Vintage_Knob.png"} />
      <WACKnob
        src={"./knobs/WOK_vintage_AbbeyRoad_PAN_Knob.png"}
        sprites={127}
        value={50}
      />
      <WACKnob src={"./knobs/yellow.png"} sprites={127} />
    </>
  );
};

const Template: ComponentStory<typeof WACKnob> = (args) => (
  <WACKnob {...args} />
);

export const Default = Template.bind({});

Default.args = {
  src: "",
  sprites: 100,
  value: 0,
  /* knobColors: "#000;#fff;#e00;",
  knobWidth: 100,
  knobHeight: 100,
  knobDiameter: 100,
  outline: 0,
  valueTip: "info here",
  midilearn: false,*/
};
