export default class SoundClass {
  static _instance: any;
  ctx: any;
  audio: any;
  audioSource: any;
  analyser: any;
  fdata: any;
  url: any;
  flag: any;

  constructor(audioUrl) {
    if (SoundClass._instance) {
      return SoundClass._instance;
    }

    SoundClass._instance = this;

    this.ctx;
    this.audio;
    this.audioSource;
    this.analyser;
    this.fdata;
    this.url = audioUrl;
    this.flag;
  }

  init() {
    this.ctx = new AudioContext();
    this.audio = new Audio(this.url);
    this.audioSource = this.ctx.createMediaElementSource(this.audio);
    this.analyser = this.ctx.createAnalyser();
    this.analyser.smoothingTimeConstant = 0.8;

    this.audioSource.connect(this.analyser);
    this.audioSource.connect(this.ctx.destination);
    this.fdata = new Uint8Array(this.analyser.frequencyBinCount);

    this.audio.addEventListener(
      "ended",
      function () {
        this.currentTime = 0;
        this.play();
      },
      false
    );
  }

  play() {
    this.audio.play();

    this.flag = true;
  }

  pause() {
    this.audio.pause();
    this.flag = false;
  }

  update() {
    this.analyser.getByteFrequencyData(this.fdata);
  }
}
