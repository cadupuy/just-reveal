import gsap from "gsap";

import Experience from "@experience/Experience";
import Loader from "@experience/Loader";

import Video from "@world/Video";
import Room from "@world/Room";
import Environment from "@world/Environment";
import Cube from "@world/Cube";
import Camera from "@experience/Camera";
import Parallax from "@utils/Parallax";
import Resources from "@utils/Resources";
import Sound from "@experience/Sound";

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
  public resources: Resources;
  public audio: Sound;

  constructor() {
    this.experience = new Experience();
    this.loader = this.experience.loader;
    this.camera = this.experience.camera;
    this.parallax = this.experience.parallax;
    this.resources = this.experience.resources;
    this.audio = this.experience.audio;

    this.loaderDiv = document.querySelector(".loader") as HTMLDivElement;
    this.button = document.querySelector(".loader__button") as HTMLButtonElement;

    this.button.addEventListener("click", () => {
      this.setCube();
      this.setRoom();
      this.setEnvironment();

      this.audio.init();
      this.audio.play();

      gsap.to(this.loaderDiv, {
        opacity: 0,
        duration: 0.5,
        delay: 0.2,
      });
      this.loaderDiv.classList.add("disabled");

      const tl = gsap.timeline({
        onComplete: () => {
          this.experience.isLoading = false;
          // this.parallax.params.active = true;
        },
      });

      tl.to(this.loader.overlayMaterial.uniforms.uAlpha, {
        duration: 1.5,
        value: 0,
        delay: 0.75,
        ease: "expo.easeOut",
      });

      tl.fromTo(
        this.camera.instance.position,
        {
          x: -0.15,
          y: 3.5,
          z: 0,
        },
        {
          duration: 3,
          x: this.camera.params.x,
          y: this.camera.params.y,
          z: this.camera.params.z,
          ease: "power3.easeIn",
        },
        "<-0.25"
      );

      tl.to(
        this.cube.mesh.position,
        {
          y: this.cube.params.y,
          duration: 3,
          ease: "expo.easeOut",
        },
        ">-3"
      );
    });
  }

  private setCube() {
    this.cube = new Cube();
  }

  private setEnvironment() {
    this.environment = new Environment();
  }

  private setRoom() {
    this.room = new Room(this.cube);
  }

  public newRoom() {
    this.room = new Room(this.cube);
  }

  public update() {
    if (this.video) this.video.update();
    if (this.cube) this.camera.instance.lookAt(this.cube.mesh.position);
  }
}
