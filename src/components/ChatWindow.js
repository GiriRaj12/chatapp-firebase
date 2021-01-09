import React, { useEffect, useState } from 'react';
import firebase from 'firebase';
import { Avatar, Drawer, List, ListItem, Typography, ListItemText } from '@material-ui/core';
import logo from '../images/logo.jpg';

function ChatWindow(props){
    let [user, setUser] = useState(null);

    let [searchUsers, searchUserList] = useState([]); 

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if(user)
                setUser(user);
            else
                window.location.replace('/Login');
        })
    }, []);

    let getSearchUserList = ( searchTerm ) => {

    }

    let getChatItems = () =>{
        return <List style={{width:'240px'}}>
                    <ListItem>
                        <ListItemText>Chat Person</ListItemText>
                    </ListItem>
            </List>
    }

    return(
        <div>
            <div style={{width:'240px', height:'100%'}}>
            <Drawer
                container
                variant='permanent'
                PaperProps={{ backgroundColor:'blue', width:'10%',}}
            >
                <div style={{margin:'10px auto'}}>
                    <img
                        alt = "Loading.."
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
                    style={{width:'100px', height:'100px', boxShadow:'0 0 0.5 0 grey', margin:'20px auto'}}
                    alt={user ? user.displayName : 'A'}
                    src={user ? user.photoURL : ''}
                >
                </Avatar>
                <Typography style={{margin:'10px auto'}}>{user ? user.displayName : ''}</Typography>
                <div>
                    {getChatItems()}
                </div>
            </Drawer>
            <div style={{marginLeft:'10%'}}>
            </div>
            </div>
        </div>
    )
}

export default ChatWindow;