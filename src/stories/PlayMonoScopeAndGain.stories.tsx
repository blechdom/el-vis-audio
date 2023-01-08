import React, { useState } from "react";
import { el, NodeRepr_t } from "@elemaudio/core";
import { Meta, Story } from "@storybook/react";
import { WebAudioKnob } from "webaudio-controls-react-typescript";
import { core, KnobParamLabel, PlayMonoScopeAndGain } from "../";
import styled from "styled-components";
// @ts-ignore
import SimpleFlat3 from "../../node_modules/webaudio-controls-react-typescript/dist/images/images/SimpleFlat3.png";
require("events").EventEmitter.defaultMaxListeners = 0;

type DemoProps = {
  color: string;
  height: number;
  width: number;
};

const Demo = (args: DemoProps) => {
  const [frequency, setFrequency] = useState(200);
  const smoothFreq = el.sm(el.const({ key: `frequency`, value: frequency }));
  const sineSynth = () => el.cycle(smoothFreq);

  return (
    <>
      <PlayMonoScopeAndGain signal={sineSynth() as NodeRepr_t} />
      <br />
      <KnobParamLabel
        id={"freq"}
        label={"FREQ"}
        knobValue={frequency}
        log={1}
        min={200}
        max={2000}
        onKnobInput={setFrequency}
      />
    </>
  );
};

const meta: Meta = {
  title: "elementary/PlayMonoScopeAndGain",
  component: Demo,
};

export default meta;

const Template: Story<DemoProps> = (args) => <Demo {...args} />;

export const Default = Template.bind({});

Default.args = {
  color: "#FF0000",
  width: 500,
  height: 250,
};

const SliderLabel = styled.span`
  display: inline-block;
  width: 150px;
  text-align: left;
`;
