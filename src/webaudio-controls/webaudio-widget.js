import { opt } from "./";

let midimenu = document.createElement("ul");
midimenu.id = "webaudioctrl-context-menu";
midimenu.innerHTML = `<li class="webaudioctrl-context-menu__title">MIDI Learn</li>
<li class="webaudioctrl-context-menu__item" id="webaudioctrl-context-menu-learn" onclick="webAudioControlsWidgetManager.contextMenuLearn()">Learn</li>
<li class="webaudioctrl-context-menu__item" onclick="webAudioControlsWidgetManager.contextMenuClear()">Clear</li>
<li class="webaudioctrl-context-menu__item" onclick="webAudioControlsWidgetManager.contextMenuClose()">Close</li>
`;
export class WebAudioControlsWidgetManager {
  constructor() {
    this.midiAccess = null;
    this.listOfWidgets = [];
    this.listOfExternalMidiListeners = [];
    if (opt.preserveMidiLearn)
      this.midiLearnTable = JSON.parse(
        localStorage.getItem("WebAudioControlsMidiLearn")
      );
    else this.midiLearnTable = null;
    this.initWebAudioControls();
  }
  addWidget(w) {
    this.listOfWidgets.push(w);
  }
  initWebAudioControls() {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess().then(
        (ma) => {
          (this.midiAccess = ma), this.enableInputs();
        },
        (err) => {
          console.log("MIDI not initialized - error encountered:" + err.code);
        }
      );
    }
  }
  enableInputs() {
    let inputs = this.midiAccess.inputs.values();
    console.log("Found " + this.midiAccess.inputs.size + " MIDI input(s)");
    for (
      let input = inputs.next();
      input && !input.done;
      input = inputs.next()
    ) {
      console.log("Connected input: " + input.value.name);
      input.value.onmidimessage = this.handleMIDIMessage.bind(this);
    }
  }
  midiConnectionStateChange(e) {
    console.log(
      "connection: " +
        e.port.name +
        " " +
        e.port.connection +
        " " +
        e.port.state
    );
    enableInputs();
  }

  onMIDIStarted(midi) {
    this.midiAccess = midi;
    midi.onstatechange = this.midiConnectionStateChange;
    enableInputs(midi);
  }
  // Add hooks for external midi listeners support
  addMidiListener(callback) {
    this.listOfExternalMidiListeners.push(callback);
  }
  getCurrentConfigAsJSON() {
    return currentConfig.stringify();
  }
  handleMIDIMessage(event) {
    this.listOfExternalMidiListeners.forEach(function (externalListener) {
      externalListener(event);
    });
    if (
      (event.data[0] & 0xf0) == 0xf0 ||
      ((event.data[0] & 0xf0) == 0xb0 && event.data[1] >= 120)
    )
      return;
    for (let w of this.listOfWidgets) {
      if (w.processMidiEvent) w.processMidiEvent(event);
    }
    if (opt.mididump) console.log(event.data);
  }
  contextMenuOpen(e, knob) {
    if (!this.midiAccess) return;
    let menu = document.getElementById("webaudioctrl-context-menu");
    menu.style.left = e.pageX + "px";
    menu.style.top = e.pageY + "px";
    menu.knob = knob;
    menu.classList.add("active");
    menu.knob.focus();
    menu.knob.addEventListener(
      "keydown",
      this.contextMenuCloseByKey.bind(this)
    );
  }
  contextMenuCloseByKey(e) {
    if (e.keyCode == 27) this.contextMenuClose();
  }
  contextMenuClose() {
    let menu = document.getElementById("webaudioctrl-context-menu");
    menu.knob.removeEventListener("keydown", this.contextMenuCloseByKey);
    menu.classList.remove("active");
    let menuItemLearn = document.getElementById(
      "webaudioctrl-context-menu-learn"
    );
    menuItemLearn.innerHTML = "Learn";
    menu.knob.midiMode = "normal";
  }
  contextMenuLearn() {
    let menu = document.getElementById("webaudioctrl-context-menu");
    let menuItemLearn = document.getElementById(
      "webaudioctrl-context-menu-learn"
    );
    menuItemLearn.innerHTML = "Listening...";
    menu.knob.midiMode = "learn";
  }
  contextMenuClear(e) {
    let menu = document.getElementById("webaudioctrl-context-menu");
    menu.knob.midiController = {};
    this.contextMenuClose();
  }
  preserveMidiLearn() {
    if (!opt.preserveMidiLearn) return;
    const v = [];
    for (let w of this.listOfWidgets) {
      if (w.id) v.push({ id: w.id, cc: w.midiController });
    }
    const s = JSON.stringify(v);
    localStorage.setItem("WebAudioControlsMidiLearn", s);
  }
}

