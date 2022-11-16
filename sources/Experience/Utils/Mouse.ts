import Experience from "@experience/Experience.js";

import Sizes from "@utils/Sizes";
import Parallax from "@utils/Parallax";

export default class Mouse {
  public instance: { x: number; y: number };
  public mouseDown: boolean;
  private experience: Experience;
  private sizes: Sizes;
  private parallax: Parallax;
  public cursor: HTMLElement;

  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.parallax = this.experience.parallax;
    this.mouseDown = false;

    this.cursor = document.querySelector("#cursorWrapper") as HTMLElement;

    this.setInstance();

    window.addEventListener("mousemove", (e) => {
      // if (this.mouseDown) {
      //   return;
      // }
      // Normalized mouse position

      this.cursor.style.transform = `translateX(calc(${e.clientX}px - 50%)) translateY(calc(${e.clientY}px - 50%))`;

      // m', 'translate3d(calc(' + mX + 'px - 50%), ' + 'calc(' + mY + 'px - 50%),

      this.instance.x = (e.clientX / this.sizes.width) * 2 - 1;
      this.instance.y = -(e.clientY / this.sizes.height) * 2 + 1;

      this.parallax.update(e);
    });

    // window.addEventListener(
    //   "mousedown",
    //   (e) => {
    //     e.preventDefault();
    //     this.instance.x = e.clientX;
    //     this.instance.y = e.clientY;

    //     this.mouseDown = true;
    //   },

    //   false
    // );
    // window.addEventListener(
    //   "mouseup",
    //   () => {
    //     this.mouseDown = false;
    //   },

    //   false
    // );
  }

  private setInstance() {
    this.instance = { x: 0, y: 0 };
  }
}
