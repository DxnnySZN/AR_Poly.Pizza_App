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
  let data = props.sceneNavigator.viroAppProps;

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

  return(
    <ViroARScene>
      {/* this ambient light illuminates 3D objects */}
      <ViroAmbientLight color = "#FFFFFF"/>

      {/* conditionally renders either "The Crib" or "Nonchalant Tree" */}
      {data.object === "The Crib" ?
        <Viro3DObject
          source = {require("./assets/The_Crib.glb")}
          position = {[0, -3, -5]}
          scale = {[0.5, 0.5, 0.5]}
          type = "GLB"
        />
        :
        <Viro3DObject
          source = {require("./assets/Nonchalant_Tree.glb")}
          position = {[0, -3, -5]}
          scale = {[0.3, 0.3, 0.3]}
          type = "GLB"
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