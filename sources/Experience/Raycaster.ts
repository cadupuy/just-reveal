import { Raycaster } from "three";

import Experience from "@experience/Experience";
import Camera from "@experience/Camera";

import Mouse from "@utils/Mouse";

export default class Raycast {
  public raycaster: Raycaster;
  public currentIntersect: any;

  private experience: Experience;
  public scene: THREE.Scene;
  private camera: Camera;
  private mouse: Mouse;
  private bodyElem: HTMLElement;
  private cursor: HTMLElement;
  public material: any;
  items: THREE.Mesh[];
  cube: import("/Users/charles-antoinedupuy/Desktop/testts/sources/Experience/World/Cube").default;

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.items = this.experience.items;
    this.mouse = this.experience.mouse;
    // this.isLoading = this.experience.isLoading;
    this.bodyElem = document.querySelector("html,body") as HTMLElement;
    this.cursor = document.querySelector("#cursor") as HTMLElement;
    this.currentIntersect = null;
    this.material = null;

    this.init();

    window.addEventListener("click", () => {
      if (this.experience.selectedItem) {
        this.camera.initialPosition();
        this.experience.world.cube.initialPosition();

        if (this.experience.isSoundActive) {
          this.experience.audio.play();
        }
        return;
      }

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

    const intersects = this.raycaster.intersectObjects(this.items);

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