export class WebAudioControlsWidget extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("keydown", this.keydown);
    this.addEventListener("mousedown", this.pointerdown, { passive: false });
    this.addEventListener("touchstart", this.pointerdown, { passive: false });
    this.addEventListener("wheel", this.wheel, { passive: false });
    this.addEventListener("mouseover", this.pointerover);
    this.addEventListener("mouseout", this.pointerout);
    this.addEventListener("contextmenu", this.contextMenu);
    this.hover = this.drag = 0;
    document.body.appendChild(midimenu);
    this.basestyle = `
.webaudioctrl-tooltip{
  display:inline-block;
  position:absolute;
  margin:0 -1000px;
  z-index: 999;
  background:#eee;
  color:#000;
  border:1px solid #666;
  border-radius:4px;
  padding:5px 10px;
  text-align:center;
  left:0; top:0;
  font-size:11px;
  opacity:0;
  visibility:hidden;
}
.webaudioctrl-tooltip:before{
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -8px;
  border: 8px solid transparent;
  border-top: 8px solid #666;
}
.webaudioctrl-tooltip:after{
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -6px;
  border: 6px solid transparent;
  border-top: 6px solid #eee;
}
`;
    this.onblur = () => {
      this.elem.style.outline = "none";
    };
    this.onfocus = () => {
      switch (+this.outline) {
        case null:
        case 0:
          this.elem.style.outline = "none";
          break;
        case 1:
          this.elem.style.outline = "1px solid #444";
          break;
        default:
          this.elem.style.outline = this.outline;
      }
    };
  }
  sendEvent(ev) {
    let event;
    event = document.createEvent("HTMLEvents");
    event.initEvent(ev, false, true);
    this.dispatchEvent(event);
  }
  getAttr(n, def) {
    let v = this.getAttribute(n);
    if (v == null) return def;
    switch (typeof def) {
      case "number":
        if (v == "true") return 1;
        v = +v;
        if (isNaN(v)) return 0;
        return v;
    }
    return v;
  }
  showtip(d) {
    function valstr(x, c, type) {
      switch (type) {
        case "x":
          return (x | 0).toString(16);
        case "X":
          return (x | 0).toString(16).toUpperCase();
        case "d":
          return (x | 0).toString();
        case "f":
          return parseFloat(x).toFixed(c);
        case "s":
          return x.toString();
      }
      return "";
    }
    function numformat(s, x) {
      let i = s.indexOf("%");
      let j = i + 1;
      if (i < 0) j = s.length;
      let c = [0, 0],
        type = 0,
        m = 0,
        r = "";
      if (s.indexOf("%s") >= 0) {
        return s.replace("%s", x);
      }
      for (; j < s.length; ++j) {
        if ("dfxXs".indexOf(s[j]) >= 0) {
          type = s[j];
          break;
        }
        if (s[j] == ".") m = 1;
        else c[m] = c[m] * 10 + parseInt(s[j]);
      }
      r = valstr(x, c[1], type);
      if (c[0] > 0) r = ("               " + r).slice(-c[0]);
      r = s.replace(/%.*[xXdfs]/, r);
      return r;
    }
    let s = this.tooltip;
    if (this.drag || this.hover) {
      if (this.valuetip) {
        if (s == null) s = `%s`;
        else if (s.indexOf("%") < 0) s += ` : %s`;
      }
      if (s) {
        this.ttframe.innerHTML = numformat(s, this.convValue);
        this.ttframe.style.display = "inline-block";
        this.ttframe.style.width = "auto";
        this.ttframe.style.height = "auto";
        this.ttframe.style.transition =
          "opacity 0.5s " + d + "s,visibility 0.5s " + d + "s";
        this.ttframe.style.opacity = 0.9;
        this.ttframe.style.visibility = "visible";
        let rc = this.getBoundingClientRect(),
          rc2 = this.ttframe.getBoundingClientRect(),
          rc3 = document.documentElement.getBoundingClientRect();
        this.ttframe.style.left = (rc.width - rc2.width) * 0.5 + 1000 + "px";
        this.ttframe.style.top = -rc2.height - 8 + "px";
        return;
      }
    }
    this.ttframe.style.transition =
      "opacity 0.1s " + d + "s,visibility 0.1s " + d + "s";
    this.ttframe.style.opacity = 0;
    this.ttframe.style.visibility = "hidden";
  }
  setupLabel() {
    this.labelpos = this.getAttr("labelpos", "bottom 0px");
    const lpos = this.labelpos.split(" ");
    let offs = "";
    if (lpos.length == 3) offs = `translate(${lpos[1]},${lpos[2]})`;
    this.label.style.position = "absolute";
    switch (lpos[0]) {
      case "center":
        this.label.style.top = "50%";
        this.label.style.left = "50%";
        this.label.style.transform = `translate(-50%,-50%) ${offs}`;
        break;
      case "right":
        this.label.style.top = "50%";
        this.label.style.left = "100%";
        this.label.style.transform = `translateY(-50%) ${offs}`;
        break;
      case "left":
        this.label.style.top = "50%";
        this.label.style.left = "0%";
        this.label.style.transform = `translate(-100%,-50%) ${offs}`;
        break;
      case "bottom":
        this.label.style.top = "100%";
        this.label.style.left = "50%";
        this.label.style.transform = `translateX(-50%) ${offs}`;
        break;
      case "top":
        this.label.style.top = "0%";
        this.label.style.left = "50%";
        this.label.style.transform = `translate(-50%,-100%) ${offs}`;
        break;
    }
  }
  pointerover(e) {
    this.hover = 1;
    this.showtip(0.6);
  }
  pointerout(e) {
    this.hover = 0;
    this.showtip(0);
  }
  contextMenu(e) {
    if (window.webAudioControlsWidgetManager && this.midilearn)
      webAudioControlsWidgetManager.contextMenuOpen(e, this);
    e.preventDefault();
    e.stopPropagation();
  }
  setMidiController(channel, cc) {
    if (this.listeningToThisMidiController(channel, cc)) return;
    this.midiController = { channel: channel, cc: cc };
    console.log(
      "Added mapping for channel=" +
        channel +
        " cc=" +
        cc +
        " tooltip=" +
        this.tooltip
    );
  }
  listeningToThisMidiController(channel, cc) {
    const c = this.midiController;
    if ((c.channel === channel || c.channel < 0) && c.cc === cc) return true;
    return false;
  }
  processMidiEvent(event) {
    const channel = event.data[0] & 0xf;
    const controlNumber = event.data[1];
    if (this.midiMode == "learn") {
      this.setMidiController(channel, controlNumber);
      webAudioControlsWidgetManager.contextMenuClose();
      this.midiMode = "normal";
      webAudioControlsWidgetManager.preserveMidiLearn();
    }
    if (this.listeningToThisMidiController(channel, controlNumber)) {
      if (this.tagName == "WEBAUDIO-SWITCH") {
        switch (this.type) {
          case "toggle":
            if (event.data[2] >= 64) this.setValue(1 - this.value, true);
            break;
          case "kick":
            this.setValue(event.data[2] >= 64 ? 1 : 0);
            break;
          case "radio":
            let els = document.querySelectorAll(
              "webaudio-switch[type='radio'][group='" + this.group + "']"
            );
            for (let i = 0; i < els.length; ++i) {
              if (els[i] == this) els[i].setValue(1);
              else els[i].setValue(0);
            }
            break;
        }
      } else {
        const val = this.min + ((this.max - this.min) * event.data[2]) / 127;
        this.setValue(val, true);
      }
    }
  }
}
