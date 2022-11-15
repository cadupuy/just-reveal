import { PerspectiveCamera } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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

  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.debug = this.experience.debug;
    this.parallax = this.experience.parallax;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("camera");
    }

    this.setInstance();
    // this.setControls();
  }

  private setInstance() {
    this.instance = new PerspectiveCamera(50, this.sizes.width / this.sizes.height, 1, 500);
    this.instance.position.set(0, 12, 65);
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

  private setControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
  }

  public resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  public update() {
    // this.controls.update();

    if (this.parallax.params.active) {
      this.instance.position.x += (this.parallax.instance.x - this.instance.position.x) * this.parallax.params.ease;
      // this.instance.position.y += (this.parallax.instance.y - this.instance.position.y) * this.parallax.params.ease;
      this.instance.position.z += (65 - this.instance.position.z) * this.parallax.params.ease;
      this.instance.lookAt(0, 0, 0);
    }
  }
}
