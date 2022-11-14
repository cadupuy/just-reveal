// import * as THREE from "three";
import gsap from "gsap";

import Experience from "@experience/Experience";
import Loader from "@experience/Loader";

import Sky from "@world/Sky";
import Video from "@world/Video";
import Cube from "./Cube";

export default class World {
  private experience: Experience;
  private button: HTMLButtonElement;
  private loader: Loader;
  private loaderDiv: HTMLDivElement;
  private video: Video;
  public sky: Sky;
  public cube: Cube;

  constructor() {
    this.experience = new Experience();
    this.loader = this.experience.loader;
    this.loaderDiv = document.querySelector(".loader") as HTMLDivElement;
    this.button = document.querySelector(".start") as HTMLButtonElement;

    this.button.addEventListener("click", () => {
      this.setSky();
      this.setVideo();
      this.setCube();

      gsap.to(this.loaderDiv, {
        opacity: 0,
        duration: 0.5,
        delay: 0.5,
      });
      this.loaderDiv.classList.add("disabled");
      gsap.to(this.loader.overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0, delay: 1 });
    });
  }

  private setSky() {
    this.sky = new Sky();
  }

  private setVideo() {
    this.video = new Video();
  }

  private setCube() {
    this.cube = new Cube();
  }

  public update() {
    if (this.video) this.video.update();
  }
}
