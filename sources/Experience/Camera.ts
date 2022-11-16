import { PerspectiveCamera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";

import GUI from "lil-gui";

import Experience from "@experience/Experience";

import Debug from "@utils/Debug";
import Sizes from "@utils/Sizes";
import Parallax from "@utils/Parallax";

export default class Camera {
  public instance: THREE.PerspectiveCamera;

  private experience: Experience;
  private scene: THREE.Scene;
  private debug: Debug;
  private debugFolder: GUI;
  private sizes: Sizes;
  private parallax: Parallax;
  public controls: OrbitControls;
  private canvas: HTMLElement | undefined;
  params: { x: number; y: number; z: number };

  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.debug = this.experience.debug;
    this.parallax = this.experience.parallax;
    this.params = {
      x: 0,
      y: 4.57,
      z: 7.5,
    };

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("camera");
    }

    this.setInstance();
  }

  private setInstance() {
    this.instance = new PerspectiveCamera(45, this.sizes.width / this.sizes.height, 0.1, 150);
    this.instance.position.set(0, 3, 0);

    this.scene.add(this.instance);

    if (this.debug.active) {
      //position
      this.debugFolder.add(this.instance.position, "x").name("posx").min(0).max(15).step(0.01);
      this.debugFolder.add(this.instance.position, "y").name("posy").min(0).max(15).step(0.01);
      this.debugFolder.add(this.instance.position, "z").name("posz").min(0).max(15).step(0.01);

      //rotation
      this.debugFolder.add(this.instance.rotation, "x").name("rotx").min(-50).max(50).step(0.01);
      this.debugFolder.add(this.instance.rotation, "y").name("roty").min(-50).max(50).step(0.01);
      this.debugFolder.add(this.instance.rotation, "z").name("rotz").min(-50).max(50).step(0.01);

      this.debugFolder
        .add(this.instance, "near")
        .min(0)
        .max(10)
        .step(0.1)
        .onChange(() => this.instance.updateProjectionMatrix())
        .name("Camera Near");
      this.debugFolder
        .add(this.instance, "far")
        .min(0)
        .max(1000)
        .step(0.1)
        .onChange(() => this.instance.updateProjectionMatrix())
        .name("Camera Far");
      this.debugFolder
        .add(this.instance, "fov")
        .min(0)
        .max(180)
        .step(0.1)
        .onChange(() => this.instance.updateProjectionMatrix())
        .name("Camera FOV");
    }
  }

  public resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  public initialPosition() {
    this.experience.parallax.params.active = false;
    gsap.fromTo(
      this.instance.position,
      {
        x: this.instance.position.x,
        y: this.instance.position.y,
        z: this.instance.position.z,
        onComplete: () => {
          this.experience.parallax.params.active = true;
          this.experience.selectedItem = false;
        },
      },
      {
        x: this.params.x,
        y: this.params.y,
        z: this.params.y,
        duration: 2,
        ease: "expo.easeOut",
      }
    );
  }

  public update() {
    this.instance.lookAt(0, 2.5, 0);

    if (this.parallax.params.active) {
      this.instance.position.x += (this.parallax.instance.x - this.instance.position.x) * this.parallax.params.ease;
      // this.instance.position.y += (this.parallax.instance.y - this.instance.position.y) * this.parallax.params.ease;
      // this.instance.position.z += (65 - this.instance.position.z) * this.parallax.params.ease;
      this.instance.lookAt(0, 2.5, 0);
    }
  }
}
