/**
 * 3D 背景场景 - Canvas + ParticleField
 * dpr 与 gl 优化以降低性能消耗
 */

"use client";

import * as React from "react";
import { Canvas } from "@react-three/fiber";
import { ParticleField } from "./ParticleField";

export default function Background3DScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      camera={{ position: [0, 0, 5], fov: 60 }}
    >
      <ParticleField />
    </Canvas>
  );
}
