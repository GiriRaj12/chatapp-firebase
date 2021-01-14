import { Grid, TextField, Button, Avatar, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { saveChatRoomMessage, getChatRoomMessages } from '../firebaseHanlders/messages';
import { v4 } from 'uuid';
import './styles/ChatRoom.css';

function ChatRoom(props) {
    let [currentMessage, setCurrentMessage] = useState(null);
    let [messages, setMessages] = useState(null);

    useEffect(() => {
        console.log(props);
        getMessagesFromFirebase();
        let id = (props.user.uid + "_" + props.targetUser.id);
        getChatRoomMessages(id)
            .onSnapshot(function (doc) {
                console.log(doc.data().messages);
                setMessages(doc.data().messages);
            })
    }, []);


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

    let getMessagesFromFirebase = () => {
        let id = (props.user.uid + "_" + props.targetUser.id);
        console.log('Into get messages');
        console.log(id);
        getChatRoomMessages(id)
            .get()
            .then(function (doc) {
                if (doc.exists) {
                    let message = doc.data();
                    console.log('Message', message);
                    setMessages(message.messages);
                }
            });
    }

    return (
        <Grid container style={{ marginLeft: '18%', width: '95%', height: '100%', display: 'flex', flexDirection: 'column-reverse' }}>
            <Grid item style={{ width: '93%', margin: '10px', height: '100%', overflow: 'scroll' }}>
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
    if (messages) {
        return messages.map(e => {
            if (e.userId === user.uid) {
                return <div className='message-body right'>
                    <div className='message-conatiner right'>
                        <Grid container style={{ padding: '2px', margin: '10px' }} key={v4()}>
                            <Grid container direction="row">
                                <Avatar style={{ height: '20px', width: '20px', padding: '10px' }} src={user.photoURL}></Avatar>
                                <p>{user.displayName}</p>
                            </Grid>
                            <Grid container>
                                <Typography style={{ marginLeft: '10px', width: 'fit-content' }}>{e.message}</Typography>
                            </Grid>
                        </Grid>
                        <div className="chat-by-depth-div right-div">
                        </div>
                    </div>
                </div>
            } else {
                console.log("other id", e);
                return <div className='message-body left'>
                    <div className='message-conatiner left'>
                        <Grid container style={{ padding: '2px', margin: '10px' }} key={v4()}>
                            <Grid container direction="row">
                                <Avatar style={{ height: '20px', width: '20px', padding: '10px' }} src={targetUser.photoURL}></Avatar>
                                <p>{targetUser.name}</p>
                            </Grid>
                            <Grid container>
                                <Typography style={{ marginLeft: '10px' }}>{e.message}</Typography>
                            </Grid>
                        </Grid>
                        <div className="chat-by-depth-div left-div">
                        </div>
                    </div>
                </div >
            }
        })
    }
}

export default ChatRoom;