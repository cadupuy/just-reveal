import {
  WebGLRenderer,
  Mesh,
  sRGBEncoding,
  NoToneMapping,
  CineonToneMapping,
  LinearToneMapping,
  ReinhardToneMapping,
  ACESFilmicToneMapping,
} from "three";

import GUI from "lil-gui";

import Experience from "@experience/Experience";
import Camera from "@experience/Camera";

import Sizes from "@utils/Sizes";
import Debug from "@utils/Debug";

export default class Renderer {
  private experience: Experience;
  private canvas: HTMLCanvasElement | undefined;
  private sizes: Sizes;
  private scene: THREE.Scene;
  private camera: Camera;
  private debug: Debug;
  private debugFolder: GUI;

  public instance: WebGLRenderer;

  constructor() {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.debug = this.experience.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("renderer");
    }

    this.setInstance();
  }

  private setInstance() {
    this.instance = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });

    this.instance.physicallyCorrectLights = true;
    this.instance.outputEncoding = sRGBEncoding;
    this.instance.toneMapping = NoToneMapping;
    this.instance.toneMappingExposure = 1;
    this.instance.setClearColor("#FFFFFF", 1);
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));

    // Debug
    if (this.debug.active) {
      console.log(this.instance.info);

      this.debugFolder
        .add(this.instance, "toneMapping", {
          NoToneMapping: NoToneMapping,
          LinearToneMapping: LinearToneMapping,
          ReinhardToneMapping: ReinhardToneMapping,
          CineonToneMapping: CineonToneMapping,
          ACESFilmicToneMapping: ACESFilmicToneMapping,
        })
        .onChange(() => {
          this.scene.traverse((_child) => {
            if (_child instanceof Mesh) _child.material.needsUpdate = true;
          });
        });

      this.debugFolder.add(this.instance, "toneMappingExposure").min(0).max(10);
    }
  }

  public resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
  }

  public update() {
    this.instance.render(this.scene, this.camera.instance);
  }
}
