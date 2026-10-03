export function PetModel() {
  return (
    <mesh
      position={[0, 1, 0]}
      castShadow
    >
      <boxGeometry args={[2, 2, 2]} />

      <meshStandardMaterial
        color="red"
        emissive="red"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
}