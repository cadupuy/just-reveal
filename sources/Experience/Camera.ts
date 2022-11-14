import { PerspectiveCamera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

import Experience from "@experience/Experience";

import Debug from "@utils/Debug";
import Sizes from "@utils/Sizes";
import Mouse from "@utils/Mouse";

export default class Camera {
  instance: THREE.PerspectiveCamera;
  experience: Experience;
  scene: THREE.Scene;
  controls: OrbitControls;
  canvas: HTMLCanvasElement | undefined;
  debug: Debug;
  debugFolder: GUI;
  sizes: Sizes;
  mouse: Mouse;

  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.debug = this.experience.debug;
    this.mouse = this.experience.mouse;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("camera");
    }

    this.setInstance();
  }

  private setInstance() {
    this.instance = new PerspectiveCamera(45, this.sizes.width / this.sizes.height, 1, 500);
    this.instance.position.set(0, 1.6, 52);
    this.scene.add(this.instance);

    if (this.debug.active) {
      this.debugFolder.add(this.instance.position, "x").min(-500).max(500).step(0.01);
      this.debugFolder.add(this.instance.position, "y").min(-500).max(500).step(0.01);
      this.debugFolder.add(this.instance.position, "z").min(-500).max(500).step(0.01);

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

  public update() {
    this.instance.position.x += (this.mouse.instance.x - this.instance.position.x) * this.mouse.params.ease;
    this.instance.position.y += (this.mouse.instance.y - this.instance.position.y) * this.mouse.params.ease;
    this.instance.position.z += (52 - this.instance.position.z) * this.mouse.params.ease;
    this.instance.lookAt(0, 0, 0);
  }
}