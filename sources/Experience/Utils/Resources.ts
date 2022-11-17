import * as THREE from "three";
import gsap from "gsap";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import EventEmitter from "@utils/EventEmitter";

export default class Resources extends EventEmitter {
  sources: any;
  items: any;
  toLoad: number;
  loaded: number;
  progressBar: HTMLDivElement;
  progressFill: HTMLDivElement;
  button: HTMLButtonElement;
  loaders: any;
  progressRatio: number;

  constructor(sources: any) {
    super();

    this.sources = sources;
    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;
    this.progressBar = document.querySelector(".loader__progressBar") as HTMLDivElement;
    this.progressFill = document.querySelector(".loader__progressFill") as HTMLDivElement;
    this.button = document.querySelector(".loader__button") as HTMLButtonElement;

    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {};
    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.textureLoader = new THREE.TextureLoader();
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
  }

  startLoading() {
    // Load each source
    for (const source of this.sources) {
      if (source.type === "gltfModel") {
        this.loaders.gltfLoader.load(source.path, (file: any) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "texture") {
        this.loaders.textureLoader.load(source.path, (file: any) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "cubeTexture") {
        this.loaders.cubeTextureLoader.load(source.path, (file: any) => {
          this.sourceLoaded(source, file);
        });
      }
    }
  }

  sourceLoaded(source: any, file: any) {
    this.items[source.name] = file;

    this.loaded++;

    this.progressRatio = (this.loaded / this.toLoad) * 100;

    this.progressFill.style.width = `${this.progressRatio}%`;

    if (this.loaded === this.toLoad) {
      this.trigger("ready");

      gsap.to(this.progressBar, {
        opacity: 0,
        duration: 1,
        delay: 1,
      });

      gsap.to(this.button, {
        opacity: 1,
        duration: 1,
        delay: 1.5,
      });
    }
  }
}
