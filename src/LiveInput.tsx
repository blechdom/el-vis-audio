import React, { FC, useEffect, useState } from "react";
import { el } from "@elemaudio/core";
import Select from "react-select";
import { audioContext, core, Button, KnobParamLabel } from "./";
import { LiveInputProps } from "./LiveInput.types";
require("events").EventEmitter.defaultMaxListeners = 0;

type OptionType = {
  value: string;
  label: string;
};

export const LiveInput: FC<LiveInputProps> = ({ playing, onSignal }) => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  console.log("live audio loaded");
  useEffect(() => {
    if (!navigator.mediaDevices?.enumerateDevices) {
      console.log("enumerateDevices() not supported.");
    } else {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          devices.forEach((device) => {
            console.log(
              `${device.kind}: ${device.label} id = ${device.deviceId}`
            );
          });
        })
        .catch((err) => {
          console.error(`${err.name}: ${err.message}`);
        });
    }
  }, []);

  return <></>;
};
