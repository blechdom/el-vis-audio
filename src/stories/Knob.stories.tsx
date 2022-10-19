import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Knob } from "../Knob";

export default {
  title: "UI/Knob",
  component: Knob,
} as ComponentMeta<typeof Knob>;

export const Gallery = () => {
  return (
    <>
      <Knob></Knob>
      <Knob src={"./knobs/lineshadow.png"}></Knob>
      <Knob src={"./knobs/Aqua.png"}></Knob>
      <Knob src={"./knobs/Carbon.png"}></Knob>
      <Knob src={"./knobs/Chromed.png"}></Knob>
      <Knob src={"./knobs/Jambalaya.png"}></Knob>
      <Knob src={"./knobs/JP8000.png"}></Knob>
      <Knob src={"./knobs/lineshadow2.png"}></Knob>
      <Knob src={"./knobs/LittlePhatty.png"}></Knob>
      <Knob src={"./knobs/m400.png"}></Knob>
      <Knob src={"./knobs/MiniMoog_Main.png"}></Knob>
      <Knob src={"./knobs/nice_lamp_knob.png"}></Knob>
      <Knob src={"./knobs/plastic_knob.png"}></Knob>
      <Knob src={"./knobs/SimpleFlat3.png"}></Knob>
      <Knob src={"./knobs/simplegray.png"}></Knob>
      <Knob src={"./knobs/vernier.png"}></Knob>
      <Knob src={"./knobs/Vintage_Knob.png"}></Knob>
      <Knob
        src={"./knobs/WOK_vintage_AbbeyRoad_PAN_Knob.png"}
        sprites={127}
        value={50}
      ></Knob>
      <Knob src={"./knobs/yellow.png"} sprites={127}></Knob>
    </>
  );
};

const Template: ComponentStory<typeof Knob> = (args) => <Knob {...args} />;

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
