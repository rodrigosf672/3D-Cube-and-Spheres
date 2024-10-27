// Author: Rodrigo Silva Ferreira
// Last Modified: 27OCT2024
// Project: 3D Cube with Moving Spheres using React Three Fiber

// Import necessary modules, including React components
import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { TrackballControls, Line, Text } from '@react-three/drei';
import * as THREE from 'three';

// Define cube dimensions and starting point for rending in 3D
const gridSize = 3;
const cubeSize = 1;
const cubeMin = -((gridSize - 1) * cubeSize) / 2;

// CubeGrid renders the 3x3x3 3D grid with bolder edges for the outer frame to enhance visibility
const CubeGrid = () => {
  // Creates unique key for each edge to identify the connections between vertices
  const getEdgeKey = (gridV1, gridV2) => {
    const sortedVertices = [gridV1, gridV2].sort((a, b) => {
      for (let i = 0; i < 3; i++) {
        if (a[i] !== b[i]) return a[i] - b[i];
      }
      return 0;
    });
    return `${sortedVertices[0].join(',')}-${sortedVertices[1].join(',')}`;
  };
  // Translate grid vertices to world space coordinates
  const getWorldPosition = (gridX, gridY, gridZ) => [
    gridX * cubeSize + cubeMin,
    gridY * cubeSize + cubeMin,
    gridZ * cubeSize + cubeMin,
  ];

  // Display outer edges in bold
  const boldEdges = useMemo(() => {
    const min = 0;
    const max = gridSize;
    const corners = [
      [min, min, min],
      [min, min, max],
      [min, max, min],
      [min, max, max],
      [max, min, min],
      [max, min, max],
      [max, max, min],
      [max, max, max],
    ];

    const boldEdgesGrid = [
      [corners[0], corners[1]],
      [corners[2], corners[3]],
      [corners[4], corners[5]],
      [corners[6], corners[7]],
      [corners[1], corners[5]],
      [corners[5], corners[7]],
      [corners[7], corners[3]],
      [corners[3], corners[1]],
      [corners[0], corners[4]],
      [corners[4], corners[6]],
      [corners[6], corners[2]],
      [corners[2], corners[0]],
    ];

    return boldEdgesGrid.map(([gridV1, gridV2]) => {
      const v1 = getWorldPosition(...gridV1);
      const v2 = getWorldPosition(...gridV2);
      return { v1, v2 };
    });
  }, []);

  const getGridPosition = (worldPos) => {
    return worldPos.map((coord) => Math.round((coord - cubeMin) / cubeSize));
  };

  // Determine if an edge is an outer edge
  const isOuterEdge = (gridV1, gridV2) => {
    const min = 0;
    const max = gridSize;
    const isV1OnSurface = gridV1.some((coord) => coord === min || coord === max);
    const isV2OnSurface = gridV2.some((coord) => coord === min || coord === max);
    return isV1OnSurface && isV2OnSurface;
  };

  // Map each edge and categorize it as an inner or outer edge
  const edgeMap = useMemo(() => {
    const map = new Map();
  
    for (let x = 0; x <= gridSize; x++) {
      for (let y = 0; y <= gridSize; y++) {
        for (let z = 0; z <= gridSize; z++) {
          if (x < gridSize) {
            const gridV1 = [x, y, z];
            const gridV2 = [x + 1, y, z];
            const v1 = getWorldPosition(...gridV1);
            const v2 = getWorldPosition(...gridV2);
            const key = getEdgeKey(gridV1, gridV2);
            map.set(key, { v1, v2, gridV1, gridV2 });
          }
          if (y < gridSize) {
            const gridV1 = [x, y, z];
            const gridV2 = [x, y + 1, z];
            const v1 = getWorldPosition(...gridV1);
            const v2 = getWorldPosition(...gridV2);
            const key = getEdgeKey(gridV1, gridV2);
            map.set(key, { v1, v2, gridV1, gridV2 });
          }
          if (z < gridSize) {
            const gridV1 = [x, y, z];
            const gridV2 = [x, y, z + 1];
            const v1 = getWorldPosition(...gridV1);
            const v2 = getWorldPosition(...gridV2);
            const key = getEdgeKey(gridV1, gridV2);
            map.set(key, { v1, v2, gridV1, gridV2 });
          }
        }
      }
    }
    return map;
  }, []);

  // Innver vs. Outer Edges segregation
  const { outerEdges, innerEdges } = useMemo(() => {
    const boldEdgeKeys = new Set();
    boldEdges.forEach(({ v1, v2 }) => {
      const gridV1 = getGridPosition(v1);
      const gridV2 = getGridPosition(v2);
      const key = getEdgeKey(gridV1, gridV2);
      boldEdgeKeys.add(key);
    });

    const outerEdges = [];
    const innerEdges = [];

    for (const [key, edge] of edgeMap.entries()) {
      if (boldEdgeKeys.has(key)) {
        continue;
      }
      const { v1, v2, gridV1, gridV2 } = edge;
      const edgePoints = [v1, v2];

      if (isOuterEdge(gridV1, gridV2)) {
        outerEdges.push(edgePoints);
      } else {
        innerEdges.push(edgePoints);
      }
    }

    return { outerEdges, innerEdges };
  }, [edgeMap, boldEdges]);

  // Create cylinder function to mimick/generate the bolder edges
  const createCylinder = (start, end, radius, color) => {
    const material = new THREE.MeshBasicMaterial({ color });
    const direction = new THREE.Vector3()
      .subVectors(new THREE.Vector3(...end), new THREE.Vector3(...start));
    const length = direction.length();
    const midpoint = new THREE.Vector3()
      .addVectors(new THREE.Vector3(...start), direction.clone().multiplyScalar(0.5));

    const cylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(radius, radius, length, 16),
      material
    );

    cylinder.position.copy(midpoint);

    cylinder.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.normalize()
    );

    return cylinder;
  };

  // Render bolder lines for the 12 outer edges that connect to outer vertices, solid lines for the remaining 16 outer edges, and dashed lines for inner edges.
  return (
    <group>
      {boldEdges.map((edge, index) => {
        const cylinder = createCylinder(edge.v1, edge.v2, 0.01, 'black');
        return <primitive key={`bold-${index}`} object={cylinder} />;
      })}
      {outerEdges.map((edge, index) => (
        <Line
          key={`outer-${index}`}
          points={edge}
          color="black"
          lineWidth={1}
        />
      ))}
      {innerEdges.map((edge, index) => (
        <Line
          key={`inner-${index}`}
          points={edge}
          color="black"
          lineWidth={1}
          dashed
          dashSize={0.1}
          gapSize={0.1}
        />
      ))}
    </group>
  );
};

