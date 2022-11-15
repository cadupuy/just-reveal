import * as THREE from "three";
import gsap from "gsap";

import Experience from "@experience/Experience";
import Camera from "@experience/Camera";

export default class Room {
  private experience: Experience;
  private scene: THREE.Scene;

  public geometry: THREE.BoxGeometry;
  public material: THREE.MeshNormalMaterial;
  public mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshNormalMaterial>;
  resources: any;
  resource: any;
  model: any;
  items: THREE.Mesh[];
  camera: Camera;
  bodyElem: HTMLElement;

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.resources = this.experience.resources;
    this.resource = this.resources.items.desk;
    this.items = this.experience.items;
    this.bodyElem = document.querySelector("html,body") as HTMLElement;

    this.setRoom();
  }

  private setRoom() {
    this.model = this.resource.scene;

    this.model.traverse((child: THREE.Mesh) => {
      console.log(child);

      if (child.name == "container_tiroir1") {
        child.userData.open = false;
        this.items.push(child);
      }

      if (child.name == "container_tiroir2") {
        child.userData.open = false;
        this.items.push(child);
      }

      if (child.name == "container_tiroir3") {
        child.userData.open = false;
        this.items.push(child);
      }

      if (child.name == "sphere3") {
        this.items.push(child);
      }
    });

    this.model.scale.set(4, 4, 4);
    this.model.position.set(0, 0, 3);
    this.scene.add(this.model);
  }

  public handleClick(el: THREE.Mesh) {
    // this.experience.parallax.params.active = false;

    if (el.name.includes("tiroir")) this.handleDrawer(el);
    if (el.name.includes("globe")) this.handleGlobe(el);
    if (el.name.includes("Sphere")) this.handleItem(el);
  }

  private handleDrawer(el: THREE.Mesh) {
    console.log(el);

    if (el.userData.open) {
      gsap.to(
        el.position,

        {
          duration: 0.6,
          z: 1.2,
          ease: "ease.in",

          onComplete: () => {
            el.userData.open = !el.userData.open;
          },
        }
      );

      // gsap.to(this.camera.instance.position, {
      //   duration: 2,
      //   x: el.position.x,
      //   y: el.position.y,
      //   z: el.position.z,
      // });

      // gsap.to(this.camera.instance.rotation, {
      //   duration: 2,
      //   x: this.model.children[1].rotation.x,
      //   y: this.model.children[1].rotation.y,
      //   z: this.model.children[1].rotation.z,
      // });
    } else {
      gsap.to(
        el.position,

        {
          z: 3,
          duration: 0.6,
          ease: "ease.in",
          onComplete: () => {
            el.userData.open = !el.userData.open;
            let array = [...this.experience.items];
            array.filter((item: any) => item.name !== el.name);
            this.experience.items = array;
          },
        }
      );
    }
  }

  private handleGlobe(el: THREE.Mesh) {
    console.log("globe", el);
  }

  private handleItem(el: THREE.Mesh) {
    gsap.to(el.position, {
      duration: 3,
      x: this.camera.instance.position.x,
      y: this.camera.instance.position.y,
      z: this.camera.instance.position.z - 20,
    });
  }
}
