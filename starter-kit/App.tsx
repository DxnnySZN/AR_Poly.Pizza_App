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

const InitialScene = (props) => {
  // the elements in each array correspond to the behavior of the object after one rotation, one movement, or one scaling
  const [rotation, setRotation] = useState([-45, 60, 40]);
  const [position, setPosition] = useState([0, 0, 0]);
  const [cribScale, setCribScale] = useState([0.5, 0.5, 0.5]);
  const [treeScale, setTreeScale] = useState([0.3, 0.3, 0.3]);

  let data = props.sceneNavigator.viroAppProps || { object: "The Crib" }; // "The Crib" is set to be the default object when the app launches

  // this minecraft creeper head texture is for the ViroBox
  ViroMaterials.createMaterials({
    minecraftCreeperHead: {
      diffuseTexture: require("./assets/minecraft_creeper_head.jpg")
    }
  })

  // this animation rotates the ViroBox 90 degrees repeatedly
  ViroAnimations.registerAnimations({
    rotate: {
      duration: 2500,
      properties: {
        rotateY: "+=90"
      }
    }
  })

  // moves object when user drags the object
  const moveObject = (newPosition) => {
    setPosition(newPosition);
  }

  // rotates object when user does rotation gesture
  const rotateObject = (rotateState, rotationFactor, source) => {
    if(rotateState === 3) {
      let newRotation = [rotation[0] + rotationFactor, rotation[1] + rotationFactor, rotation[2] + rotationFactor];
      setRotation(newRotation);
    }
  }

  // scales object when user pinches the object
  const scaleCribObject = (pinchState, scaleFactor, source) => {
    if (pinchState === 3) {
      let currentScale = cribScale[0];
      let newScale = currentScale * scaleFactor;
      let newScaleArray = [newScale, newScale, newScale];
      setCribScale(newScaleArray);
    }
  }

  const scaleTreeObject = (pinchState, scaleFactor, source) => {
    if (pinchState === 3) {
      let currentScale = treeScale[0];
      let newScale = currentScale * scaleFactor;
      let newScaleArray = [newScale, newScale, newScale];
      setTreeScale(newScaleArray);
    }
  }

  return(
    <ViroARScene>
      {/* this ambient light illuminates 3D objects */}
      <ViroAmbientLight color = "#FFFFFF"/>

      {/* conditionally renders either "The Crib" or "Nonchalant Tree" */}
      {data.object === "The Crib" ?
        <Viro3DObject
          source = {require("./assets/The_Crib.glb")}
          position = {position}
          scale = {cribScale}
          rotation = {rotation}
          type = "GLB"
          onDrag = {moveObject}
          onRotate = {rotateObject}
          onPinch = {scaleCribObject}
        />
        :
        <Viro3DObject
          source = {require("./assets/Nonchalant_Tree.glb")}
          position = {position}
          scale = {treeScale}
          rotation = {rotation}
          type = "GLB"
          onDrag = {moveObject}
          onRotate = {rotateObject}
          onPinch = {scaleTreeObject}
        />
      }
    </ViroARScene>
  )
}

export default () => {
  const[object, setObject] = useState("The Crib");
  return (
    <View style = {styles.mainView}>
      {/* updates the displayed 3D object based on user selection */}
      <ViroARSceneNavigator
        initialScene = {{
          scene:InitialScene
        }}
        viroAppProps = {{"object": object}}
        style = {{flex : 1}}
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

var styles = StyleSheet.create({
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