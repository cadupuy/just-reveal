import { PlaneGeometry, ShaderMaterial, Mesh } from "three";
import gsap from "gsap";
import Experience from "@experience/Experience";

import vertex from "@shaders/loader/vert.glsl";
import fragment from "@shaders/loader/frag.glsl";

export default class Loader {
  private experience: Experience;
  private scene: THREE.Scene;

  public overlayGeometry: PlaneGeometry;
  public overlayMaterial: ShaderMaterial;
  public overlay: Mesh<PlaneGeometry, ShaderMaterial>;

  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.init();
  }

  private init() {
    this.overlayGeometry = new PlaneGeometry(30, 30, 1, 1);
    this.overlayMaterial = new ShaderMaterial({
      transparent: true,
      uniforms: {
        uAlpha: { value: 1 },
        uColor: { value: 0 },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    });
    this.overlay = new Mesh(this.overlayGeometry, this.overlayMaterial);
    this.overlay.name = "loader";
    this.scene.add(this.overlay);
  }

  public animEnter() {
    gsap.to(this.overlayMaterial.uniforms.uAlpha, { duration: 1, value: 1, ease: "expo.easeOut" });
  }

  public animExit() {
    gsap.to(this.overlayMaterial.uniforms.uAlpha, { duration: 1, value: 0, delay: 1, ease: "expo.easeOut" });
  }
}
