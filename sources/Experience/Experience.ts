import { Scene } from "three";

import Camera from "@experience/Camera";
import Renderer from "@experience/Renderer";
import Loader from "@experience/Loader";
import { chapter_1, chapter_2, chapter_3 } from "@experience/sources";
import Raycast from "@experience/Raycaster";

import Debug from "@utils/Debug";
import Sizes from "@utils/Sizes";
import Stats from "@utils/Stats";
import Time from "@utils/Time";
import Resources from "@utils/Resources";
import Mouse from "@utils/Mouse";
import Parallax from "@utils/Parallax";

import World from "@world/World";
import Sound from "./Sound";

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
  selectedItem: boolean;
  level: number;
  isLoading: boolean;
  audio: Sound;
  isSoundActive: boolean;

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
    this.level = 1;
    this.isLoading = true;
    this.selectedItem = false;
    this.isSoundActive = true;

    // Setup
    this.setDebug();
    this.setStats();
    this.setAudio();
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

  private setAudio() {
    this.audio = new Sound("/assets/music/ambiance.mp3");
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
    if (!this.isLoading) this.raycast.update();
    this.world.update();
    this.renderer.update();
  }

  public async switchLevel() {
    console.log("switch level");
    this.level++;

    this.destroy();

    if (this.level === 1) {
      this.loader.animEnter();
      this.resources = new Resources(chapter_1);
      this.loader.animExit();
    }

    if (this.level === 2) {
      this.loader.animEnter();

      this.resources = new Resources(chapter_2);
      this.loader.animExit();
    }
    if (this.level === 3) {
      this.loader.animEnter();
      this.resources = new Resources(chapter_3);
      this.loader.animExit();
    }

    // if (this.level === 4) {
    //   gsap.to(this.loader.overlayMaterial.uniforms.uAlpha, { duration: 3, value: 1, delay: 1 });
    //   this.destroy();
    //   this.level = 1;
    // }
  }

  public destroy() {
    for (let i = this.scene.children.length - 1; i >= 0; i--) {
      let child = this.scene.children[i];
      if (child.name !== "loader") {
        this.scene.remove(child);
      }
    }
  }
}