// Place a sphere labeled 'O' at the origin
const OriginPoint = () => {
  return (
    <group>
      <mesh position={[cubeMin, cubeMin, -cubeMin + 1]}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshBasicMaterial color="black" />
      </mesh>
      <Text
        position={[cubeMin - 0.3, cubeMin, -cubeMin + 1]}
        color="black"
        fontSize={0.2}
        anchorX="right"
        anchorY="center"
      >
        O
      </Text>
    </group>
  );
};

// Label the x, y, and z axes in the 3D cube environment
const AxisLabels = () => {
  const labelOffsetX = 0.5;
  const labelOffsetY = 0.5;
  const labelOffsetZ = 0.5;

  return (
    <group>
      <Text position={[cubeMin + gridSize * cubeSize + labelOffsetX, cubeMin, -cubeMin + 1]} color="black" fontSize={0.3} anchorX="center" anchorY="center"> x </Text>
      <Text position={[cubeMin, cubeMin + gridSize * cubeSize + labelOffsetY, -cubeMin + 1]} color="black" fontSize={0.3} anchorX="center" anchorY="center"> y </Text>
      <Text position={[cubeMin, cubeMin, -cubeMin + 1 - gridSize * cubeSize - labelOffsetZ]} color="black" fontSize={0.3} anchorX="center" anchorY="center"> z </Text>
    </group>
  );
};

