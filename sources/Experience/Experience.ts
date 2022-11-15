import { Scene, Mesh } from "three";

import Camera from "@experience/Camera";
import Renderer from "@experience/Renderer";
import Loader from "@experience/Loader";
import { chapter_1 } from "@experience/sources";
import Raycast from "@experience/Raycaster";

import Debug from "@utils/Debug";
import Sizes from "@utils/Sizes";
import Stats from "@utils/Stats";
import Time from "@utils/Time";
import Resources from "@utils/Resources";
import Mouse from "@utils/Mouse";
import Parallax from "@utils/Parallax";

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
  raycast: Raycast;
  parallax: Parallax;
  items: THREE.Mesh[];
  selectedItem: THREE.Mesh | null;

  constructor(_canvas?: HTMLCanvasElement) {
    // Singleton

    if (Experience.instance) {
      return Experience.instance;
    }

    Experience.instance = this;

    window.experience = this;

    // Options
    this.canvas = _canvas;
    this.items = [];
    this.selectedItem = null;

    // Setup
    this.setDebug();
    this.setStats();
    this.setSizes();
    this.setTime();
    this.setParallax();
    this.setMouse();
    this.setScene();
    this.setResources();
    this.setCamera();
    this.setRaycaster();
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

  private setLoader() {
    this.loader = new Loader();
  }

  private setParallax() {
    this.parallax = new Parallax();
  }

  private setMouse() {
    this.mouse = new Mouse();
  }

  private setDebug() {
    this.debug = new Debug();
  }

  private setRaycaster() {
    this.raycast = new Raycast();
  }

  private setStats() {
    this.stats = new Stats();
  }

  private setSizes() {
    this.sizes = new Sizes();
  }

  private setTime() {
    this.time = new Time();
  }

  private setScene() {
    this.scene = new Scene();
    // this.scene.fog = new Fog(0x030229, 50, 101);
  }

  private setResources() {
    this.resources = new Resources(chapter_1);
  }

  private setCamera() {
    this.camera = new Camera();
  }

  private setRenderer() {
    this.renderer = new Renderer();
  }

  private setWorld() {
    this.world = new World();
  }

  private resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  private update() {
    if (this.stats.active) this.stats.update();
    this.camera.update();
    this.raycast.update();
    this.world.update();
    this.renderer.update();
  }

  public destroy() {
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

    this.renderer.instance.dispose();

    if (this.debug.active) this.debug.ui.destroy();
  }
}
