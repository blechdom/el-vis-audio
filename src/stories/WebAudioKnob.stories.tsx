import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { WebAudioKnob } from "../WebAudioKnob";

export default {
  title: "WebAudio-Controls/WebAudioKnob",
  component: WebAudioKnob,
} as ComponentMeta<typeof WebAudioKnob>;

export const Gallery = () => {
  return (
    <>
      <WebAudioKnob />
      <WebAudioKnob src={"./knobs/lineshadow.png"} />
      <WebAudioKnob src={"./knobs/Aqua.png"} />
      <WebAudioKnob src={"./knobs/Carbon.png"} />
      <WebAudioKnob src={"./knobs/Chromed.png"} />
      <WebAudioKnob src={"./knobs/Jambalaya.png"} />
      <WebAudioKnob src={"./knobs/JP8000.png"} />
      <WebAudioKnob src={"./knobs/lineshadow2.png"} />
      <WebAudioKnob src={"./knobs/LittlePhatty.png"} />
      <WebAudioKnob src={"./knobs/m400.png"} />
      <WebAudioKnob src={"./knobs/MiniMoog_Main.png"} />
      <WebAudioKnob src={"./knobs/nice_lamp_knob.png"} />
      <WebAudioKnob src={"./knobs/plastic_knob.png"} />
      <WebAudioKnob src={"./knobs/simpleBlue.png"} />
      <WebAudioKnob src={"./knobs/SimpleFlat3.png"} />
      <WebAudioKnob src={"./knobs/simplegray.png"} />
      <WebAudioKnob src={"./knobs/vernier.png"} />
      <WebAudioKnob src={"./knobs/Vintage_Knob.png"} />
      <WebAudioKnob
        src={"./knobs/WOK_vintage_AbbeyRoad_PAN_Knob.png"}
        sprites={127}
        value={50}
      />
      <WebAudioKnob src={"./knobs/yellow.png"} sprites={127} />
    </>
  );
};

const Template: ComponentStory<typeof WebAudioKnob> = (args) => (
  <WebAudioKnob {...args} />
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
