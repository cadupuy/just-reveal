import * as THREE from "three";
import gsap from "gsap";

import Experience from "@experience/Experience";
import Loader from "@experience/Loader";

import Time from "@utils/Time";

import Sky from "@world/Sky";

export default class World {
  experience: Experience;
  scene: THREE.Scene;
  time: Time;
  button: HTMLButtonElement;
  loader: Loader;
  loaderDiv: HTMLDivElement;
  cursor: number;
  buffer: number;
  geometry: THREE.BoxGeometry;
  material: THREE.MeshNormalMaterial;
  sky: Sky;
  mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshNormalMaterial>;

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.loader = this.experience.loader;
    this.loaderDiv = document.querySelector(".loader") as HTMLDivElement;
    this.button = document.querySelector(".start") as HTMLButtonElement;

    this.button.addEventListener("click", () => {
      this.setCube();
      this.setSky();

      gsap.to(this.loaderDiv, {
        opacity: 0,
        duration: 0.5,
        delay: 0.5,
      });
      this.loaderDiv.classList.add("disabled");
      gsap.to(this.loader.overlayMaterial.uniforms.uAlpha, { duration: 3, value: 0, delay: 1 });
    });
  }

  setCube() {
    this.geometry = new THREE.BoxGeometry(10, 10, 10, 10);
    this.material = new THREE.MeshNormalMaterial();

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.scene.add(this.mesh);
  }

  setSky() {
    this.sky = new Sky();
  }

  update() {
    // if (this.mesh) this.mesh.update();
  }
}
