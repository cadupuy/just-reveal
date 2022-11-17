import { DirectionalLight, DirectionalLightHelper, SpotLight, SpotLightHelper } from "three";
import GUI from "lil-gui";

import Experience from "@experience/Experience.js";
import Debug from "@experience/Utils/Debug";

export default class Environment {
  private experience: Experience;
  private scene: THREE.Scene;
  private debug: Debug;
  private debugFolder: GUI;

  public sunLight: DirectionalLight;
  public helper: DirectionalLightHelper;
  public spotlight: THREE.SpotLight;
  public spotlightHelper: SpotLightHelper;

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

  public setSunLight() {
    this.sunLight = new DirectionalLight("#ffffff", 8);
    this.sunLight.position.set(1.1, 25, 37);
    this.sunLight.name = "light";

    this.spotlight = new SpotLight(0xffff00);
    this.spotlight.position.set(0, 3, 2);

    this.spotlight.castShadow = true;
    this.spotlight.angle = 0.2;
    this.spotlight.penumbra = 0.2;
    this.spotlight.decay = 2;
    this.spotlight.distance = 10;
    this.spotlight.intensity = 2;
    this.scene.add(this.spotlight);

    this.scene.add(this.sunLight);

    if (this.debug.active) {
      this.spotlightHelper = new SpotLightHelper(this.spotlight);
      this.scene.add(this.spotlightHelper);
      this.debugFolder.add(this.sunLight, "intensity").name("sunLightIntensity").min(0).max(50).step(0.001);
      this.debugFolder.add(this.sunLight.position, "x").name("sunLightX").min(-50).max(50).step(0.001);
      this.debugFolder.add(this.sunLight.position, "y").name("sunLightY").min(-50).max(50).step(0.001);
      this.debugFolder.add(this.sunLight.position, "z").name("sunLightZ").min(-50).max(50).step(0.001);

      this.debugFolder.add(this.spotlight, "intensity").name("spotlightIntensity").min(0).max(50).step(0.001);
      this.debugFolder.add(this.spotlight.position, "x").name("spotlightX").min(-50).max(50).step(0.001);
      this.debugFolder.add(this.spotlight.position, "y").name("spotlightY").min(-50).max(50).step(0.001);
      this.debugFolder.add(this.spotlight.position, "z").name("spotlightZ").min(-50).max(50).step(0.001);
    }
  }
}
