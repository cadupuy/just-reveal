export default class Sound {
  private audioSource: MediaElementAudioSourceNode;
  private analyser: AnalyserNode;
  private fdata: Uint8Array;
  private url: string;
  private flag: boolean;
  public ctx: AudioContext;
  public audio: HTMLAudioElement;
  public currentTime: number;

  constructor(audioUrl: string) {
    this.ctx;
    this.audio;
    this.audioSource;
    this.analyser;
    this.fdata;
    this.url = audioUrl;
    this.flag;
  }

  public init() {
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
      () => {
        this.currentTime = 0;
        this.play();
      },
      false
    );
  }

  public play() {
    this.audio.play();
    this.flag = true;
  }

  public pause() {
    this.audio.pause();
    this.flag = false;
  }

  public update() {
    this.analyser.getByteFrequencyData(this.fdata);
  }
}
