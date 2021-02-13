import { Grid, TextField, Button, Avatar, Typography } from '@material-ui/core';
import React, { useEffect, useState, useRef } from 'react';
import { saveChatRoomMessage, getChatRoomMessages } from '../firebaseHanlders/messages';
import { v4 } from 'uuid';
import './styles/ChatRoom.css';

function ChatRoom(props) {
    const messagesEndRef = useRef(null);

    let [currentMessage, setCurrentMessage] = useState(null);

    let [messages, setMessages] = useState(null);

    let [id, setId] = useState(props.id);

    useEffect(() => {
        getChatRoomMessages(props.targetUser.chatId)
            .onSnapshot(function (doc) {
                let data = doc.data();
                console.log(data);
                if (data) {
                    scrollToBottom()
                    setMessages(data.messages);
                }
            });

        if (props.targetUser) {
            getMessagesFromFirebase(props.targetUser.chatId);
        }
        scrollToBottom()
    }, []);

    let scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }


    let saveMessage = (text) => {
        let timestamp = new Date().getTime();
        let obj = {
            id: v4(),
            message: text,
            time: timestamp,
            userId: props.currentUser.uid,
        }
        saveChatRoomMessage(obj, props.currentUser, props.targetUser);
        setCurrentMessage('');
    }

    let getMessagesFromFirebase = (chatId) => {
        console.log("Chat id", chatId);
        getChatRoomMessages(chatId)
            .get()
            .then(function (doc) {
                console.log("Into messages");
                if (doc.exists) {
                    console.log("Doc exists");
                    console.log(doc.data());
                    let message = doc.data();
                    setMessages(message.messages);
                }
            });
    }

    return (
        <Grid container style={{ marginLeft: '18%', width: '95%', height: '100%', display: 'flex', flexDirection: 'column-reverse' }} key={props.targetUser.id}>
            <Grid item style={{ width: '93%', margin: '10px', height: '100%', overflow: 'scroll' }}>
                {getMessages(messages, props.currentUser, props.targetUser, messagesEndRef)}
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
                    <Button variant='contained' color='primary' style={{ marginLeft: '10px' }} onClick={() => getMessagesFromFirebase(props.targetUser.chatId)} >Load Messages</Button>
                </div>
            </Grid>
        </Grid>
    )
}

function getMessages(messages, user, targetUser, messageEndRef) {
    if (messages) {
        return <div>
            {messages.map(e => {
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
                    return <div className='message-body left'>
                        <div className='message-conatiner left'>
                            <Grid container style={{ padding: '2px', margin: '10px' }} key={v4()}>
                                <Grid container direction="row">
                                    <Avatar style={{ height: '20px', width: '20px', padding: '10px' }} src={targetUser.imageUrl}></Avatar>
                                    <p>{targetUser.userName}</p>
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
            <div ref={messageEndRef} />
        </div>
    }
}

export default ChatRoom;