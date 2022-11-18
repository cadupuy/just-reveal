import { Raycaster } from "three";

import Experience from "@experience/Experience";
import Camera from "@experience/Camera";

import Mouse from "@utils/Mouse";
import Cube from "@world/Cube";

export default class Raycast {
  public raycaster: Raycaster;
  public currentIntersect: THREE.Object3D | null;
  private experience: Experience;
  public scene: THREE.Scene;
  private camera: Camera;
  private mouse: Mouse;
  private bodyElem: HTMLElement;
  private cursor: HTMLElement;
  public cube: Cube;
  public arrow: HTMLDivElement;
  public overlay: HTMLDivElement;

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.mouse = this.experience.mouse;
    this.bodyElem = document.querySelector("html,body") as HTMLElement;
    this.cursor = document.querySelector("#cursor") as HTMLElement;
    this.currentIntersect = null;
    this.arrow = document.querySelector(".back") as HTMLDivElement;
    this.overlay = document.querySelector(".overlay") as HTMLDivElement;

    this.init();

    window.addEventListener("click", () => {
      // if (this.experience.selectedItem) {
      //   this.bodyElem.style.cursor = "default";
      //   this.arrow.classList.remove("in");
      //   this.overlay.classList.remove("in");

      //   this.camera.initialPosition();
      //   this.experience.world.cube.initialPosition();
      //   if (this.experience.isSoundActive) {
      //     this.experience.audio.play();
      //   }
      //   return;
      // }
      if (this.currentIntersect && !this.experience.selectedItem) {
        if (this.experience.world) {
          this.experience.world.room.handleClick(this.currentIntersect);
        }
      }
    });
  }

  private init() {
    this.raycaster = new Raycaster();
  }

  public update() {
    if (this.experience.selectedItem) {
      this.cursor.classList.remove("intersecting");

      return;
    }

    this.raycaster.setFromCamera(this.mouse.instance, this.camera.instance);
    const intersects = this.raycaster.intersectObjects(this.experience.items, true);

    if (intersects.length > 0) {
      this.bodyElem.style.cursor = "pointer";

      this.cursor.classList.add("intersecting");

      if (this.currentIntersect !== intersects[0].object) {
        this.currentIntersect = intersects[0].object;
      }
    } else {
      this.bodyElem.style.cursor = "default";

      this.cursor.classList.remove("intersecting");

      this.currentIntersect = null;
    }
  }
}
