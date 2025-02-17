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
      rotation: [number, number, number]; // adds rotation to props
    };
  };
}

const InitialScene = (props: InitialSceneProps): JSX.Element => {
  // starts at [0, -0.5, -2]; updates when user drags object
  const [position, setPosition] = useState<[number, number, number]>([0, -0.5, -2]);  

  // starts at 20% of its original size; updates when user pinches object
  const [scale, setScale] = useState<[number, number, number]>([0.2, 0.2, 0.2]);  

  // "The Crib" is set to be the default object when the app launches
  const data = props.sceneNavigator.viroAppProps || { object: "The Crib", rotation: [0, -45, 0] };

  // moves object when user does dragging gesture
  const moveObject = (newPosition: [number, number, number]) => {
    setPosition(newPosition);
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
      {/* without this ambient light, the objects will not show */}
      <ViroAmbientLight color="#FFFFFF" />

      {/* conditionally renders either "The Crib" or "Nonchalant Tree" */}
      {data.object === "The Crib" ? (
        <Viro3DObject
          source = {require("./assets/The_Crib.glb")}
          position = {position}
          scale = {scale}
          rotation = {data.rotation} // uses the rotation from props
          type = "GLB"
          onDrag = {moveObject}
          onPinch = {scaleObject}
        />
      ) : (
        <Viro3DObject
          source = {require("./assets/Nonchalant_Tree.glb")}
          position = {position}
          scale = {scale}
          rotation = {data.rotation} // uses the rotation from props
          type = "GLB"
          onDrag = {moveObject}
          onPinch = {scaleObject}
        />
      )}
    </ViroARScene>
  );
};

const App: React.FC = () => {
  const [object, setObject] = useState("The Crib");
  const [rotation, setRotation] = useState<[number, number, number]>([0, -45, 0]);

  // rotates object when user clicks the left or right arrow buttons
  const rotateObject = (direction: "left" | "right") => {
    const rotationAmount = 15; // degrees to rotate per click
    if (direction === "left") {
      setRotation(([x, y, z]) => [x, y - rotationAmount, z]); 
    } else {
      setRotation(([x, y, z]) => [x, y + rotationAmount, z]); 
    }
  };

  return (
    <View style = {styles.mainView}>
      {/* updates the displayed object based on user selection */}
      <ViroARSceneNavigator
        initialScene = {{ scene: InitialScene }} 
        viroAppProps = {{ object, rotation }} // passes rotation to InitialScene
        style = {{ flex: 1 }}
      />

      {/* UI controls to switch between objects */}
      <View style = {styles.controlsView}>
        <TouchableOpacity onPress = {() => setObject("The Crib")}>
          <Text style = {styles.text}>Display The Crib</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress = {() => setObject("Nonchalant Tree")}>
          <Text style = {styles.text}>Display Nonchalant Tree</Text>
        </TouchableOpacity>
      </View>

      {/* UI controls for rotating the selected object */}
      <View style = {styles.rotationControls}>
        <TouchableOpacity onPress = {() => rotateObject("left")}>
          <Text style = {styles.arrowButton}>←</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress = {() => rotateObject("right")}>
          <Text style = {styles.arrowButton}>→</Text>
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
  },
  rotationControls: {
    width: "100%",
    height: 60,
    backgroundColor: "#FFFFFF",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center"
  },
  arrowButton: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000000"
  }
});