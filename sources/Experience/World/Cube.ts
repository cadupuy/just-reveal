import * as THREE from "three";

import Experience from "@experience/Experience";

export default class Cube {
  private experience: Experience;
  private scene: THREE.Scene;
  geometry: THREE.BoxGeometry;
  material: THREE.MeshNormalMaterial;
  mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshNormalMaterial>;

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.setCube();
  }

  setCube() {
    this.geometry = new THREE.BoxGeometry(10, 10, 10, 10);
    this.material = new THREE.MeshNormalMaterial();
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
    this.mesh.position.y = -5;
  }
}
