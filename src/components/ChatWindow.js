import React, { useEffect, useState } from 'react';
import firebase from 'firebase';
import { Avatar, Drawer, List, ListItem, Typography, Grid, InputBase, Button, ListItemText } from '@material-ui/core';
import logo from '../images/logo.jpg';
import { getUsers } from '../firebaseHanlders/users';
import { SearchRounded } from '@material-ui/icons';
import './styles/ChatWindow.css';
import ChatRoom from './ChatRoom';
import { saveInitiatedMessages, getInitiatedMessages } from '../firebaseHanlders/messages';

function ChatWindow() {
    let [user, setUser] = useState(null);

    let [searchUserList, setSearchUserList] = useState([]);

    let [searchTerm, setSearchTerm] = useState(null);

    let [chatUsers, setChatUsers] = useState([]);

    let [targetUser, setTargetUser] = useState(null);



    useEffect(() => {
        firebase.auth().onAuthStateChanged(currentUser => {
            if (!user && currentUser) {
                setUser(currentUser);
                getInitiatesMessagesForChatWindow(currentUser);
                getSearchUserList();
            }
            else {
                window.location.replace('/Login');
            }
        });

    }, []);

    let getInitiatesMessagesForChatWindow = (currentUser) => {
        console.log("Into get initiated messages");
        if (currentUser) {
            console.log(currentUser.uid);
            getInitiatedMessages(currentUser.uid)
                .get()
                .then(function (doc) {
                    console.log(doc);
                    if (doc.exists) {
                        setChatUsers(doc.data());
                    }
                })
        }
    }

    let getSearchUserList = () => {
        let userPromise = getUsers();
        userPromise.then(function (querySnapshot) {
            let users = [];
            querySnapshot.forEach(function (doc) {
                let user = doc.data();
                console.log(user);
                users.push(user);
            });
            setSearchUserList(users);
        })

    }

    let handleUserSelect = (id) => {
        let thisUser = null;
        for (let currentUser of searchUserList) {
            if (currentUser.id === id) {
                thisUser = currentUser;
            }
        }
        if (thisUser && user) {
            saveInitiatedMessages(user.uid, thisUser);
            setSearchUserList([]);
            setSearchTerm('');
            getInitiatesMessagesForChatWindow(user);
        }
    }

    let setTargetUserId = (id) => {
        let selectedUser = null;
        for (let currentUser of searchUserList) {
            if (currentUser.id === id) {
                selectedUser = Object.assign({}, currentUser);
                break;
            }
        }

        if (selectedUser) {
            console.log(selectedUser);
            setTargetUser(selectedUser);
            console.log(targetUser);
        }
    }

    return (
        <div>
            <div style={{ width: '240px', height: '100%', position: 'relative' }}>
                <Drawer
                    container
                    variant='permanent'
                    PaperProps={{ backgroundColor: 'blue', width: '10%', }}
                >
                    <div style={{ margin: '10px auto' }}>
                        <img
                            alt="Loading.."
                            src={logo}
                            width="60px"
                            height="60px"
                        >
                        </img>
                        <Typography>
                            - Ping -
                    </Typography>
                    </div>
                    <Avatar
                        style={{ width: '100px', height: '100px', boxShadow: '0 0 0.5 0 grey', margin: '20px auto' }}
                        alt={user ? user.displayName : 'A'}
                        src={user ? user.photoURL : ''}
                    >
                    </Avatar>
                    <Typography style={{ margin: '10px auto' }}>{user ? user.displayName : ''}</Typography>
                    <Grid
                        container
                        className="search-container"
                    >
                        <Grid
                            item
                        >
                            <SearchRounded style={{ padding: '4px' }} />
                        </Grid>
                        <Grid
                            item
                        >
                            <InputBase
                                placeholder="Search Users"
                                onClick={() => { getSearchUserList() }}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                value={searchTerm}
                            >
                            </InputBase>
                        </Grid>
                    </Grid>
                    {getUsersListView(searchUserList, searchTerm, handleUserSelect)}
                    <div className="chat-items-list-container">
                        {getChatItemsView(chatUsers, setTargetUserId)}
                    </div>
                    <div className="logout-view">
                        <Button
                            variant='contained'
                            color='primary'
                        >Logout</Button>
                    </div>
                </Drawer>
            </div>
            <div style={{ position: 'fixed', height: '80%', right: '10', width: '90%' }}>
                {(user && targetUser) ? <ChatRoom user={user} targetUser={targetUser} ></ChatRoom> : ''};
            </div>
        </div >
    )
}

function getUsersListView(searchUserList = [], searchTerm, callback) {

    if (!(searchUserList && searchTerm))
        return '';

    if (!(searchUserList.length > 0)) {
        return '';
    }

    let listItemStyle = {
        cursor: 'pointer',
        marginBottom: '10px',
        '&:hover': {
            backgroundColor: 'rgb(128, 231, 214)'
        }
    }

    let getSearchUserList = () => {
        return searchUserList.map(user => {
            if (searchTerm && user.userName.includes(searchTerm)) {
                return <ListItem id={user.id} key={user.id} style={listItemStyle}>{user.userName}</ListItem>
            }
            else {
                return '';
            }
        })
    }

    return (
        <div className="users-list-view-container">
            <div className="down-button-view">
            </div>
            <div className="users-list-view" onClick={e => callback(e.target.id)}>
                <List>
                    {getSearchUserList()}
                </List>
            </div>
        </div>);
}

function getChatItemsView(chatUsers, setTargetUser) {
    if (!chatUsers) {
        return;
    }

    let handleClickEvent = (id) => {
        console.log(id);
        setTargetUser(id);
    }

    let arr = chatUsers.initiatedList ? chatUsers.initiatedList : [];

    return <List>
        {arr.map(e => {
            return <ListItem>
                <div>
                    <p id={e.id} onClick={(e) => handleClickEvent(e.target.id)} style={{ cursor: 'pointer', width: '100%' }} >{e.userName}</p>
                </div>
            </ListItem>
        })}
    </List>
}


export default ChatWindow;