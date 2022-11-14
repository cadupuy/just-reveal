import * as THREE from "three";

import Experience from "@experience/Experience";

export default class Sky {
  private experience: Experience;
  private scene: THREE.Scene;

  video: HTMLVideoElement;
  videoImageContext: CanvasRenderingContext2D | null;
  videoTexture: THREE.Texture;

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.setVideo();
  }

  setVideo() {
    this.video = document.createElement("video") as HTMLVideoElement;
    this.video.src = "/assets/video.mp4";
    this.video.load();
    this.video.play();

    const videoImage = document.createElement("canvas") as HTMLCanvasElement;
    videoImage.width = 480;
    videoImage.height = 204;

    this.videoImageContext = videoImage.getContext("2d");
    // background color if no video present
    this.videoImageContext!.fillStyle = "#000000";
    this.videoImageContext!.fillRect(0, 0, videoImage.width, videoImage.height);

    this.videoTexture = new THREE.Texture(videoImage);
    this.videoTexture.minFilter = THREE.LinearFilter;
    this.videoTexture.magFilter = THREE.LinearFilter;

    var movieMaterial = new THREE.MeshBasicMaterial({ map: this.videoTexture, side: THREE.DoubleSide });
    // the geometry on which the movie will be displayed;
    // 		movie image will be scaled to fit these dimensions.
    var movieGeometry = new THREE.PlaneGeometry(20, 15, 20, 20);
    var movieScreen = new THREE.Mesh(movieGeometry, movieMaterial);
    movieScreen.position.set(0, 0, 0);
    this.scene.add(movieScreen);
  }

  update() {
    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
      this.videoImageContext!.drawImage(this.video, 0, 0);
      if (this.videoTexture) this.videoTexture.needsUpdate = true;
    }
  }
}
