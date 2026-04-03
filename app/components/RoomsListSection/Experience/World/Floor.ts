import { Scene } from "three";
import Experience from "../Experience";
import Resources from "../Utils/Resources";
import * as THREE from "three";

export default class Floor {
  experience: Experience;
  scene: Scene | undefined;
  resources: Resources | undefined;
  geometry?: THREE.CircleGeometry;
  textures?: {
    color?: any;
    normal?: any;
  };
  material?: THREE.MeshStandardMaterial;
  mesh?: THREE.Mesh;
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.setGeometry();
    this.setTextures();
    this.setMaterial();
    this.setMesh();
  }
  setGeometry() {
    this.geometry = new THREE.CircleGeometry(5, 64);
  }
  setTextures() {
    this.textures = {};

    this.textures.color = this.resources?.items.grassColorTexture;
    this.textures.color.encoding = THREE.SRGBColorSpace;
    this.textures.color.repeat.set(1.5, 1.5);
    this.textures.color.wrapS = THREE.RepeatWrapping;
    this.textures.color.wrapT = THREE.RepeatWrapping;

    this.textures.normal = this.resources?.items.grassNormalTexture;
    this.textures.normal.repeat.set(1.5, 1.5);
    this.textures.normal.wrapS = THREE.RepeatWrapping;
    this.textures.normal.wrapT = THREE.RepeatWrapping;
  }
  setMaterial() {
    this.material = new THREE.MeshStandardMaterial({
      map: this.textures?.color,
      normalMap: this.textures?.normal,
    });
  }
  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotation.x = -Math.PI * 0.5;
    this.mesh.receiveShadow = true;
    this.scene?.add(this.mesh);
  }
}
