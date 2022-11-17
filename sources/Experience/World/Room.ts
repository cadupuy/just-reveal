import * as THREE from "three";
import gsap from "gsap";

import Experience from "@experience/Experience";
import Camera from "@experience/Camera";
import Parallax from "@experience/Utils/Parallax";

import Video from "@world/Video";
import Cube from "@world/Cube";
import Sound from "@experience/Sound";
import { MeshNormalMaterial } from "three";

export default class Room {
  private experience: Experience;
  private scene: THREE.Scene;

  public geometry: THREE.BoxGeometry;
  public material: THREE.MeshNormalMaterial;
  public mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshNormalMaterial>;
  resources: any;
  resource2020: any;
  resource2021: any;
  resource2022: any;
  model: any;
  items: THREE.Mesh[];
  camera: Camera;
  bodyElem: HTMLElement;
  parallax: Parallax;
  video: Video;
  videoTexture: THREE.VideoTexture;
  screen: THREE.Mesh | null;
  cube: Cube;
  audio: Sound;
  level: number;

  constructor(cube: Cube, level: number = 1) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;
    this.resources = this.experience.resources;
    this.resource2020 = this.resources.items.desk2020;
    this.resource2021 = this.resources.items.desk2021;
    this.resource2022 = this.resources.items.desk2022;
    this.items = this.experience.items;
    this.parallax = this.experience.parallax;
    this.bodyElem = document.querySelector("html,body") as HTMLElement;
    this.video = new Video();
    this.audio = this.experience.audio;
    this.cube = cube;
    this.screen;
    this.level = level;

    this.setRoom();
  }

  private setRoom() {
    console.log(this.level);

    if (this.experience.level === 1) {
      this.model = this.resource2020.scene;
    } else if (this.experience.level === 2) {
      this.model = this.resource2021.scene;
    } else if (this.experience.level === 3) {
      this.model = this.resource2022.scene;
    }

    console.log(this.model);

    this.model.traverse((child: THREE.Mesh) => {
      if (child.name == "ecran_video") {
        this.screen = child;
        child.material = this.video.movieMaterial;
      }

      if (child.name === "clavier") {
        this.items.push(child);
      }

      if (child.name == "lampe") {
        this.items.push(child);
      }

      if (child.name == "globe") {
        child.material = new MeshNormalMaterial();
        this.experience.items.push(child);
      }

      if (child.name == "speaker") {
        this.items.push(child);
      }
    });

    this.model.scale.set(3, 3, 3);
    this.model.position.set(0, 0, 0);
    this.scene.add(this.model);
  }

  public handleClick(el: THREE.Mesh) {
    // this.experience.parallax.params.active = false;

    if (el.name.includes("globe")) this.handleGlobe();
    if (el.name.includes("clavier")) this.handleScreen();
    if (el.name.includes("lampe")) this.handleLampe();
    if (el.name.includes("speaker")) this.handleAudio();
  }

  private handleScreen() {
    this.parallax.params.active = false;
    this.experience.selectedItem = true;

    this.video.videoElem.play();

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

    // el.rotation.z = 4;

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
