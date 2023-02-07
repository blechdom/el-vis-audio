import React, { FC, useCallback, useState } from "react";
import { el, NodeRepr_t } from "@elemaudio/core";
import styled from "styled-components";
import useMemoizedState from "./hooks/useMemoizedState";
import { AudioIn, KnobParamLabel, PlayMonoScopeAndGain } from "./.";
require("events").EventEmitter.defaultMaxListeners = 0;

export const HilbertTransform: FC = () => {
  const [playing, setPlaying] = useMemoizedState<boolean>(false);
  const [audioInSignal, setAudioInSignal] = useState<NodeRepr_t | null>(null);
  const [freqShift, setFreqShift] = useMemoizedState<number>(0.01);

  function hilbert(part: "real" | "imaginary", input: NodeRepr_t) {
    function allpassIIR(coefficient: number, input: NodeRepr_t) {
      return el.biquad(
        coefficient ** 2,
        0,
        -1,
        0,
        -1 * coefficient ** 2,
        input
      );
    }

    switch (part) {
      case "real":
        return el.z(
          allpassIIR(
            0.9987488452737,
            allpassIIR(
              0.988229522686,
              allpassIIR(0.9360654322959, allpassIIR(0.6923878, input))
            )
          )
        );
      case "imaginary":
        return allpassIIR(
          0.9952884791278,
          allpassIIR(
            0.9722909545651,
            allpassIIR(0.856171088242, allpassIIR(0.4021921162426, input))
          )
        );
    }
  }

  const FrequencyShift = useCallback(
    (input: NodeRepr_t | null) => {
      if (input) {
        let phasor = el.phasor(
          el.sm(
            el.const({
              key: "freqshift-const",
              value: freqShift === 0 ? 0.0001 : freqShift,
            })
          ),
          0
        );
        let sine = el.sin(el.mul(2.0 * Math.PI, phasor));
        let cosine = el.cos(el.mul(2.0 * Math.PI, phasor));

        return el.sub(
          el.mul(hilbert("real", input), sine),
          el.mul(hilbert("imaginary", input), cosine)
        );
      }
    },
    [freqShift]
  );

  return (
    <>
      <h1>Hilbert Transform</h1>
      <PlayMonoScopeAndGain
        signal={playing ? (FrequencyShift(audioInSignal) as NodeRepr_t) : null}
        isPlaying={setPlaying}
      />
      <br />
      <AudioIn playing={playing} onSignal={setAudioInSignal} />
      <br />
      <KnobsFlexBox>
        <KnobParamLabel
          id={"freqShift"}
          label={"freqShift"}
          knobValue={freqShift}
          step={0.001}
          min={-100}
          max={100}
          onKnobInput={setFreqShift}
        />
      </KnobsFlexBox>
    </>
  );
};

const KnobsFlexBox = styled.div`
  justify-content: space-evenly;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  padding: 10px;
  border: 2px solid #ff0000;
`;
