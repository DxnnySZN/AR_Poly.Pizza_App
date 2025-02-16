import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroText,
  ViroTrackingReason,
  ViroTrackingStateConstants,
  ViroBox,
  ViroMaterials,
  ViroAnimations,
  Viro3DObject,
  ViroAmbientLight
} from "@reactvision/react-viro";
import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

// defines props for InitialScene
interface InitialSceneProps {
  sceneNavigator: {
    viroAppProps: {
      object: string;
    };
  };
}

const InitialScene = (props: InitialSceneProps): JSX.Element => {
  // the elements in each array correspond to the behavior of the object after one rotation, one movement, or one scaling
  const [rotation, setRotation] = useState<[number, number, number]>([0, -45, 0]);
  const [position, setPosition] = useState<[number, number, number]>([0, -0.5, -2]); 
  const [scale, setScale] = useState<[number, number, number]>([0.2, 0.2, 0.2]); 

  // "The Crib" is set to be the default object when the app launches
  const data = props.sceneNavigator.viroAppProps || { object: "The Crib" }; 

  // moves object when user drags the object
  const moveObject = (newPosition: [number, number, number]) => {
    setPosition(newPosition);
  };

  // rotates object when user does a rotation gesture
  const rotateObject = (rotateState: number, rotationFactor: number) => {
    if (rotateState === 3) {
      const sensitivity = 0.5; // reduces rotation sensitivity
      setRotation(([x, y, z]) => [x, y + rotationFactor * sensitivity, z]); // rotates only around Y-axis smoothly
    }
  };

  // scales object when user does pinching gesture
  const scaleObject = (pinchState: number, scaleFactor: number) => {
    if (pinchState === 3) {
      // ensures the object will not scale beyond the limits of 0.05 and 0.5 regardless of the pinch gesture's intensity
      const newScale = Math.max(0.05, Math.min(0.5, scale[0] * scaleFactor)); 
      
      setScale([newScale, newScale, newScale]);
    }
  };  
  
  return (
    <ViroARScene>
      {/* this ambient light illuminates 3D objects */}
      <ViroAmbientLight color="#FFFFFF" />

      {/* conditionally renders either "The Crib" or "Nonchalant Tree" */}
      {data.object === "The Crib" ? (
        <Viro3DObject
          source = {require("./assets/The_Crib.glb")}
          position = {position}
          scale = {scale}
          rotation = {rotation}
          type = "GLB"
          onDrag = {moveObject}
          onRotate = {rotateObject}
          onPinch = {scaleObject}
        />
      ) : (
        <Viro3DObject
          source = {require("./assets/Nonchalant_Tree.glb")}
          position = {position}
          scale = {scale}
          rotation = {rotation}
          type = "GLB"
          onDrag = {moveObject}
          onRotate = {rotateObject}
          onPinch = {scaleObject}
        />
      )}
    </ViroARScene>
  );
};

const App: React.FC = () => {
  const [object, setObject] = useState("The Crib");

  return (
    <View style={styles.mainView}>
      {/* updates the displayed 3D object based on user selection */}
      <ViroARSceneNavigator
        initialScene = {{ scene: InitialScene }} 
        viroAppProps = {{ object }}
        style = {{ flex: 1 }}
      />

      {/* UI controls to switch between 3D objects */}
      <View style = {styles.controlsView}>
        <TouchableOpacity onPress = {() => setObject("The Crib")}>
          <Text style = {styles.text}>Display The Crib</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress = {() => setObject("Nonchalant Tree")}>
          <Text style = {styles.text}>Display Nonchalant Tree</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  mainView: {
    flex: 1
  },
  controlsView: {
    width: "100%",
    height: 100,
    backgroundColor: "#FFFFFF",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  text: {
    margin: 20,
    backgroundColor: "#9d9d9d",
    padding: 10,
    fontWeight: "bold"
  }
});