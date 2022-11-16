// import * as THREE from "three";
import gsap from "gsap";

import Experience from "@experience/Experience";
import Loader from "@experience/Loader";

import Video from "@world/Video";
import Room from "@world/Room";
import Environment from "@world/Environment";
import Cube from "@world/Cube";
import Camera from "@experience/Camera";
import Parallax from "@experience/Utils/Parallax";
import Sky from "@world/Sky";

export default class World {
  private experience: Experience;
  private button: HTMLButtonElement;
  private loader: Loader;
  private loaderDiv: HTMLDivElement;
  private video: Video;
  public room: Room;
  public environment: Environment;
  public cube: Cube;
  public camera: Camera;
  public parallax: Parallax;
  public sky: Sky;

  constructor() {
    this.experience = new Experience();
    this.loader = this.experience.loader;
    this.camera = this.experience.camera;
    this.parallax = this.experience.parallax;

    this.loaderDiv = document.querySelector(".loader") as HTMLDivElement;
    this.button = document.querySelector(".start") as HTMLButtonElement;

    this.button.addEventListener("click", () => {
      this.setRoom();
      this.setSky();
      this.setCube();
      this.setEnvironment();

      gsap.to(this.loaderDiv, {
        opacity: 0,
        duration: 0.5,
        delay: 0.2,
      });
      this.loaderDiv.classList.add("disabled");

      const tl = gsap.timeline({
        onComplete: () => {
          this.experience.isLoading = false;
          this.parallax.params.active = true;
        },
      });

      tl.to(this.loader.overlayMaterial.uniforms.uColor, { duration: 1.5, value: 1, delay: 0.2, ease: "expo.easeOut" });
      tl.to(
        this.loader.overlayMaterial.uniforms.uAlpha,
        { duration: 1.5, value: 0, delay: 1.5, ease: "expo.easeOut" },
        "<-0.2"
      );
      tl.fromTo(
        this.camera.instance.position,
        {
          x: this.room.screen!.position.x,
          y: this.room.screen!.position.y,
          z: this.room.screen!.position.z,
        },
        {
          duration: 3,
          x: this.camera.params.x,
          y: this.camera.params.y,
          z: this.camera.params.z,
        }
      );
    });
  }

  private setSky() {
    this.sky = new Sky();
  }

  private setCube() {
    this.cube = new Cube();
  }

  private setEnvironment() {
    this.environment = new Environment();
  }

  private setRoom() {
    this.room = new Room();
  }

  public update() {
    if (this.video) this.video.update();
    // if (this.cube) this.cube.update();
  }
}
