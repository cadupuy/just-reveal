import * as THREE from "three";
import gsap from "gsap";

import Experience from "@experience/Experience";
import Camera from "@experience/Camera";
import Parallax from "@experience/Utils/Parallax";

import Video from "@world/Video";

export default class Room {
  private experience: Experience;
  private scene: THREE.Scene;

  public geometry: THREE.BoxGeometry;
  public material: THREE.MeshNormalMaterial;
  public mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshNormalMaterial>;
  resources: any;
  resource: any;
  model: any;
  items: THREE.Mesh[];
  camera: Camera;
  bodyElem: HTMLElement;
  parallax: Parallax;
  uv: any;
  video: Video;
  videoTexture: THREE.VideoTexture;
  screen: THREE.Mesh | null;

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.resources = this.experience.resources;
    this.resource = this.resources.items.desk2;
    this.uv = this.resources.items.texture;
    this.items = this.experience.items;
    this.parallax = this.experience.parallax;
    this.bodyElem = document.querySelector("html,body") as HTMLElement;
    this.video = new Video();

    this.screen;

    this.setRoom();
  }

  private setRoom() {
    this.model = this.resource.scene;

    this.model.traverse((child: THREE.Mesh) => {
      if (child.name == "socle_globe") {
        this.items.push(child);
      }

      if (child.name == "ecran_video") {
        this.screen = child;
        child.material = this.video.movieMaterial;

        this.items.push(child);
      }

      if (child.name == "lampe") {
        this.items.push(child);
      }
    });

    this.model.scale.set(3, 3, 3);
    this.model.position.set(0, 0, 0);
    this.scene.add(this.model);
  }

  public handleClick(el: THREE.Mesh) {
    // this.experience.parallax.params.active = false;

    console.log(el.name);

    if (el.name.includes("socle_globe")) this.handleCube();
    if (el.name.includes("ecran_video")) this.handleScreen(el);
    if (el.name.includes("lampe")) this.handleMouse();
  }

  private handleScreen(el: THREE.Mesh) {
    this.camera.instance.lookAt(0, 7, 0);
    gsap.to(this.camera.instance.position, {
      duration: 2,
      z: el.position.z,
    });
  }

  private handleMouse() {
    this.experience.switchLevel();
  }

  private handleCube() {
    console.log("yes");

    this.parallax.params.active = false;
    this.experience.selectedItem = true;

    gsap.to(this.camera.instance.position, {
      z: 20,
      duration: 1,
      ease: "power3.easeOut",
      onComplete: () => {
        this.experience.isLoading = true;
        this.parallax.params.active = true;
      },
    });
  }
}
