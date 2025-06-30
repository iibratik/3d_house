// lib/initKTX2Loader.ts
import * as THREE from 'three';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';

let ktx2Loader: KTX2Loader | null = null;

export function getKTX2Loader(renderer: THREE.WebGLRenderer): KTX2Loader {
  if (!ktx2Loader) {
    ktx2Loader = new KTX2Loader()
      .setTranscoderPath('/basis/') // папка с basis_transcoder.js и .wasm
      .detectSupport(renderer);
  }
  return ktx2Loader;
}
