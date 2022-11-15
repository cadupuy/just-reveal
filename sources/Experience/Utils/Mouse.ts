import Experience from "@experience/Experience.js";

import Sizes from "@utils/Sizes";
import Parallax from "@utils/Parallax";

export default class Mouse {
  public instance: { x: number; y: number };

  private experience: Experience;
  private sizes: Sizes;
  private parallax: Parallax;

  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.parallax = this.experience.parallax;

    this.setInstance();

    window.addEventListener("mousemove", (e) => {
      // Normalized mouse position
      this.instance.x = (e.clientX / this.sizes.width) * 2 - 1;
      this.instance.y = -(e.clientY / this.sizes.height) * 2 + 1;

      this.parallax.update(e);
    });
  }

  private setInstance() {
    this.instance = { x: 0, y: 0 };
  }
}
