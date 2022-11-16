import {
  DirectionalLight,
  DirectionalLightHelper,
  // sRGBEncoding,
  // Mesh,
  // MeshStandardMaterial,
  AmbientLight,
} from "three";
import GUI from "lil-gui";

import Experience from "@experience/Experience.js";
import Debug from "@experience/Utils/Debug";

export default class Environment {
  experience: Experience;
  scene: THREE.Scene;
  resources: any;
  debug: Debug;
  debugFolder: GUI;
  sunLight: DirectionalLight;
  helper: DirectionalLightHelper;
  ambientLight: AmbientLight;

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("environment");
    }

    this.setSunLight();
    // this.setEnvironmentMap();
  }

  setSunLight() {
    this.ambientLight = new AmbientLight("#FFFFFF");
    this.scene.add(this.ambientLight);

    this.sunLight = new DirectionalLight("#ffffff", 35);
    this.sunLight.position.set(1.1, 25, 37);
    this.scene.add(this.sunLight);

    if (this.debug.active) {
      this.helper = new DirectionalLightHelper(this.sunLight, 40);
      // this.scene.add(this.helper);
      this.debugFolder.add(this.sunLight, "intensity").name("sunLightIntensity").min(0).max(50).step(0.001);
      this.debugFolder.add(this.sunLight.position, "x").name("sunLightX").min(-50).max(50).step(0.001);
      this.debugFolder.add(this.sunLight.position, "y").name("sunLightY").min(-50).max(50).step(0.001);
      this.debugFolder.add(this.sunLight.position, "z").name("sunLightZ").min(-50).max(50).step(0.001);
    }
  }
}
