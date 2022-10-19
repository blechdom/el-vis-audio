let styles = document.createElement("style");
styles.innerHTML = `#webaudioctrl-context-menu {
  display: none;
  position: absolute;
  z-index: 10;
  padding: 0;
  width: 100px;
  color:#eee;
  background-color: #268;
  border: solid 1px #888;
  box-shadow: 1px 1px 2px #888;
  font-family: sans-serif;
  font-size: 11px;
  line-height:1.7em;
  text-align:center;
  cursor:pointer;
  color:#fff;
  list-style: none;
}
#webaudioctrl-context-menu.active {
  display: block;
}
.webaudioctrl-context-menu__item {
  display: block;
  margin: 0;
  padding: 0;
  color: #000;
  background-color:#eee;
  text-decoration: none;
}
.webaudioctrl-context-menu__title{
  font-weight:bold;
}
.webaudioctrl-context-menu__item:last-child {
  margin-bottom: 0;
}
.webaudioctrl-context-menu__item:hover {
  background-color: #b8b8b8;
}
`;
document.head.appendChild(styles);

export * from "./webaudio-knob";
export * from "./webaudio-widget";

export const opt = {
  useMidi: 0,
  preserveMidiLearn: 0,
  preserveValue: 0,
  midilearn: 0,
  mididump: 0,
  outline: null,
  knobSrc: null,
  knobSprites: null,
  knobWidth: null,
  knobHeight: null,
  knobDiameter: null,
  knobColors: "#e00;#000;#fff",
  sliderSrc: null,
  sliderWidth: null,
  sliderHeight: null,
  sliderKnobSrc: null,
  sliderKnobWidth: null,
  sliderKnobHeight: null,
  sliderDitchlength: null,
  sliderColors: "#e00;#333;#fcc",
  switchWidth: null,
  switchHeight: null,
  switchDiameter: null,
  switchColors: "#e00;#000;#fcc",
  paramWidth: null,
  paramHeight: null,
  paramFontSize: 9,
  paramColors: "#fff;#000",
  valuetip: 0,
  xypadColors: "#e00;#000;#fcc",
};
if (window.WebAudioControlsOptions)
  Object.assign(opt, window.WebAudioControlsOptions);
