import * as THREE from "three";

import Experience from "@experience/Experience";
import GUI from "lil-gui";
import Debug from "@experience/Utils/Debug";

export default class Cube {
  private experience: Experience;
  private scene: THREE.Scene;
  geometry: THREE.BoxGeometry;
  material: THREE.MeshBasicMaterial;
  mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;
  private debug: Debug;
  private debugFolder: GUI;

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("cube");
    }

    this.setCube();
  }

  setCube() {
    this.geometry = new THREE.BoxGeometry(1, 1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({ color: "red" });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
    this.mesh.position.set(0, 3.5, 0);

    if (this.debug.active) {
      //position
      this.debugFolder.add(this.mesh.position, "x").name("posx").min(0).max(15).step(0.01);
      this.debugFolder.add(this.mesh.position, "y").name("posy").min(0).max(15).step(0.01);
      this.debugFolder.add(this.mesh.position, "z").name("posz").min(0).max(15).step(0.01);
    }
  }
}
