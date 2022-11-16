import * as THREE from "three";

export default class Video {
  private video: HTMLVideoElement;
  private videoTexture: THREE.Texture;
  movieScreen: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  movieMaterial: THREE.MeshBasicMaterial;

  constructor() {
    this.setVideo();
  }

  private setVideo() {
    this.video = document.querySelector("#video") as HTMLVideoElement;

    this.video.play();

    this.videoTexture = new THREE.VideoTexture(this.video);

    this.videoTexture.minFilter = THREE.LinearFilter;
    this.videoTexture.magFilter = THREE.LinearFilter;

    this.videoTexture.wrapS = THREE.RepeatWrapping;
    this.videoTexture.repeat.x = -1;

    this.movieMaterial = new THREE.MeshBasicMaterial({
      map: this.videoTexture,
      side: THREE.FrontSide,
      toneMapped: false,
    });
  }

  update() {
    if (this.videoTexture) this.videoTexture.needsUpdate = true;
  }
}
