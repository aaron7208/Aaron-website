/**
 * 粒子场 - 80 点 BufferGeometry，绕 Y 轴缓慢旋转
 * 用于首页背景
 */

"use client";

import * as React from "react";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 80;
const RADIUS = 4;

export function ParticleField() {
  const meshRef = useRef<THREE.Points>(null);
  const positions = React.useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * RADIUS * 2;
      pos[i * 3 + 1] = (Math.random() - 0.5) * RADIUS * 2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * RADIUS;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#3b82f6"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}