// Display all spheres added by the user, with special handling for overlaps
const Spheres = ({ spheres, onClick, selectedIndex, showLabels }) => {
  const groupedSpheres = useMemo(() => { // Group overlapping spheres at the same position
    const map = new Map();
    spheres.forEach((sphere, index) => {
      const key = JSON.stringify(sphere.gridPosition);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push({ ...sphere, index });
    });
    return Array.from(map.values());
  }, [spheres]);

  // Render each sphere with appropriate colors and labels
  return (
    <group>
      {groupedSpheres.map((group, groupIndex) => {
        const { position } = group[0];
        const isOverlapping = group.length > 1;
        const color = isOverlapping ? "purple" : group[0].index === selectedIndex ? "red" : "blue";
        const labels = group.map((sphere) => sphere.label).join(", ");

        return (
          <group key={groupIndex}>
            <mesh
              position={position}
              onClick={(e) => {
                e.stopPropagation();
                if (isOverlapping) {
                  const lowestIndexSphere = group.reduce((prev, curr) => (prev.index < curr.index ? prev : curr));
                  onClick(lowestIndexSphere.index);
                } else {
                  onClick(group[0].index);
                }
              }}
            >
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshBasicMaterial color={color} />
            </mesh>
            {showLabels && (
              <Text
                position={[position[0] + (isOverlapping ? 0.25 : 0.15), position[1], position[2]]}
                color={isOverlapping ? "purple" : color}
                fontSize={0.2}
                anchorX="left"
                anchorY="center"
              >
                {isOverlapping ? ` ${labels}` : group[0].label}
              </Text>
            )}
          </group>
        );
      })}
    </group>
  );
};

