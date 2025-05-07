import { OrbitControls, Sparkles, Text } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { type Mesh } from "three";
import { useRef, useState, memo } from "react";

const MemoizedSparkles = memo(() => (
  <Sparkles
    speed={0.1}
    color={"orange"}
    size={6}
    scale={2}
    count={20}
    noise={0.2}
  />
));

type rotatingCubeProps = {
  isRotating: boolean;
};

//Componente que renderiza un cubo que gira y se detiene cuando el mouse está sobre él
const RotatingCube = ({ isRotating }: rotatingCubeProps) => {
  const meshRef = useRef<Mesh>(null); //Referencia al cubo
  const defaultRotationSpeed = 0.01; //Velocidad de rotación por defecto
  const acceleration = 0.00005; //Aceleración de la rotación
  const [rotationSpeed, setRotationSpeed] =
    useState<number>(defaultRotationSpeed); //Velocidad de rotación actual

  // useFrame es un hook que se ejecuta en cada frame de la animación
  useFrame(() => {
    if (meshRef.current) {
      const { rotation } = meshRef.current; //Obtiene la rotación actual del cubo
      rotation.x += rotationSpeed; //Añade la velocidad de rotación a la rotación actual
      rotation.y += rotationSpeed; //Añade la velocidad de rotación a la rotación actual
      if (!isRotating && rotationSpeed > 0) {
        setRotationSpeed((prev) => Math.max(0, prev - acceleration)); //Reduce la velocidad de rotación si el cubo no está girando y la velocidad es mayor que 0
      } else if (isRotating && rotationSpeed < defaultRotationSpeed) {
        setRotationSpeed((prev) =>
          Math.min(defaultRotationSpeed, prev + acceleration)
        ); //Aumenta la velocidad de rotación si el cubo está girando y la velocidad es menor que la velocidad por defecto
      }
    }
  });
  return (
    <>
      {/* Si el cubo no está girando, muestra el texto "Stopping" o "Stopped" dependiendo de la velocidad de rotación */}
      {!isRotating && (
        <Text
          position={[0, 0, 2]}
          color={"#000000"}
          fontSize={0.4}
          anchorX={"center"}
          anchorY={"middle"}
        >
          {rotationSpeed > 0 ? "Stopping" : "Stopped"}
        </Text>
      )}
      <mesh ref={meshRef}>
        {/* Cubo */}
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        {/* Material del cubo */}
        <meshLambertMaterial color={"#468585"} emissive={"#468585"} />
        {/* Efecto de estrellas */}
        <MemoizedSparkles />
      </mesh>
    </>
  );
};

const App = () => {
  const [isRotating, setIsRotating] = useState(true);
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setIsRotating(!isRotating)}
        style={{
          position: "absolute",
          top: "40px",
          left: "40px",
          zIndex: "100",
        }}
      >
        {isRotating ? "stop rotation" : "start rotation"}
      </button>
      <Canvas
        style={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <OrbitControls enableZoom={true} enablePan enableRotate />
        <directionalLight
          position={[1, 1, 1]}
          intensity={10}
          color={0x9cdba6}
        />
        <color attach={"background"} args={["#F0F0F0"]} />
        <RotatingCube isRotating={isRotating} />
      </Canvas>
    </div>
  );
};

export default App;
