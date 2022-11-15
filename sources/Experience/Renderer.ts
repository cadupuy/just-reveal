import {
  WebGLRenderer,
  Mesh,
  sRGBEncoding,
  CineonToneMapping,
  NoToneMapping,
  LinearToneMapping,
  ReinhardToneMapping,
  ACESFilmicToneMapping,
  Vector2,
} from "three";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

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
  private effectComposer: EffectComposer;
  private renderPass: RenderPass;

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
    this.setPostprocessing();
  }

  private setInstance() {
    this.instance = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });

    this.instance.physicallyCorrectLights = true;
    this.instance.outputEncoding = sRGBEncoding;
    this.instance.toneMapping = CineonToneMapping;
    this.instance.toneMappingExposure = 0.25;
    this.instance.setClearColor("#555555", 1);
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

  private setPostprocessing() {
    this.effectComposer = new EffectComposer(this.instance);
    this.effectComposer.setSize(this.sizes.width, this.sizes.height);
    this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.renderPass = new RenderPass(this.scene, this.camera.instance);
    this.effectComposer.addPass(this.renderPass);

    const bloomParams = {
      strength: 0,
      radius: 0.4,
      threshold: 0.85,
    };

    const bloomPass = new UnrealBloomPass(
      new Vector2(this.sizes.width, this.sizes.height),
      bloomParams.strength,
      bloomParams.radius,
      bloomParams.threshold
    );
    this.effectComposer.addPass(bloomPass);

    if (this.debug.active) {
      this.debugFolder
        .add(bloomParams, "strength", 0.0, 3.0)
        .onChange((value: string) => {
          bloomPass.strength = Number(value);
        })
        .name("Bloom Strength");
    }
  }

  public resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));

    // Update effect composer
    this.effectComposer.setSize(this.sizes.width, this.sizes.height);
    this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  public update() {
    // this.instance.render(this.scene, this.camera.instance);
    this.effectComposer.render();
  }
}
