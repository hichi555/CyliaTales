import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line, OrbitControls, Sparkles, Text } from "@react-three/drei";
import { useMemo, useRef, useState } from "react";
import type { Group } from "three";
import { Color } from "three";

type GraphNode = {
  id: string;
  label: string;
  meta: string;
  color: string;
  position: [number, number, number];
};

const NODES: GraphNode[] = [
  { id: "origin", label: "The seed arrives", meta: "Origin", color: "#d8ff62", position: [-2.6, 0.55, 0.2] },
  { id: "map", label: "A map under the floor", meta: "Beat", color: "#f4c37d", position: [-0.8, 1.55, -0.45] },
  { id: "choice", label: "Sound or light?", meta: "Choice", color: "#8bd8cd", position: [1.1, 0.2, 0.15] },
  { id: "turn", label: "The island remembers", meta: "Turn", color: "#f58b70", position: [2.55, 1.25, -0.35] },
  { id: "promise", label: "A promise with a pulse", meta: "Beat", color: "#cab6ff", position: [1.9, -1.35, 0.45] },
  { id: "ending", label: "Keep the light", meta: "Ending", color: "#ffffff", position: [-0.2, -1.6, -0.2] },
];

const EDGES: [string, string][] = [
  ["origin", "map"],
  ["map", "choice"],
  ["choice", "turn"],
  ["choice", "promise"],
  ["promise", "ending"],
  ["turn", "ending"],
];

function AnimatedNode({ node, active, onSelect }: { node: GraphNode; active: boolean; onSelect: () => void }) {
  const group = useRef<Group>(null);
  const target = useMemo(() => new Color(node.color), [node.color]);
  useFrame(({ clock }) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(clock.elapsedTime * 0.4 + node.position[0]) * 0.08;
    group.current.scale.setScalar(active ? 1.12 : 1);
  });
  return (
    <Float speed={1.1} rotationIntensity={0.13} floatIntensity={0.2} floatingRange={[-0.08, 0.08]}>
      <group ref={group} position={node.position} onClick={(event) => { event.stopPropagation(); onSelect(); }}>
        <mesh>
          <sphereGeometry args={[active ? 0.34 : 0.26, 32, 32]} />
          <meshStandardMaterial color={target} emissive={target} emissiveIntensity={active ? 0.55 : 0.22} roughness={0.24} metalness={0.3} />
        </mesh>
        <mesh scale={active ? 1.75 : 1.42}>
          <sphereGeometry args={[0.27, 24, 24]} />
          <meshBasicMaterial color={target} transparent opacity={active ? 0.1 : 0.04} depthWrite={false} />
        </mesh>
        <Text position={[0, -0.62, 0]} fontSize={0.14} color="#f7f5ed" anchorX="center" anchorY="middle" maxWidth={1.55} textAlign="center">
          {node.label}
        </Text>
        <Text position={[0, -0.87, 0]} fontSize={0.085} color={node.color} anchorX="center" anchorY="middle" letterSpacing={0.08}>
          {node.meta.toUpperCase()}
        </Text>
      </group>
    </Float>
  );
}

function GraphScene({ activeId, onSelect }: { activeId: string; onSelect: (id: string) => void }) {
  const nodeMap = new Map(NODES.map((node) => [node.id, node]));
  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[0, 2, 4]} intensity={16} distance={10} color="#d8ffb1" />
      <pointLight position={[-4, -2, 2]} intensity={8} distance={8} color="#8bd8cd" />
      <Sparkles count={80} scale={[7, 5, 4]} size={1.5} speed={0.28} color="#d8ff62" />
      {EDGES.map(([from, to]) => {
        const a = nodeMap.get(from)!;
        const b = nodeMap.get(to)!;
        const highlighted = activeId === from || activeId === to;
        return <Line key={`${from}-${to}`} points={[a.position, b.position]} color={highlighted ? "#d8ff62" : "#7fa39b"} transparent opacity={highlighted ? 0.9 : 0.36} lineWidth={highlighted ? 1.8 : 1} />;
      })}
      {NODES.map((node) => <AnimatedNode key={node.id} node={node} active={node.id === activeId} onSelect={() => onSelect(node.id)} />)}
      <OrbitControls enablePan={false} minDistance={5.2} maxDistance={9} autoRotate autoRotateSpeed={0.35} enableDamping dampingFactor={0.08} />
    </>
  );
}

export function CyliagenStoryGraph() {
  const [activeId, setActiveId] = useState("origin");
  const active: GraphNode = NODES.find((node) => node.id === activeId) ?? NODES[0]!;
  return (
    <div className="cyliagen-graph-shell" aria-label="Interactive 3D story graph">
      <div className="cyliagen-graph-canvas">
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 7], fov: 42 }} gl={{ antialias: true, alpha: true }}>
          <GraphScene activeId={active.id} onSelect={setActiveId} />
        </Canvas>
      </div>
      <div className="cyliagen-graph-overlay">
        <span className="cyliagen-graph-kicker">Live story graph</span>
        <strong>{active.label}</strong>
        <span>Drag to orbit · click a node to inspect the beat</span>
      </div>
    </div>
  );
}
