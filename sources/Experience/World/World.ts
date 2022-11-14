import * as THREE from "three";
import gsap from "gsap";

import Experience from "@experience/Experience";
import Loader from "@experience/Loader";

import Time from "@utils/Time";

import Sky from "@world/Sky";
import Video from "@world/Video";

export default class World {
  experience: Experience;
  scene: THREE.Scene;
  time: Time;
  button: HTMLButtonElement;
  loader: Loader;
  loaderDiv: HTMLDivElement;
  cursor: number;
  sky: Sky;
  video: Video;

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.loader = this.experience.loader;
    this.loaderDiv = document.querySelector(".loader") as HTMLDivElement;
    this.button = document.querySelector(".start") as HTMLButtonElement;

    this.button.addEventListener("click", () => {
      this.setSky();
      this.setVideo();

      gsap.to(this.loaderDiv, {
        opacity: 0,
        duration: 0.5,
        delay: 0.5,
      });
      this.loaderDiv.classList.add("disabled");
      gsap.to(this.loader.overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0, delay: 1 });
    });
  }

  setSky() {
    this.sky = new Sky();
  }

  setVideo() {
    this.video = new Video();
  }

  update() {
    if (this.video) this.video.update();
  }
}
