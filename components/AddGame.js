import React, { useEffect, useState } from 'react';
import { TouchableOpacity, TextInput, Platform, Text, View, StyleSheet, Picker } from 'react-native';
import { firebase } from '../firebase';
import styles from "../assets/Styles";


const AddGame = ({ teamId, setRoute }) => {
    const [gameNameField, setGameNameField] = useState("")
    const [gameDescriptionField, setGameDescriptionField] = useState("")
    const [numPlayers, setNumPlayers] = useState("2-4")

    function handleOnSubmit() {
        // var gamesRef = firebase.database().ref('games/' + teamId)
        const newGame = {
            name: gameNameField,
            description: gameDescriptionField,
            numPlayers: numPlayers,
        }
        var updates = {};
        updates['games/' + teamId +'/' + gameNameField] = newGame;
        return firebase.database().ref().update(updates)
            .then(() => setRoute("manageGames"))
            .catch((error) => alert(error));
    }


    return (
        <View>
            <View>
                <Text style={[styles.header, styles.center]}> Add a Game </Text>

                <Text style={[styles.text, styles.center]}> Game Name </Text>
                <TextInput autoFocus maxLength={40} style={[styles.textInput, styles.center]} value={gameNameField} onChangeText={text => setGameNameField(text)} placeholder="New Game" />

                <Text style={[styles.text, styles.center]}> Description </Text>
                <TextInput autoFocus maxLength={40} style={[styles.textInput, styles.center]} value={gameDescriptionField} onChangeText={text => setGameDescriptionField(text)} placeholder="Add a description of how to play the game here." />

                <Text style={[styles.text, styles.center]}> Game Name </Text>
                <Picker
                    selectedValue={numPlayers}
                    style={{ height: 50, width: 150 }}
                    onValueChange={(itemValue, itemIndex) => setNumPlayers(itemValue)}
                >
                    <Picker.Item label="2-4" value="2-4" />
                    <Picker.Item label="5-7" value="5-7" />
                    <Picker.Item label="8+" value="8+" />
                </Picker>


                <TouchableOpacity style={[styles.button, styles.center]} onPress={() => handleOnSubmit()}>
                    <Text style={[styles.text, styles.center]}>Add</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.center]} onPress={() => setRoute("Teams")}>
                    <Text style={[styles.text, styles.center]}>Back</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default AddGame;