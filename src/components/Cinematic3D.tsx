"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Sparkles, MeshDistortMaterial, MeshWobbleMaterial } from "@react-three/drei";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";

// Module-level mouse state — safe for dynamic import
const mouse = { current: [0, 0] as [number, number] };

/* ── Mouse-reactive camera rig ── */
function CameraRig() {
  useFrame((state) => {
    state.camera.position.x += (mouse.current[0] * 1.5 - state.camera.position.x) * 0.04;
    state.camera.position.y += (mouse.current[1] * 0.8 - state.camera.position.y) * 0.04;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ── Central hero orb ── */
function HeroOrb() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = clock.getElapsedTime() * 0.15;
    }
  });
  return (
    <mesh ref={ref} position={[0, 0, 0]} scale={2.2}>
      <icosahedronGeometry args={[1, 4]} />
      <MeshDistortMaterial
        color="#007fd4"
        distort={0.35}
        speed={2.5}
        roughness={0.05}
        metalness={1}
        envMapIntensity={3}
        emissive="#003a6e"
        emissiveIntensity={0.4}
      />
    </mesh>
  );
}

/* ── Orbiting ring ── */
function OrbitRing({ radius, speed, tilt, color }: { radius: number; speed: number; tilt: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = clock.getElapsedTime() * speed;
    }
  });
  return (
    <mesh ref={ref} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.012, 2, 200]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} />
    </mesh>
  );
}

/* ── Floating accent pieces ── */
function FloatingPiece({ position, speed }: { position: [number, number, number]; speed: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * speed;
      ref.current.rotation.x = t * 0.7;
      ref.current.rotation.y = t;
      ref.current.position.y = position[1] + Math.sin(t * 0.5) * 0.3;
    }
  });
  return (
    <mesh ref={ref} position={position} scale={0.25}>
      <octahedronGeometry args={[1]} />
      <MeshWobbleMaterial
        color="#9c27b0"
        factor={0.4}
        speed={2}
        roughness={0.1}
        metalness={0.9}
        emissive="#4a0080"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

/* ── Particle field ── */
function ParticleField() {
  const count = 600;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, []);

  const geo = useRef<THREE.BufferGeometry>(null);
  useFrame(({ clock }) => {
    if (geo.current) {
      const pos = geo.current.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 1] += Math.sin(clock.getElapsedTime() * 0.3 + i) * 0.001;
      }
      geo.current.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points>
      <bufferGeometry ref={geo}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#007fd4" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

/* ── Scene wrapper ── */
function Scene() {
  return (
    <>
      <CameraRig />

      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={6} color="#007fd4" distance={10} />
      <pointLight position={[5, 5, 3]} intensity={3} color="#ffffff" />
      <pointLight position={[-5, -3, -3]} intensity={2} color="#9c27b0" />
      <pointLight position={[0, -5, 2]} intensity={1.5} color="#003a6e" />

      {/* Core 3D objects */}
      <HeroOrb />
      <OrbitRing radius={3.2} speed={0.4} tilt={Math.PI / 5} color="#007fd4" />
      <OrbitRing radius={4.0} speed={-0.25} tilt={Math.PI / 3} color="#9c27b0" />
      <OrbitRing radius={2.5} speed={0.6} tilt={Math.PI / 1.5} color="#007fd4" />

      <FloatingPiece position={[3.5, 1.5, -1]} speed={0.6} />
      <FloatingPiece position={[-3, 2, -2]} speed={0.4} />
      <FloatingPiece position={[2, -2.5, -1]} speed={0.8} />
      <FloatingPiece position={[-2.5, -1.5, 0.5]} speed={0.5} />

      {/* Atmosphere */}
      <ParticleField />
      <Stars radius={60} depth={50} count={2000} factor={3} saturation={0} fade speed={0.5} />
      <Sparkles count={80} scale={10} size={1.5} speed={0.3} opacity={0.4} color="#007fd4" />
    </>
  );
}

export default function Cinematic3D() {
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouse.current = [
        (e.clientX / window.innerWidth - 0.5) * 2,
        -(e.clientY / window.innerHeight - 0.5) * 2,
      ];
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 50 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      dpr={[1, 1.5]}
    >
      <Scene />
    </Canvas>
  );
}
