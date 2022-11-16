import * as THREE from "three";

import Experience from "@experience/Experience";
import GUI from "lil-gui";
import Debug from "@experience/Utils/Debug";

import gsap from "gsap";
export default class Cube {
  private experience: Experience;
  private scene: THREE.Scene;
  geometry: THREE.BoxGeometry;
  material: THREE.MeshBasicMaterial;
  mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>;
  private debug: Debug;
  private debugFolder: GUI;
  params: { x: number; y: number; z: number };

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;
    this.params = {
      x: -0.15,
      y: 2.5,
      z: 0,
    };

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("cube");
    }

    this.setCube();
  }

  initialPosition() {
    gsap.to(this.mesh.position, {
      x: this.params.x,
      y: this.params.y,
      z: this.params.z,
      duration: 2,
      ease: "expo.easeOut",
    });
  }

  setCube() {
    this.geometry = new THREE.BoxGeometry(1, 1, 1, 1);

    if (this.debug.active) {
      this.material = new THREE.MeshBasicMaterial({ color: "red", wireframe: true });
    } else {
      this.material = new THREE.MeshBasicMaterial({ visible: false });
    }

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
    this.mesh.position.x = this.params.x;
    this.mesh.position.y = 3.5;
    this.mesh.position.z = this.params.z;

    if (this.debug.active) {
      //position
      this.debugFolder.add(this.mesh.position, "x").name("posx").min(-15).max(15).step(0.01);
      this.debugFolder.add(this.mesh.position, "y").name("posy").min(-15).max(15).step(0.01);
      this.debugFolder.add(this.mesh.position, "z").name("posz").min(-15).max(15).step(0.01);
    }
  }
}
