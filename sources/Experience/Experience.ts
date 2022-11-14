import { Scene, Mesh, Fog } from "three";

import Camera from "@experience/Camera";
import Renderer from "@experience/Renderer";
import Loader from "@experience/Loader";
import sources from "@experience/sources";

import Debug from "@utils/Debug";
import Sizes from "@utils/Sizes";
import Stats from "@utils/Stats";
import Time from "@utils/Time";
import Resources from "@utils/Resources";
import Mouse from "@utils/Mouse";

import World from "@world/World";

export default class Experience {
  private static instance: Experience;
  canvas: HTMLCanvasElement | undefined;
  toto: number;
  loader: Loader;
  scene: Scene;
  camera: Camera;
  debug: Debug;
  sizes: Sizes;
  renderer: Renderer;
  time: Time;
  stats: Stats;
  world: World;
  resources: Resources;
  mouse: Mouse;

  constructor(_canvas?: HTMLCanvasElement) {
    // Singleton

    if (Experience.instance) {
      return Experience.instance;
    }

    Experience.instance = this;

    window.experience = this;

    // Options
    this.canvas = _canvas;

    // Setup
    this.setDebug();
    this.setStats();
    this.setSizes();
    this.setTime();
    this.setMouse();
    this.setScene();
    this.setResources();
    this.setCamera();
    this.setRenderer();
    this.setLoader();
    this.setWorld();

    // Resize event
    this.sizes.on("resize", () => {
      this.resize();
    });

    // Time tick event
    this.time.on("tick", () => {
      this.update();
    });
  }

  setLoader() {
    this.loader = new Loader();
  }

  setMouse() {
    this.mouse = new Mouse();
  }

  setDebug() {
    this.debug = new Debug();
  }

  setStats() {
    this.stats = new Stats();
  }

  setSizes() {
    this.sizes = new Sizes();
  }

  setTime() {
    this.time = new Time();
  }

  setScene() {
    this.scene = new Scene();
    this.scene.fog = new Fog(0x030229, 50, 101);
  }

  setResources() {
    this.resources = new Resources(sources);
  }

  setCamera() {
    this.camera = new Camera();
  }

  setRenderer() {
    this.renderer = new Renderer();
  }

  setWorld() {
    this.world = new World();
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    if (this.stats.active) this.stats.update();

    this.camera.update();
    this.world.update();
    this.renderer.update();
  }

  destroy() {
    this.sizes.off("resize");
    this.time.off("tick");

    // Traverse the whole scene
    this.scene.traverse((child) => {
      // Test if it's a mesh
      if (child instanceof Mesh) {
        child.geometry.dispose();

        // Loop through the material properties
        for (const key in child.material) {
          const value = child.material[key];

          // Test if there is a dispose function
          if (value && typeof value.dispose === "function") {
            value.dispose();
          }
        }
      }
    });

    this.camera.controls.dispose();
    this.renderer.instance.dispose();

    if (this.debug.active) this.debug.ui.destroy();
  }
}
