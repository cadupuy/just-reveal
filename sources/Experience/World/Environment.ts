import { DirectionalLight, DirectionalLightHelper, AmbientLight } from "three";
import GUI from "lil-gui";

import Experience from "@experience/Experience.js";
import Debug from "@experience/Utils/Debug";

export default class Environment {
  private experience: Experience;
  private scene: THREE.Scene;
  private debug: Debug;
  private debugFolder: GUI;

  public sunLight: DirectionalLight;
  public ambientLight: AmbientLight;
  public helper: DirectionalLightHelper;

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("environment");
    }

    this.setSunLight();
  }

  setSunLight() {
    this.sunLight = new DirectionalLight("#ffffff", 8);
    this.sunLight.position.set(1.1, 25, 37);
    this.sunLight.name = "light";

    this.scene.add(this.sunLight);

    if (this.debug.active) {
      this.debugFolder.add(this.sunLight, "intensity").name("sunLightIntensity").min(0).max(50).step(0.001);
      this.debugFolder.add(this.sunLight.position, "x").name("sunLightX").min(-50).max(50).step(0.001);
      this.debugFolder.add(this.sunLight.position, "y").name("sunLightY").min(-50).max(50).step(0.001);
      this.debugFolder.add(this.sunLight.position, "z").name("sunLightZ").min(-50).max(50).step(0.001);
    }
  }
}
