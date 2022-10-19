/* *
 *
 *  WebAudio-Controls is based on
 *    webaudio-knob by Eiji Kitamura http://google.com/+agektmr
 *    webaudio-slider by RYoya Kawai https://plus.google.com/108242669191458983485/posts
 *    webaudio-switch by Keisuke Ai http://d.hatena.ne.jp/aike/
 *  Integrated and enhanced by g200kg http://www.g200kg.com/
 *
 *	Copyright 2013 Eiji Kitamura / Ryoya KAWAI / Keisuke Ai / g200kg(Tatsuya Shinyagaito)
 *
 *	 Licensed under the Apache License, Version 2.0 (the "License");
 *	 you may not use this file except in compliance with the License.
 *	 You may obtain a copy of the License at
 *
 *	 http://www.apache.org/licenses/LICENSE-2.0
 *
 *	 Unless required by applicable law or agreed to in writing, software
 *	 distributed under the License is distributed on an "AS IS" BASIS,
 *	 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *	 See the License for the specific language governing permissions and
 *	 limitations under the License.
 *
 * */
import { WebAudioControlsWidget } from "./webaudio-widget.js";

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
let midimenu = document.createElement("ul");
midimenu.id = "webaudioctrl-context-menu";
midimenu.innerHTML = `<li class="webaudioctrl-context-menu__title">MIDI Learn</li>
<li class="webaudioctrl-context-menu__item" id="webaudioctrl-context-menu-learn" onclick="webAudioControlsWidgetManager.contextMenuLearn()">Learn</li>
<li class="webaudioctrl-context-menu__item" onclick="webAudioControlsWidgetManager.contextMenuClear()">Clear</li>
<li class="webaudioctrl-context-menu__item" onclick="webAudioControlsWidgetManager.contextMenuClose()">Close</li>
`;
let opt = {
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

try {
  customElements.define("webaudio-knob", WebAudioKnob);
} catch (error) {
  console.log("webaudio-knob already defined");
}

export class WebAudioKnob extends WebAudioControlsWidget {
  constructor() {
    super();
  }
  connectedCallback() {
    let root;
    if (this.attachShadow) root = this.attachShadow({ mode: "open" });
    else root = this;
    root.innerHTML = `<style>
      ${this.basestyle}
      :host{
        display:inline-block;
        margin:0;
        padding:0;
        cursor:pointer;
        font-family: sans-serif;
        font-size: 11px;
      }
      .webaudio-knob-body{
        display:inline-block;
        position:relative;
        margin:0;
        padding:0;
        vertical-align:bottom;
        white-space:pre;
      }
      </style>
      <div class='webaudio-knob-body' tabindex='1' touch-action='none'><div class='webaudioctrl-tooltip'></div><div part="label" class="webaudioctrl-label"><slot></slot></div></div>
      `;
    this.elem = root.childNodes[2];
    this.ttframe = this.elem.firstChild;
    this.label = this.ttframe.nextSibling;
    this.enable = this.getAttr("enable", 1);
    this._src = this.getAttr("src", opt.knobSrc);
    Object.defineProperty(this, "src", {
      get: () => {
        return this._src;
      },
      set: (v) => {
        this._src = v;
        this.setupImage();
      },
    });
    this._value = this.getAttr("value", 0);
    Object.defineProperty(this, "value", {
      get: () => {
        return this._value;
      },
      set: (v) => {
        this._value = v;
        this.redraw();
      },
    });
    this.defvalue = this.getAttr("defvalue", this._value);
    this._min = this.getAttr("min", 0);
    Object.defineProperty(this, "min", {
      get: () => {
        return this._min;
      },
      set: (v) => {
        this._min = +v;
        this.redraw();
      },
    });
    this._max = this.getAttr("max", 100);
    Object.defineProperty(this, "max", {
      get: () => {
        return this._max;
      },
      set: (v) => {
        this._max = +v;
        this.redraw();
      },
    });
    this._step = this.getAttr("step", 1);
    Object.defineProperty(this, "step", {
      get: () => {
        return this._step;
      },
      set: (v) => {
        this._step = +v;
        this.redraw();
      },
    });
    this._sprites = this.getAttr("sprites", opt.knobSprites);
    Object.defineProperty(this, "sprites", {
      get: () => {
        return this._sprites;
      },
      set: (v) => {
        this._sprites = v;
        this.setupImage();
      },
    });
    this._width = this.getAttr("width", null);
    Object.defineProperty(this, "width", {
      get: () => {
        return this._width;
      },
      set: (v) => {
        this._width = v;
        this.setupImage();
      },
    });
    this._height = this.getAttr("height", null);
    Object.defineProperty(this, "height", {
      get: () => {
        return this._height;
      },
      set: (v) => {
        this._height = v;
        this.setupImage();
      },
    });
    this._diameter = this.getAttr("diameter", null);
    Object.defineProperty(this, "diameter", {
      get: () => {
        return this._diameter;
      },
      set: (v) => {
        this._diameter = v;
        this.setupImage();
      },
    });
    this._colors = this.getAttr("colors", opt.knobColors);
    Object.defineProperty(this, "colors", {
      get: () => {
        return this._colors;
      },
      set: (v) => {
        this._colors = v;
        this.setupImage();
      },
    });
    this.outline = this.getAttr("outline", opt.outline);
    this.setupLabel();
    this.log = this.getAttr("log", 0);
    this.sensitivity = this.getAttr("sensitivity", 1);
    this.valuetip = this.getAttr("valuetip", opt.valuetip);
    this.tooltip = this.getAttr("tooltip", null);
    this.conv = this.getAttr("conv", null);
    if (this.conv) {
      const x = this._value;
      this.convValue = eval(this.conv);
      if (typeof this.convValue == "function")
        this.convValue = this.convValue(x);
    } else this.convValue = this._value;
    this.midilearn = this.getAttr("midilearn", opt.midilearn);
    this.midicc = this.getAttr("midicc", null);
    this.midiController = {};
    this.midiMode = "normal";
    if (this.midicc) {
      let ch =
        parseInt(this.midicc.substring(0, this.midicc.lastIndexOf("."))) - 1;
      let cc = parseInt(
        this.midicc.substring(this.midicc.lastIndexOf(".") + 1)
      );
      this.setMidiController(ch, cc);
    }
    if (this.midilearn && this.id) {
      if (
        webAudioControlsWidgetManager &&
        webAudioControlsWidgetManager.midiLearnTable
      ) {
        const ml = webAudioControlsWidgetManager.midiLearnTable;
        for (let i = 0; i < ml.length; ++i) {
          if (ml[i].id == this.id) {
            this.setMidiController(ml[i].cc.channel, ml[i].cc.cc);
            break;
          }
        }
      }
    }
    this.setupImage();
    this.digits = 0;
    if (this.step && this.step < 1) {
      for (let n = this.step; n < 1; n *= 10) ++this.digits;
    }
    this._setValue(this._value);
    this.coltab = ["#e00", "#000", "#000"];
    if (window.webAudioControlsWidgetManager)
      window.webAudioControlsWidgetManager.addWidget(this);
  }
  disconnectedCallback() {}
  setupImage() {
    this.kw =
      this._width || this._diameter || opt.knobWidth || opt.knobDiameter;
    this.kh =
      this._height || this._diameter || opt.knobHeight || opt.knobDiameter;
    if (!this.src) {
      if (this.colors) this.coltab = this.colors.split(";");
      if (!this.coltab) this.coltab = ["#e00", "#000", "#000"];
      let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="6464" preserveAspectRatio="none">
<defs>
  <filter id="f1">
    <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" />
  </filter>
  <radialGradient id="g1" cx="50%" cy="10%">
    <stop offset="0%" stop-color="${this.coltab[2]}"/>
    <stop offset="100%" stop-color="${this.coltab[1]}"/>
  </radialGradient>
  <linearGradient id="g2" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="#000" stop-opacity="0"/>
    <stop offset="100%" stop-color="#000" stop-opacity="0.3"/>
  </linearGradient>
  <g id="B">
    <circle cx="32" cy="32" r="31" fill="#000"/>
    <circle cx="32" cy="32" r="29" fill="url(#g1)"/>
    <circle cx="32" cy="32" r="29" fill="url(#g2)"/>
    <circle cx="32" cy="32" r="25" fill="${this.coltab[1]}" filter="url(#f1)"/>
    <circle cx="32" cy="32" r="29" fill="url(#g2)"/>
  </g>
  <line id="K" x1="32" y1="25" x2="32" y2="11" stroke-linecap="round" stroke-width="6" stroke="${this.coltab[0]}"/>
</defs>`;
      for (let i = 0; i < 101; ++i) {
        svg += `<use href="#B" y="${64 * i}"/><use href="#K" y="${
          64 * i
        }" transform="rotate(${(-135 + (270 * i) / 101).toFixed(2)},32,${
          64 * i + 32
        })"/>`;
      }
      svg += "</svg>";
      this.elem.style.backgroundImage =
        "url(data:image/svg+xml;base64," + btoa(svg) + ")";
      if (this.kw == null) this.kw = 64;
      if (this.kh == null) this.kh = 64;
      this.elem.style.backgroundSize = `${this.kw}px ${this.kh * 101}px`;
      this.elem.style.width = this.kw + "px";
      this.elem.style.height = this.kh + "px";
      this.style.height = this.kh + "px";
      this.fireflag = true;
      this.redraw();
      return;
    } else {
      this.img = new Image();
      this.img.onload = () => {
        this.elem.style.backgroundImage = "url(" + this.src + ")";
        if (this._sprites == null)
          this._sprites = this.img.height / this.img.width - 1;
        else this._sprites = +this._sprites;
        if (this.kw == null) this.kw = this.img.width;
        if (this.kh == null) this.kh = this.img.height / (this.sprites + 1);
        if (!this.sprites) this.elem.style.backgroundSize = "100% 100%";
        else
          this.elem.style.backgroundSize = `${this.kw}px ${
            this.kh * (this.sprites + 1)
          }px`;
        this.elem.style.width = this.kw + "px";
        this.elem.style.height = this.kh + "px";
        this.style.height = this.kh + "px";
        this.redraw();
      };
      this.img.src = this.src;
    }
  }
  redraw() {
    let ratio;
    this.digits = 0;
    if (this.step && this.step < 1) {
      for (let n = this.step; n < 1; n *= 10) ++this.digits;
    }
    if (this.value < this.min) {
      this.value = this.min;
    }
    if (this.value > this.max) {
      this.value = this.max;
    }
    if (this.log)
      ratio = Math.log(this.value / this.min) / Math.log(this.max / this.min);
    else ratio = (this.value - this.min) / (this.max - this.min);
    let style = this.elem.style;
    let sp = this.src ? this.sprites : 100;
    if (sp >= 1) {
      let offset = (sp * ratio) | 0;
      style.backgroundPosition = "0px " + -offset * this.kh + "px";
      style.transform = "rotate(0deg)";
    } else {
      let deg = 270 * (ratio - 0.5);
      style.backgroundPosition = "0px 0px";
      style.transform = "rotate(" + deg + "deg)";
    }
  }
  _setValue(v) {
    if (this.step)
      v = Math.round((v - this.min) / this.step) * this.step + this.min;
    this._value = Math.min(this.max, Math.max(this.min, v));
    if (this._value != this.oldvalue) {
      this.fireflag = true;
      this.oldvalue = this._value;
      if (this.conv) {
        const x = this._value;
        this.convValue = eval(this.conv);
        if (typeof this.convValue == "function")
          this.convValue = this.convValue(x);
      } else this.convValue = this._value;
      if (typeof this.convValue == "number") {
        this.convValue = this.convValue.toFixed(this.digits);
      }
      this.redraw();
      this.showtip(0);
      return 1;
    }
    return 0;
  }
  setValue(v, f) {
    if (this._setValue(v) && f)
      this.sendEvent("input"), this.sendEvent("change");
  }
  keydown(e) {
    const delta = this.step;
    if (delta == 0) delta = 1;
    switch (e.key) {
      case "ArrowUp":
        this.setValue(this.value + delta, true);
        break;
      case "ArrowDown":
        this.setValue(this.value - delta, true);
        break;
      default:
        return;
    }
    e.preventDefault();
    e.stopPropagation();
  }
  wheel(e) {
    if (!this.enable) return;
    if (this.log) {
      let r = Math.log(this.value / this.min) / Math.log(this.max / this.min);
      let d = e.deltaY > 0 ? -0.01 : 0.01;
      if (!e.shiftKey) d *= 5;
      r += d;
      this.setValue(this.min * Math.pow(this.max / this.min, r), true);
    } else {
      let delta = Math.max(this.step, (this.max - this.min) * 0.05);
      if (e.shiftKey) delta = this.step ? this.step : 1;
      delta = e.deltaY > 0 ? -delta : delta;
      this.setValue(+this.value + delta, true);
    }
    e.preventDefault();
    e.stopPropagation();
  }
  pointerdown(ev) {
    if (!this.enable) return;
    let e = ev;
    if (ev.touches) {
      e = ev.changedTouches[0];
      this.identifier = e.identifier;
    } else {
      if (e.buttons != 1 && e.button != 0) return;
    }
    this.elem.focus();
    this.drag = 1;
    this.showtip(0);
    this.oldvalue = this._value;
    let pointermove = (ev) => {
      let e = ev;
      if (ev.touches) {
        for (let i = 0; i < ev.touches.length; ++i) {
          if (ev.touches[i].identifier == this.identifier) {
            e = ev.touches[i];
            break;
          }
        }
      }
      if (this.lastShift !== e.shiftKey) {
        this.lastShift = e.shiftKey;
        this.startPosX = e.pageX;
        this.startPosY = e.pageY;
        this.startVal = this.value;
      }
      let offset =
        (this.startPosY - e.pageY - this.startPosX + e.pageX) *
        this.sensitivity;
      if (this.log) {
        let r =
          Math.log(this.startVal / this.min) / Math.log(this.max / this.min);
        r += offset / ((e.shiftKey ? 4 : 1) * 128);
        if (r < 0) r = 0;
        if (r > 1) r = 1;
        this._setValue(this.min * Math.pow(this.max / this.min, r));
      } else {
        this._setValue(
          this.min +
            (((this.startVal +
              ((this.max - this.min) * offset) / ((e.shiftKey ? 4 : 1) * 128) -
              this.min) /
              this.step) |
              0) *
              this.step
        );
      }
      if (this.fireflag) {
        this.sendEvent("input");
        this.fireflag = false;
      }
      if (e.preventDefault) e.preventDefault();
      if (e.stopPropagation) e.stopPropagation();
      return false;
    };
    let pointerup = (ev) => {
      let e = ev;
      if (ev.touches) {
        for (let i = 0; ; ) {
          if (ev.changedTouches[i].identifier == this.identifier) {
            break;
          }
          if (++i >= ev.changedTouches.length) return;
        }
      }
      this.drag = 0;
      this.showtip(0);
      this.startPosX = this.startPosY = null;
      window.removeEventListener("mousemove", pointermove);
      window.removeEventListener("touchmove", pointermove, {
        passive: false,
      });
      window.removeEventListener("mouseup", pointerup);
      window.removeEventListener("touchend", pointerup);
      window.removeEventListener("touchcancel", pointerup);
      document.body.removeEventListener("touchstart", preventScroll, {
        passive: false,
      });
      this.sendEvent("change");
    };
    let preventScroll = (e) => {
      e.preventDefault();
    };
    if (e.ctrlKey || e.metaKey) this.setValue(this.defvalue, true);
    else {
      this.startPosX = e.pageX;
      this.startPosY = e.pageY;
      this.startVal = this.value;
      window.addEventListener("mousemove", pointermove);
      window.addEventListener("touchmove", pointermove, {
        passive: false,
      });
    }
    window.addEventListener("mouseup", pointerup);
    window.addEventListener("touchend", pointerup);
    window.addEventListener("touchcancel", pointerup);
    document.body.addEventListener("touchstart", preventScroll, {
      passive: false,
    });
    ev.preventDefault();
    ev.stopPropagation();
    return false;
  }
}
