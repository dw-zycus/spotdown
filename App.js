import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput, Button, Modal } from "react-native";
import {
  fetchResourceData,
  downloadSong,
  getTrackId,
} from "./util/spotifyDown.js";
import { FileSystem } from 'expo';

const downloadsDirectory = `${FileSystem.documentDirectory}Download/`;

export default function App() {
  return <MainPage />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

const MainPage = () => {
  const [inputText, setInputText] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const handleInputChange = (text) => {
    setInputText(text);
  };

  const handleSubmit = () => {
    const trackId = getTrackId(inputText);
    if (!trackId) {
      setPopupMessage("Invalid link");
      setPopupVisible(true);
    }

    (async () => {
      const resourceData = await fetchResourceData(trackId);
      const { title, artists, album } = resourceData.metadata;
      const directory = `${downloadsDirectory}/${artists}/${album}`;
      await downloadSong(resourceData.link, directory, `${title}.mp3`);
    })();
  };

  const closePopup = () => {
    setPopupVisible(false);
    setInputText("");
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        marginBottom: 20,
      }}
    >
      <Modal
        visible={popupVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closePopup}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View style={{ backgroundColor: "white", padding: 20 }}>
            <Text>{popupMessage}</Text>
            <Button title="Close" onPress={closePopup} />
          </View>
        </View>
      </Modal>

      <Text>Enter a song link or a playlist link:</Text>
      <TextInput
        style={{ width: "80%", height: 40, borderWidth: 1, marginTop: 10 }}
        placeholder="Enter text here"
        onChangeText={handleInputChange}
        value={inputText}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};
