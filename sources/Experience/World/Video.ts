import * as THREE from "three";

import Experience from "@experience/Experience";

export default class Video {
  private experience: Experience;
  private scene: THREE.Scene;
  private video: HTMLVideoElement;
  private videoTexture: THREE.Texture;

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.setVideo();
  }

  private setVideo() {
    this.video = document.querySelector("#video") as HTMLVideoElement;

    this.video.play();
    this.videoTexture = new THREE.VideoTexture(this.video);

    this.videoTexture.minFilter = THREE.LinearFilter;
    this.videoTexture.magFilter = THREE.LinearFilter;

    var movieMaterial = new THREE.MeshBasicMaterial({
      map: this.videoTexture,
      side: THREE.FrontSide,
      toneMapped: false,
    });

    var movieGeometry = new THREE.PlaneGeometry(20, 10, 20, 20);
    var movieScreen = new THREE.Mesh(movieGeometry, movieMaterial);
    movieScreen.position.set(0, 0, 0);
    this.scene.add(movieScreen);
  }

  update() {
    if (this.videoTexture) this.videoTexture.needsUpdate = true;
  }
}
