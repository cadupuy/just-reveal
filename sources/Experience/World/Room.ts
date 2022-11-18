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
  public resources: any;
  public resource2020: any;
  public resource2021: any;
  public resource2022: any;
  public model: any;
  public items: THREE.Mesh[];
  public camera: Camera;
  public parallax: Parallax;
  public video: Video;
  public videoTexture: THREE.VideoTexture;
  public screen: THREE.Mesh | null;
  public cube: Cube;
  public audio: Sound;
  public level: number;
  public arrow: HTMLDivElement;
  public overlay: HTMLDivElement;
  public overlays: NodeListOf<HTMLDivElement>;

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
    this.video = new Video();
    this.audio = this.experience.audio;
    this.cube = cube;
    this.screen;
    this.level = level;
    this.overlays = document.querySelectorAll(".overlay__images") as NodeListOf<HTMLDivElement>;

    this.arrow = document.querySelector(".back") as HTMLDivElement;
    this.overlay = document.querySelector(".overlay") as HTMLDivElement;

    this.setRoom();
  }

  private setRoom() {
    if (this.experience.level === 1) {
      this.model = this.resource2020.scene;
    } else if (this.experience.level === 2) {
      this.model = this.resource2021.scene;
    } else if (this.experience.level === 3) {
      this.model = this.resource2022.scene;
    }

    console.log(this.model);

    this.model.traverse((child: THREE.Mesh) => {
      if (child.name === "ecran_video") {
        this.screen = child;
        child.material = this.video.movieMaterial;
        this.items.push(child);
      }

      if (child.name === "lampe") {
        this.items.push(child);
      }

      if (child.name === "Mug") {
        this.items.push(child);
      }

      if (child.name === "nintendo") {
        this.items.push(child);
      }

      if (child.name === "playbutton") {
        this.items.push(child);
      }

      if (child.name === "globe") {
        child.material = new MeshNormalMaterial();
        this.experience.items.push(child);
      }

      if (child.name === "medecine") {
        this.experience.items.push(child);
      }

      if (child.name === "passion") {
        -this.experience.items.push(child);
      }

      if (child.name === "speaker") {
        this.items.push(child);
      }
    });

    this.model.scale.set(3, 3, 3);
    this.model.position.set(0, 0, 0);
    this.scene.add(this.model);
  }

  public handleClick(el: THREE.Object3D) {
    // this.experience.parallax.params.active = false;

    this.overlays.forEach((el) => {
      el.style.display = "none";
    });

    if (el.name.includes("globe")) this.handleGlobe();
    if (el.name.includes("ecran_video")) this.handleScreen();
    if (el.name.includes("lampe")) this.handleLampe();
    if (el.name.includes("speaker")) this.handleAudio();
    if (el.name === "nintendo") this.handleNintendo();
    if (el.name === "medecine") this.handleMedecine();
    if (el.name === "passion") this.handlePassion();
    if (el.name === "Mug") this.handleMug();
  }

  private handleMug() {
    document.querySelector<HTMLDivElement>(`[data-name="cafe"]`)!.style.display = "block";
    this.anim("nintendo");

    this.parallax.params.active = false;
    this.experience.selectedItem = true;
    this.arrow.classList.add("in");
    this.overlay.classList.add("in");

    gsap.to(this.cube.mesh.position, {
      x: -1.27,
      y: 2.3,
      z: 0.83,
      duration: 1.25,
      ease: "power4.easeIn",
      onComplete: () => {
        // this.parallax.params.intensity = 0.0001;
        // this.parallax.params.active = true;
      },
    });

    gsap.to(this.camera.instance.position, {
      duration: 1.25,
      x: -1.06,
      y: 4.1,
      z: 1.15,
      ease: "power4.easeIn",
    });
  }

  private handleMedecine() {
    document.querySelector<HTMLDivElement>(`[data-name="medecine"]`)!.style.display = "block";
    this.anim("nintendo");

    this.parallax.params.active = false;
    this.experience.selectedItem = true;
    this.arrow.classList.add("in");
    this.overlay.classList.add("in");

    gsap.to(this.cube.mesh.position, {
      x: -0.37,
      y: -7.35,
      z: -4.4,
      duration: 2,
      ease: "power4.easeIn",
      onComplete: () => {
        // this.parallax.params.intensity = 0.0001;
        // this.parallax.params.active = true;
      },
    });

    gsap.to(this.camera.instance.position, {
      duration: 1.5,
      x: 1.3,
      y: 4.1,
      z: 1,
      ease: "power4.easeIn",
    });
  }

  private handleScreen() {
    this.parallax.params.active = false;
    this.experience.selectedItem = true;
    this.arrow.classList.add("in");

    this.video.videoElem.play();

    if (this.experience.isSoundActive) {
      this.audio.pause();
      this.experience.isSoundActive = false;
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

  private handlePassion() {
    document.querySelector<HTMLDivElement>(`[data-name="passion"]`)!.style.display = "block";
    this.anim("nintendo");

    this.parallax.params.active = false;
    this.experience.selectedItem = true;
    this.arrow.classList.add("in");
    this.overlay.classList.add("in");

    gsap.to(this.cube.mesh.position, {
      x: 12.9,
      y: -17.69,
      z: -13.26,
      duration: 2,
      ease: "power4.easeIn",
      onComplete: () => {
        // this.parallax.params.intensity = 0.0001;
        // this.parallax.params.active = true;
      },
    });

    gsap.to(this.camera.instance.position, {
      duration: 1.5,
      x: 1.2,
      y: 3.69,
      z: 2.1,
      ease: "power4.easeIn",
    });
  }

  private handleNintendo() {
    document.querySelector<HTMLDivElement>(`[data-name="nintendo"]`)!.style.display = "block";
    this.anim("nintendo");

    this.parallax.params.active = false;
    this.experience.selectedItem = true;
    this.arrow.classList.add("in");
    this.overlay.classList.add("in");

    gsap.to(this.cube.mesh.position, {
      x: -0.37,
      y: -7.35,
      z: -4.4,
      duration: 2,
      ease: "power4.easeIn",
      onComplete: () => {
        // this.parallax.params.intensity = 0.0001;
        // this.parallax.params.active = true;
      },
    });

    gsap.to(this.camera.instance.position, {
      duration: 1.5,
      x: -0.73,
      y: 4.2,
      z: 0.74,
      ease: "power4.easeIn",
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
    this.video.videoElem.pause();
    this.experience.switchLevel();
    setTimeout(() => {
      this.video.videoElem.currentTime = 0;
    }, 500);
  }

  private handleGlobe() {
    this.anim("nintendo");

    this.overlay.classList.add("in");

    this.parallax.params.active = false;
    this.experience.selectedItem = true;
    this.arrow.classList.add("in");

    // el.rotation.z = 4;

    gsap.to(this.cube.mesh.position, {
      x: -1.47,
      y: 2.96,
      z: 0.01,
      duration: 2,
      ease: "power4.easeIn",
      onComplete: () => {
        // this.parallax.params.intensity = 0.001;
        // this.parallax.params.active = true;
      },
    });

    gsap.to(this.camera.instance.position, {
      duration: 1.5,
      x: -2.95,
      y: 3.15,
      z: 1.48,
      ease: "power4.easeIn",
    });
  }

  private anim(name: string) {
    // let elem = document.querySelector<HTMLDivElement>(`[data-name="${name}"]`)!;

    console.log(name);

    gsap.fromTo(
      ".overlay__img1",
      {
        rotation: -10,
      },
      {
        rotation: 1,
        duration: 0.9,
        delay: 0.65,
        ease: "back.out(2)",
      }
    );

    gsap.fromTo(
      ".overlay__img2",
      {
        rotation: -15,
      },
      {
        rotation: 0,
        duration: 0.95,
        delay: 0.85,
        ease: "back.out(2)",
      }
    );
  }
}
