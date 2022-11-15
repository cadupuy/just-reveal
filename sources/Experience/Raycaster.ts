import { Vector2, Raycaster, MeshStandardMaterial } from "three";

import Experience from "@experience/Experience";
import Camera from "@experience/Camera";

import Mouse from "@utils/Mouse";

export default class Raycast {
  public raycaster: Raycaster;
  public pointer: Vector2;
  public currentIntersect: any;

  private experience: Experience;
  public scene: THREE.Scene;
  private camera: Camera;
  private mouse: Mouse;
  private bodyElem: HTMLElement;
  public material: any;
  items: THREE.Mesh[];

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.items = this.experience.items;
    this.mouse = this.experience.mouse;
    this.bodyElem = document.querySelector("html,body") as HTMLElement;
    this.currentIntersect = null;
    this.material = null;

    this.init();

    window.addEventListener("click", () => {
      if (this.currentIntersect && !this.experience.selectedItem) {
        if (this.experience.world) {
          this.experience.world.room.handleClick(this.currentIntersect);
        }
      }
    });
  }

  private init() {
    this.raycaster = new Raycaster();
    this.pointer = new Vector2();
  }

  public update() {
    this.raycaster.setFromCamera(this.mouse.instance, this.camera.instance);

    // const intersects = this.raycaster.intersectObjects(this.items);
    const intersects = this.raycaster.intersectObjects(this.items);

    if (intersects.length > 0) {
      this.bodyElem.style.cursor = "pointer";

      if (this.currentIntersect !== intersects[0].object) {
        if (this.currentIntersect) {
          // this.material = this.currentIntersect.material.clone();
          this.currentIntersect.material = this.material;
        }

        this.currentIntersect = intersects[0].object;
        this.material = this.currentIntersect.material.clone();

        this.currentIntersect.material = new MeshStandardMaterial({ color: "red" });
      }
    } else {
      this.bodyElem.style.cursor = "default";

      if (this.currentIntersect) {
        this.currentIntersect.material = this.material;
      }

      this.currentIntersect = null;
    }
  }
}
