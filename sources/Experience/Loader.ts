import { PlaneGeometry, ShaderMaterial, Mesh } from "three";

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
    this.overlayGeometry = new PlaneGeometry(10, 10, 1, 1);
    this.overlayMaterial = new ShaderMaterial({
      transparent: true,
      uniforms: {
        uAlpha: { value: 1 },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    });
    this.overlay = new Mesh(this.overlayGeometry, this.overlayMaterial);
    this.scene.add(this.overlay);
  }
}
