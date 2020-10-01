import React, { useEffect, useState } from 'react';
import { TouchableOpacity, ImageBackground, Text, View, StyleSheet, SafeAreaView } from 'react-native';
import { firebase } from '../firebase';

const image = { uri: "https://cdn.apartmenttherapy.info/image/upload/f_auto,q_auto:eco,c_fit,w_1460,h_822/at%2Fart%2Fdesign%2Fzoom-backgrounds%2FAT-zoom-background-stayhome" };

const Lobby = ({ user, setUser, uid, setUid }) => {
    const [lobby, setLobby] = useState(null);
    const db = firebase.database().ref('lobby');
    const [myVote, setMyVote] = useState(false);
    const [joinLobby, setJoinLobby] = useState(false);
    const [lobbyClosed, setLobbyClosed] = useState(false);

    useEffect(() => {
        const handleData = snap => {
            if (snap.val()) {
                const json = snap.val()
                const lobby = Object.values(json)
                setLobby(lobby)
                setLobbyClosed(isLobbyClosed(lobby))

            }
        }
        db.on('value', handleData, error => alert(error));
        return () => { db.off('value', handleData); };
    }, []);

    const voteToClose = () => {
        var voteRef = firebase.database().ref('/lobby/' + uid);
        voteRef.update({ voteToClose: "true" });
    }

    const addToLobby = () => {
        if (!uid) {
            const newUser = {
                name: user.name,
                voteToClose: "false"
            };
            var key = db.push(newUser).getKey();
            setUid(key);
            setJoinLobby(true);
        }
    }

    const isLobbyClosed = (lobby) => {
        if (lobby) {
            var arr = lobby.filter(user => user.voteToClose == "false")
            return (arr.length == 0)
        }
        return false
    }

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.header}>Hello {user.name}!</Text>
                {(!joinLobby) &&
                    <TouchableOpacity style={styles.button} title={"Join Lobby"} onPress={addToLobby} >
                        <Text style={styles.buttonText}>Join Lounge</Text>
                    </TouchableOpacity>
                }
                {lobby ? (
                    <View>
                        {lobby.map(user => (
                            <View key={user.name} style={styles.list}>
                                <Text style={styles.listText}>Name: {user.name}</Text>
                                <Text style={styles.listText}>Vote to Close: {user.voteToClose}</Text>
                            </View>
                        ))}
                        {!myVote && joinLobby &&
                            <TouchableOpacity style={styles.button} title={"Vote to Close"} onPress={voteToClose}>
                                <Text style={styles.buttonText}>Vote to Close</Text>
                            </TouchableOpacity>}
                    </View>)
                    :
                    <Text style={styles.text}>Lobby is empty now!</Text>}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#8FBC8F',
        //width: 400,
        //height: 400,
        width: '100%',
        height: '100%',
    },
    header: {
        fontSize: 32,
        marginVertical: 60,
        color: '#F5F5DC',
        justifyContent: 'center',
        textAlign: 'center',
    },
    text: {
        fontSize: 24,
        color: '#F5F5DC',
        alignItems: 'center',
        textAlign: 'center'
    },
    textInput: {
        margin: 10,
        height: 30,
        borderColor: '#F5F5DC',
        borderWidth: 4,
        marginVertical: 30,
    },
    button: {
        backgroundColor: '#556B2F',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15, 
        //width: 200,
        height: 50,
    },
    buttonText: {
        fontSize: 18,
        color: '#F5F5DC',
    },
    list: {
        fontSize: 15,
        padding: 15,
        color: '#F5F5DC',
        backgroundColor: '#556B2F',
        borderRadius: 15,
        margin: 20,
    },
    listText: {
        fontSize: 18,
        color: '#F5F5DC',
        textAlign: 'center'
    },
});

export default Lobby;

