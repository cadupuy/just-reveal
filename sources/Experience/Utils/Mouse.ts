import GUI from "lil-gui";

import Experience from "@experience/Experience.js";

import Sizes from "@utils/Sizes";
import Debug from "@utils/Debug";

export default class Mouse {
  public instance: { x: number; y: number };
  public readonly params: { intensity: number; ease: number };

  private experience: Experience;
  private sizes: Sizes;
  private readonly debug: Debug;
  private readonly debugFolder: GUI;

  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.debug = this.experience.debug;

    this.params = {
      intensity: 0.008,
      ease: 0.08,
    };

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("mouse");
    }

    this.setInstance();

    window.addEventListener("mousemove", (e) => {
      this.instance.x = (e.clientX - this.sizes.width / 2) * this.params.intensity;
      this.instance.y = (e.clientY - this.sizes.height / 2) * this.params.intensity;

      const bottomLimit = -2.5;
      const topLimit = 0.5;
      if (this.instance.y < bottomLimit) this.instance.y = bottomLimit;
      if (this.instance.y > topLimit) this.instance.y = topLimit;
    });
  }

  private setInstance() {
    this.instance = { x: 0, y: 0 };

    if (this.debug.active) {
      this.debugFolder.add(this.params, "intensity").max(0.1).min(0.001).step(0.001);
    }
  }
}
