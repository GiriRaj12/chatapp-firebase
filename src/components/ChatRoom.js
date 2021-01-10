import { Grid, TextField, Button, Avatar, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { saveChatRoomMessage, getChatRoomMessages } from '../firebaseHanlders/messages';
import firebase from 'firebase';
import { v4 } from 'uuid';
import './styles/ChatRoom.css';

function ChatRoom(props) {
    let [currentMessage, setCurrentMessage] = useState(null);
    let [messages, setMessages] = useState(null);

    let saveMessage = (text) => {
        let timestamp = new Date().getTime();
        let obj = {
            id: v4(),
            message: text,
            time: timestamp,
            userId: props.user.uid
        }
        saveChatRoomMessage(obj, (props.user.uid + "_" + props.targetUser.id));
        setCurrentMessage('');
    }

    useEffect(() => {
        if (props.user && props.targetUser) {
            let id = (props.user.uid + "_" + props.targetUser.id);
            console.log(id);
            getMessagesFromFirebase(id);
        }
    }, []);

    let getMessagesFromFirebase = () => {
        let id = (props.user.uid + "_" + props.targetUser.id);
        getChatRoomMessages(id)
            .get()
            .then(function (doc) {
                if (doc.exists) {
                    let message = doc.data();
                    console.log(message);
                    setMessages(message.messages)
                }
            });
    }

    if (props.user && props.targerUser) {
        let id = (props.user.uid + "_" + props.targetUser.id);
        console.log(id);
        getChatRoomMessages(id)
            .get(id)
            .then(function (doc) {
                if (doc.exists) {
                    let message = doc.data();
                    console.log(message);
                    setMessages(message.messages)
                }
            })
    }

    if (!(props.user && props.targetUser)) {
        return '';
    }

    return (
        <Grid container style={{ marginLeft: '18%', width: '85%', height: '100%' }}>
            <Grid item style={{ width: '85%', height: '85%', overflow: 'scroll' }}>
                {getMessages(messages, props.user, props.targetUser)}
            </Grid>
            <Grid item style={{ width: '85%', height: '15%', position: 'fixed', bottom: '0', overflow: 'scroll' }}>
                <TextField
                    style={{ width: '95%' }}
                    label="Message"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                ></TextField>
                <div style={{ padding: '10px' }}>
                    <Button variant='contained' color='primary' style={{ marginLeft: '10px' }} onClick={() => saveMessage(currentMessage)}>Submit</Button>
                    <Button variant='contained' color='secondary' style={{ marginLeft: '10px' }} onClick={() => setCurrentMessage('')} >Cancel</Button>
                    <Button variant='contained' color='primary' style={{ marginLeft: '10px' }} onClick={() => getMessagesFromFirebase()} >Load Messages</Button>
                </div>
            </Grid>
        </Grid>
    )
}

function getMessages(messages, user, targetUser) {
    console.log('into getmessages',);
    console.log(user);
    if (messages) {
        console.log(messages);
        return messages.map(e => {
            if (e.userId === user.uid) {
                return <div className='message-body' style={{ float: 'right' }} >
                    <Grid container>
                        <Grid container direction="row">
                            <Avatar style={{ height: '20px', width: '20px', padding: '10px' }} src={user.photoURL}></Avatar>
                            <p>{user.displayName}</p>
                        </Grid>
                        <Grid container>
                            <Typography style={{ marginLeft: '10px' }}>{e.message}</Typography>
                        </Grid>
                    </Grid>
                </div>
            } else {
                return <div className='message-body' style={{ float: 'left' }} >
                    <Grid container>
                        <Grid container direction="row">
                            <Avatar style={{ height: '20px', width: '20px' }} src={targetUser.photoURL}></Avatar>
                            <p>{targetUser.name}</p>
                        </Grid>
                        <Grid container>
                            <Typography style={{ marginLeft: '10px' }}>{e.message}</Typography>
                        </Grid>
                    </Grid>
                </div>
            }
        })
    }
}

export default ChatRoom;