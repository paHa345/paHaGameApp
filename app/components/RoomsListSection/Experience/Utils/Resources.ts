import sources from "../sources";
import { EventEmitter } from "./EventEmitter";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";

export default class Resources extends EventEmitter {
  sources: { name: string; type: string; path: string[] | string }[];
  items: any;
  toLoad: number;
  loaded: number;
  loaders?: {
    gltfLoader?: GLTFLoader;
    textureLoader?: THREE.TextureLoader;
    cubeTextureLoader?: THREE.CubeTextureLoader;
  };
  constructor(sources: { name: string; type: string; path: string[] | string }[]) {
    super();
    // Options

    this.sources = sources;

    // Setup

    this.items = {};
    this.toLoad = this.sources?.length;
    this.loaded = 0;

    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {};
    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.textureLoader = new THREE.TextureLoader();
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
  }
  startLoading() {
    for (const source of this.sources) {
      if (source.type === "gltfModel") {
        if (typeof source.path !== "string") return;
        this.loaders?.gltfLoader?.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "texture") {
        if (typeof source.path !== "string") return;

        this.loaders?.textureLoader?.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "cubeTexture") {
        if (!Array.isArray(source.path)) return;
        this.loaders?.cubeTextureLoader?.load(source.path, (file) => {
          this.sourceLoaded(source, file);
        });
      }
    }
  }
  sourceLoaded(source: any, file: any) {
    this.items[source.name] = file;
    this.loaded++;

    if (this.loaded === this.toLoad) {
      this.trigger("ready");
    }
  }
}
