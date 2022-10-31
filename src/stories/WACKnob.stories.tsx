import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { WACKnob } from "../WACKnob";

export default {
  title: "WebAudio-Controls/WACKnob",
  component: WACKnob,
  control: true,
} as ComponentMeta<typeof WACKnob>;

const Template: ComponentStory<typeof WACKnob> = (args) => (
  <>
    <br />
    <br />
    <WACKnob {...args} key={JSON.stringify(args)} />
  </>
);

export const Default = Template.bind({});

Default.args = {
  src: "",
  value: 0,
  defValue: 0,
  min: 0,
  max: 100,
  step: 1,
  width: null,
  height: null,
  diameter: 200,
  sprites: null,
  sensitivity: 1,
  log: 0,
  valueTip: 1,
  toolTip: "tooltip text",
  conv: null,
  enable: 1,
  bodyColor: "#000",
  highlightColor: "#fff",
  indicatorColor: "#e00",
  outline: 0,
  midilearn: 0,
  midicc: null,
};

export const Gallery = () => {
  return (
    <>
      <WACKnob src={"./images/Aqua.png"} />
      <WACKnob src={"./images/Carbon.png"} />
      <WACKnob src={"./images/Chromed.png"} />
      <WACKnob src={"./images/Jambalaya.png"} />
      <WACKnob src={"./images/JP8000.png"} />
      <WACKnob src={"./images/lineshadow2.png"} />
      <WACKnob src={"./images/LittlePhatty.png"} />
      <WACKnob src={"./images/m400.png"} />
      <WACKnob src={"./images/MiniMoog_Main.png"} />
      <WACKnob src={"./images/nice_lamp_knob.png"} />
      <WACKnob src={"./images/plastic_knob.png"} />
      <WACKnob src={"./images/simpleBlue.png"} />
      <WACKnob src={"./images/SimpleFlat3.png"} />
      <WACKnob src={"./images/simplegray.png"} />
      <WACKnob src={"./images/vernier.png"} />
      <WACKnob src={"./images/Vintage_Knob.png"} />
      <WACKnob src={"./images/yellow.png"} sprites={127} />
      <WACKnob src={"./images/lineshadow.png"} />
      <WACKnob
        src={"./images/WOK_vintage_AbbeyRoad_PAN_Knob.png"}
        sprites={127}
        value={50}
      />
    </>
  );
};

export const ImageSliders = () => {
  return <WACKnob src={"./images/slider.png"} sprites={60} />;
};
