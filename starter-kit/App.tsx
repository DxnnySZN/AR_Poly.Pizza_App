import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroText,
  ViroTrackingReason,
  ViroTrackingStateConstants,
  ViroBox,
  ViroMaterials,
  ViroAnimations
} from "@reactvision/react-viro";
import React, { useState } from "react";
import { StyleSheet } from "react-native";

const InitialScene = () => {
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
      {/* displays text in AR space */}
      <ViroText
        text = {"DxnnySZN"}
        position = {[-2, -1, -3]}
        style = {{fontSize: 100, fontFamily: "Arial", color: "red"}}
      />
      {/* this is how the minecraft creeper head texture is implemented */}
      <ViroBox
        height = {2}
        length = {2}
        width = {2}
        scale = {[0.2, 0.2, 0.2]}
        position = {[-3, -1, -3]}
        materials = {["minecraftCreeperHead"]}
        animation = {{name: "rotate", loop: true, run: true}}
      />
    </ViroARScene>
  )
}

export default () => {
  return (
    <ViroARSceneNavigator
      initialScene = {{
        scene:InitialScene
      }}
      style = {{flex : 1}}
    />
  );
};

var styles = StyleSheet.create({
  //
});