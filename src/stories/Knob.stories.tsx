import React from "react";
import { ComponentMeta } from "@storybook/react";
import Knob from "../Knob";

export default {
  title: "ui/Knob",
  component: Knob,
} as ComponentMeta<typeof Knob>;

export const Default = () => {
  return (
    <>
      <Knob></Knob>
      <Knob src={"./images/knobs/lineshadow.png"}></Knob>
      <Knob src={"./images/knobs/Aqua.png"}></Knob>
      <Knob src={"./images/knobs/Carbon.png"}></Knob>
      <Knob src={"./images/knobs/Chromed.png"}></Knob>
      <Knob src={"./images/knobs/Jambalaya.png"}></Knob>
      <Knob src={"./images/knobs/JP8000.png"}></Knob>
      <Knob src={"./images/knobs/lineshadow2.png"}></Knob>
      <Knob src={"./images/knobs/LittlePhatty.png"}></Knob>
      <Knob src={"./images/knobs/m400.png"}></Knob>
      <Knob src={"./images/knobs/MiniMoog_Main.png"}></Knob>
      <Knob src={"./images/knobs/nice_lamp_knob.png"}></Knob>
      <Knob src={"./images/knobs/plastic_knob.png"}></Knob>
      <Knob src={"./images/knobs/SimpleFlat3.png"}></Knob>
      <Knob src={"./images/knobs/simplegray.png"}></Knob>
      <Knob src={"./images/knobs/vernier.png"}></Knob>
      <Knob src={"./images/knobs/Vintage_Knob.png"}></Knob>
      <Knob
        src={"./images/knobs/WOK_vintage_AbbeyRoad_PAN_Knob.png"}
        sprites={127}
        value={50}
      ></Knob>
      <Knob src={"./images/knobs/yellow.png"} sprites={127}></Knob>
    </>
  );
};
