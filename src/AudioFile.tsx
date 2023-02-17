import React, { FC, useCallback, useEffect, useState } from "react";
import { el } from "@elemaudio/core";
import { audioContext, core, Button, KnobParamLabel } from "./";
import { AudioFileProps } from "./AudioFile.types";
require("events").EventEmitter.defaultMaxListeners = 0;

export const AudioFile: FC<AudioFileProps> = ({ playing, onSignal }) => {
  const hiddenFileInput = React.useRef(null);
  const [url, setUrl] = useState<string>("");
  const [blob, setBlob] = useState<Blob | undefined>(undefined);
  const [sampleLength, setSampleLength] = useState<number>(0);
  const [sampleRate, setSampleRate] = useState<number>(audioContext.sampleRate);
  const [frequency, setFrequency] = useState<number>(1);
  const [playable, setPlayable] = useState<boolean>(false);

  const fileReader = new FileReader();

  fileReader.onloadend = async () => {
    const arrayBuffer = fileReader.result as ArrayBuffer;
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    console.log(audioBuffer);
    setSampleRate(audioBuffer.sampleRate);
    setSampleLength(audioBuffer.getChannelData(0).length);
    core.updateVirtualFileSystem({
      [url]: audioBuffer.getChannelData(0),
    });
    setPlayable(true);
  };

  useEffect(() => {
    console.log("url", url);
    if (url && url.length > 0) {
      console.log("url", url);
      async function fetchBlob(url: string) {
        const response = await fetch(url);
        const blob = await response.blob();
        setBlob(blob as Blob);
      }
      fetchBlob(url);
    }
  }, [url]);

  useEffect(() => {
    if (blob) {
      console.log("blob", blob);
      fileReader.readAsArrayBuffer(blob as Blob);
    }
  }, [blob]);

  useEffect(() => {
    if (playing && playable && onSignal) {
      const playbackRate = el.sm(
        el.const({
          key: "playbackrate",
          value: (sampleRate / sampleLength) * frequency,
        })
      );
      onSignal(el.table({ path: url }, el.phasor(playbackRate, 0)));
    }
  }, [playing, playable, url, frequency, sampleRate, sampleLength]);

  const handleClick = () => {
    //@ts-ignore
    hiddenFileInput?.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("event file", event?.target?.files?.[0]);
    const file = event?.target?.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUrl(url);
    }
  };

  return (
    <>
      <Button onClick={handleClick} label={`Load File`} />
      <input
        type="file"
        hidden
        ref={hiddenFileInput}
        onChange={handleFileSelect}
      />

      <KnobParamLabel
        id={"playbackRate"}
        label={"playbackRate"}
        knobValue={frequency}
        step={0.001}
        min={0.001}
        max={4}
        onKnobInput={setFrequency}
      />
    </>
  );
};
