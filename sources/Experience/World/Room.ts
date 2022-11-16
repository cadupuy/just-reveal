import * as THREE from "three";
import gsap from "gsap";

import Experience from "@experience/Experience";
import Camera from "@experience/Camera";
import Parallax from "@experience/Utils/Parallax";

import Video from "@world/Video";
import Cube from "@world/Cube";

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

  cube: Cube;

  constructor(cube: Cube) {
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
    this.audio = this.experience.audio;
    this.cube = cube;
    this.screen;

    this.setRoom();
  }

  private setRoom() {
    this.model = this.resource.scene;

    console.log(this.model);

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

      if (child.name == "cactus") {
        this.items.push(child);
      }
    });

    this.model.scale.set(3, 3, 3);
    this.model.position.set(0, 0, 0);
    this.scene.add(this.model);
  }

  public handleClick(el: THREE.Mesh) {
    // this.experience.parallax.params.active = false;

    if (el.name.includes("Globe") || el.name.includes("socle_globe")) this.handleGlobe(el);
    if (el.name.includes("ecran_video")) this.handleScreen(el);
    if (el.name.includes("lampe")) this.handleLampe(el);
    if (el.name.includes("cactus")) this.handleAudio();
  }

  private handleScreen() {
    this.parallax.params.active = false;
    this.experience.selectedItem = true;

    if (this.experience.isSoundActive) {
      this.audio.pause();
    }

    gsap.to(this.cube.mesh.position, {
      x: -0.15,
      y: 3.5,
      z: -0.6,
      duration: 0.8,
      ease: "power4.easeIn",
    });

    gsap.to(this.camera.instance.position, {
      duration: 1,
      x: this.cube.mesh.position.x,
      y: this.cube.mesh.position.y + 1,
      z: this.cube.mesh.position.z + 3,
      ease: "power4.easeIn",

      onComplete: () => {
        this.parallax.params.intensity = 0.001;
        this.parallax.params.active = true;
      },
    });
  }

  private handleAudio() {
    if (!this.experience.isSoundActive) {
      this.audio.play();
      this.experience.isSoundActive = true;
    } else {
      this.audio.pause();
      this.experience.isSoundActive = false;
    }
  }

  private handleLampe() {
    this.experience.switchLevel();
  }

  private handleGlobe() {
    this.parallax.params.active = false;
    this.experience.selectedItem = true;

    gsap.to(this.cube.mesh.position, {
      x: -2.17,
      y: 3,
      z: -0.33,
      duration: 2,
      ease: "power4.easeIn",
      onComplete: () => {
        // this.parallax.params.intensity = 0.001;
        // this.parallax.params.active = true;
      },
    });

    gsap.to(this.camera.instance.position, {
      duration: 1.5,
      x: this.cube.mesh.position.x,
      y: this.cube.mesh.position.y + 1,
      z: this.cube.mesh.position.z + 1,
      ease: "power4.easeIn",
    });
  }
}
