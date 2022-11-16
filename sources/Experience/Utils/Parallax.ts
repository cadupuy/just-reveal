import GUI from "lil-gui";

import Experience from "@experience/Experience.js";

import Sizes from "@utils/Sizes";
import Debug from "@utils/Debug";

export default class Parallax {
  public instance: { x: number; y: number };
  public readonly params: { active: boolean; intensity: number; ease: number };

  private experience: Experience;
  private sizes: Sizes;
  private debug: Debug;
  private debugFolder: GUI;

  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.debug = this.experience.debug;

    this.params = {
      active: false,
      intensity: 0.004,
      ease: 0.019,
    };

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("parallax");
    }

    this.setInstance();
  }

  private setInstance() {
    this.instance = { x: 0, y: 0 };

    if (this.debug.active) {
      this.debugFolder.add(this.params, "intensity").max(0.1).min(0.001).step(0.001);
      this.debugFolder.add(this.params, "ease").max(0.1).min(0.001).step(0.001);
      this.debugFolder.add(this.params, "active");
    }
  }

  public update(e: MouseEvent) {
    if (this.params.active) {
      this.instance.x = (e.clientX - this.sizes.width / 2) * this.params.intensity;
      // this.instance.y = (e.clientY - this.sizes.height / 2) * this.params.intensity;
      // const bottomLimit = 2.5;
      // const topLimit = 10;
      // if (this.instance.y < bottomLimit) this.instance.y = bottomLimit;
      // if (this.instance.y > topLimit) this.instance.y = topLimit;
    }
  }
}