// Main component is responslbe for managering state and rendering the 3D environement and user interactions
const App = () => {
  const [spheres, setSpheres] = useState([]);
  const [inputX, setInputX] = useState('');
  const [inputY, setInputY] = useState('');
  const [inputZ, setInputZ] = useState('');
  const [selectedSphere, setSelectedSphere] = useState(null);
  const [showLabels, setShowLabels] = useState(true);
  const controlsRef = useRef();

  // Calculate sphere position in the 3D space, adjusting from user's input
  const getSpherePosition = (x, y, z) => [
    x * cubeSize + cubeMin + cubeSize / 2,
    y * cubeSize + cubeMin + cubeSize / 2,
    -((z * cubeSize) + cubeMin + cubeSize / 2 - 1)
  ];

  const isValidInput = () => {
    const x = parseInt(inputX);
    const y = parseInt(inputY);
    const z = parseInt(inputZ);
    return !isNaN(x) && x >= 0 && x <= 2 && !isNaN(y) && y >= 0 && y <= 2 && !isNaN(z) && z >= 0 && z <= 2;
  };

  const handleAddSphere = (e) => {
    e.stopPropagation();
    const x = parseInt(inputX);
    const y = parseInt(inputY);
    const z = parseInt(inputZ);

    if (isNaN(x) || isNaN(y) || isNaN(z) || x < 0 || x > 2 || y < 0 || y > 2 || z < 0 || z > 2) {
      alert('Please enter valid integer values between 0 and 2 for x, y, and z.');
      return;
    }

    const position = getSpherePosition(x, y, z);
    const label = `C${String(spheres.length + 1).padStart(2, '0')}`;
    setSpheres([...spheres, { position, label, gridPosition: [x, y, z] }]);
    setInputX('');
    setInputY('');
    setInputZ('');
  };

// Handle different types of user interactions

  const handleClickOutsideSphere = (e) => {
    if (["addSphere", "toggleLabels", "resetCube"].includes(e.target.id)) {
      e.stopPropagation();
    } else {
      setSelectedSphere(null);
    }
  };

  const handleKeyDown = (e) => {
    if (selectedSphere === null) return;

    const directionMap = {
      w: [0, 1, 0],
      s: [0, -1, 0],
      a: [-1, 0, 0],
      d: [1, 0, 0],
      q: [0, 0, -1],
      e: [0, 0, 1]
    };

    const direction = directionMap[e.key];
    if (!direction) return;

    setSpheres((prevSpheres) => {
      const newSpheres = [...prevSpheres];
      const currentPosition = newSpheres[selectedSphere].gridPosition;
      const newGridPosition = currentPosition.map((coord, index) => coord + direction[index]);

      if (newGridPosition.some((coord) => coord < 0 || coord > 2)) return newSpheres;

      const position = getSpherePosition(...newGridPosition);
      newSpheres[selectedSphere] = {
        ...newSpheres[selectedSphere],
        gridPosition: newGridPosition,
        position
      };
      return newSpheres;
    });
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSphere]);

  return (
    <div
      onClick={handleClickOutsideSphere}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f0f0'
      }}
    >
      <div
        style={{
          width: '50vw',
          height: '90vh',
          border: '2px solid #000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px',
          backgroundColor: '#ffffff'
        }}
      >
        {/* Existing Canvas and Control Code */}
        <Canvas onClick={(e) => e.stopPropagation()} style={{ width: '100%', height: '100%' }}>
          <ambientLight intensity={0.5} />
          <group position={[0, -0.5, 0]}>
            <CubeGrid />
            <OriginPoint />
            <Spheres 
              spheres={spheres} 
              onClick={(index) => setSelectedSphere(index)} 
              selectedIndex={selectedSphere} 
              showLabels={showLabels} 
            />
            <AxisLabels />
          </group>
          <TrackballControls ref={controlsRef} makeDefault rotateSpeed={5.0} />
        </Canvas>

        {/* Existing Controls and Input Forms */}

        <div style={{ padding: '10px', width: '100%', textAlign: 'center' }}>
          <form
            style={{
              display: 'flex',
              gap: '15px',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              marginBottom: '20px'
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();  // Prevent form submission if input is not valid. Notice that pressing enter ley with invalid input will not trigger alert.
                if (isValidInput()) {
                  handleAddSphere(e);  // Call the function directly if input is valid
                }
              }
            }}
          >
            {['x', 'y', 'z'].map((axis, index) => (
              <label
                key={axis}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {axis} (0-2):
                <input
                  type="number"
                  value={index === 0 ? inputX : index === 1 ? inputY : inputZ}
                  onChange={(e) => (index === 0 ? setInputX : index === 1 ? setInputY : setInputZ)(e.target.value)}
                  min="0" max="2" required
                  style={{
                    padding: '10px',
                    width: '60px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                    textAlign: 'center'
                  }}
                />
              </label>
            ))}
          </form>

          {/* Control Buttons: New Sphere, Delete Spheres, Toggle Labels, and Reset Cube Position */}
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '10px' }}>
            <div title = "Add a new sphere to the 3D cube.">
              <button
                onClick={handleAddSphere}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'white',
                  color: 'black',
                  border: '1px solid black',
                  borderRadius: '5px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  cursor: 'pointer',
                  width: '150px',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f2f2f2'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                Add Sphere
              </button>
            </div>
            <div title = "Remove all spheres from the 3D cube.">
              <button
                onClick={() => setSpheres([])}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'white',
                  color: 'black',
                  border: '1px solid black',
                  borderRadius: '5px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  cursor: 'pointer',
                  width: '150px',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f2f2f2'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                Remove Spheres
              </button>
            </div>
            <div title = "Toggle the visibility of spheres' labels.">
              <button
                onClick={() => setShowLabels(!showLabels)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'white',
                  color: 'black',
                  border: '1px solid black',
                  borderRadius: '5px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  cursor: 'pointer',
                  width: '150px',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f2f2f2'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                Toggle Labels
              </button>
            </div>
            <div title = "Reset the 3D cube to its original position.">
              <button
                onClick={() => controlsRef.current.reset()}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'white',
                  color: 'black',
                  border: '1px solid black',
                  borderRadius: '5px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  cursor: 'pointer',
                  width: '150px',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f2f2f2'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                Reset Cube
              </button>
            </div>
          </div>          
          {/* Buttons for README Instructions, My GitHub Profile, My LinkedIn, and Feedback via email. */}
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '20px' }}>
            <div title = "Visit the README file for this project for instructions.">
              <button
                onClick={() => window.open('https://github.com/rodrigosf672/<my-repo-name-TBA>/blob/main/README.md', '_blank')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'white',
                  color: 'black',
                  border: '1px solid black',
                  borderRadius: '5px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  cursor: 'pointer',
                  width: '150px',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f2f2f2'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                Instructions ⚠️
              </button>
            </div>
            <div title = "Visit my GitHub profile to see more projects.">
              <button
                onClick={() => window.open('https://github.com/rodrigosf672', '_blank')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'white',
                  color: 'black',
                  border: '1px solid black',
                  borderRadius: '5px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  cursor: 'pointer',
                  width: '150px',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f2f2f2'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                My GitHub 💻
              </button>
            </div>
            <div title = "Connect with me on LinkedIn!">
              <button
                onClick={() => window.open('https://linkedin.com/in/rsf309/', '_blank')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'white',
                  color: 'black',
                  border: '1px solid black',
                  borderRadius: '5px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  cursor: 'pointer',
                  width: '150px',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f2f2f2'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                Let's connect! 🤝
              </button>
            </div>
            <div title = "Give me some feedback via email!">
              <button
                onClick={() => window.location.href = 'mailto:rodrigosf672@gmail.com'}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'white',
                  color: 'black',
                  border: '1px solid black',
                  borderRadius: '5px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  cursor: 'pointer',
                  width: '150px',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f2f2f2'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                Feedback 💬
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;