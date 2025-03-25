import { ViroARScene, ViroARSceneNavigator, Viro3DObject, ViroAmbientLight, ViroText } from "@reactvision/react-viro";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView, Image } from "react-native";
import { searchModels } from './api/api_service'; // imports the searchModels function from api_service.ts

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

  // gets the 3D object properties; "AR_Poly.Pizza_App" is set to be the default text when the app launches
  const data = props.sceneNavigator.viroAppProps || { object: "AR_Poly.Pizza_App", rotation: [0, -45, 0] };

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
      <ViroAmbientLight color = "#FFFFFF" />

      {/* initially renders 3D text instead of a model;
          when user selects a model of their choosing, the 3D text gets replaced with the 3D object of the model */}
      {data.object === "AR_Poly.Pizza_App" ? (
        <ViroText
          text = "AR_Poly.Pizza_App"
          position = {[-0.25, -0.4, -2]}
          scale = {scale}
          rotation = {data.rotation}
          style = {{ fontSize: 30, color: "#000000", fontWeight: "bold" }}
          onDrag = {moveObject}
          onPinch = {scaleObject}
        />
      ) : (
        <Viro3DObject
          source = {{ uri: data.object }} // uses the URI of the model fetched from the API
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
  const [object, setObject] = useState("AR_Poly.Pizza_App"); // default text object
  const [rotation, setRotation] = useState<[number, number, number]>([0, -45, 0]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [models, setModels] = useState<any[]>([]); // stores search results from the API
  const [isLoading, setIsLoading] = useState(false); // tracks loading state for API calls

  // rotates object when user clicks the left or right arrow buttons
  const rotateObject = (direction: "left" | "right") => {
    const rotationAmount = 15; // degrees to rotate per click
    if (direction === "left") {
      setRotation(([x, y, z]) => [x, y + rotationAmount, z]);
    } else {
      setRotation(([x, y, z]) => [x, y - rotationAmount, z]);
    }
  };

  // fetches models when search term changes (when user types into the search bar)
  useEffect(() => {
    if (searchTerm === "") return;

    const fetchModels = async () => {
      setIsLoading(true);
      try {
        const result = await searchModels(searchTerm);
        setModels(result);
      } catch (error) {
        console.error("Error fetching models:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // adds a small delay to prevent too many API calls while typing
    const timer = setTimeout(() => {
      fetchModels();
    }, 500);

    return () => clearTimeout(timer); // cancels pending API calls when 3D object disappears or when search term changes
  }, [searchTerm]);

  // handles model selection from search results
  const handleModelSelect = (model: any) => {
    setObject(model.Download); // sets the URI for the 3D object to be displayed
  };

  return (
    <View style = {styles.mainView}>
      {/* AR scene that displays the selected model */}
      <ViroARSceneNavigator
        initialScene = {{ scene: InitialScene }}
        viroAppProps = {{ object, rotation }}
        style = {{ flex: 1 }}
      />

      {/* search bar for finding models */}
      <View style = {styles.searchContainer}>
        <TextInput
          style = {styles.searchInput}
          placeholder = "Select a model to view as an interactive 3D object..."
          value = {searchTerm}
          onChangeText = {setSearchTerm}
        />
      </View>

      {/* loading indicator when fetching models */}
      {isLoading && <Text style = {styles.loadingText}>Loading...</Text>}

      {/* displays search results in a scrollable grid */}
      {!isLoading && (
        <ScrollView style = {styles.modelsScroll}>
          <View style = {styles.modelsContainer}>
            {models.map((model) => (
              <TouchableOpacity key = {model.ID} onPress = {() => handleModelSelect(model)}>
                <View style = {styles.modelCard}>
                  {/* thumbnail preview of the 3D model */}
                  <Image source = {{ uri: model.Thumbnail }} style = {styles.modelImage} />
                  <Text style = {styles.modelName}>{model.Title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* rotation controls for the AR object */}
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

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: "#F8F8F8", // light background for better contrast with controls
  },
  searchContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF", // white background for search bar
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD", // subtle separator
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: "#333", // dark text for better readability
  },
  modelsScroll: {
    maxHeight: 250, // limits height of search results to prevent taking over screen
    padding: 10,
  },
  modelsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly", // evenly spaces model cards
  },
  modelCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    shadowColor: "#000000", // adds subtle shadow for depth
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    margin: 5,
    width: 100, // fixed width for consistent card sizing
    alignItems: "center",
    paddingBottom: 10,
  },
  modelImage: {
    width: 80, // optimized size for thumbnails
    height: 80,
    resizeMode: "contain",
    borderRadius: 10, // rounded corners for images
  },
  modelName: {
    marginTop: 5,
    fontWeight: "bold",
    fontSize: 12, 
    textAlign: "center",
    color: "#333", 
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: "#333",
    marginTop: 10,
  },
  rotationControls: {
    width: "100%",
    height: 50, 
    backgroundColor: "#FFFFFF",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  arrowButton: {
    fontSize: 24, 
    fontWeight: "bold",
    color: "#333",
  },
});

export default App;