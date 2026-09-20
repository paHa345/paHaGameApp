import * as THREE from "three";

const registry = new Map<string, THREE.Object3D>();

export const meshRegistry = {
  register(id: string, object: THREE.Object3D) {
    registry.set(id, object);
  },

  unregister(id: string) {
    registry.delete(id);
  },

  get(id: string): THREE.Object3D | undefined {
    return registry.get(id);
  },

  has(id: string): boolean {
    return registry.has(id);
  },

  clear() {
    registry.clear();
  },
};
