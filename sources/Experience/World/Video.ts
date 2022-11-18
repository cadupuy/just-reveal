import * as THREE from "three";
import Experience from "@experience/Experience";

export default class Video {
  public videoTexture: THREE.Texture;
  public videoElem: HTMLVideoElement;
  public movieScreen: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  public movieMaterial: THREE.MeshBasicMaterial;
  private experience: Experience;

  constructor() {
    this.experience = new Experience();

    this.setVideo();
  }

  private setVideo() {
    if (this.experience.level === 1) {
      this.videoElem = document.querySelector("#video1") as HTMLVideoElement;
    } else if (this.experience.level === 2) {
      this.videoElem = document.querySelector("#video2") as HTMLVideoElement;
    } else {
      this.videoElem = document.querySelector("#video3") as HTMLVideoElement;
    }

    // this.video.play();

    this.videoTexture = new THREE.VideoTexture(this.videoElem);

    this.videoTexture.minFilter = THREE.LinearFilter;
    this.videoTexture.magFilter = THREE.LinearFilter;

    this.videoTexture.wrapS = THREE.RepeatWrapping;
    this.videoTexture.repeat.x = -1;

    this.movieMaterial = new THREE.MeshBasicMaterial({
      map: this.videoTexture,
      side: THREE.DoubleSide,
      toneMapped: false,
    });
  }

  public update() {
    if (this.videoTexture) this.videoTexture.needsUpdate = true;
  }
}
