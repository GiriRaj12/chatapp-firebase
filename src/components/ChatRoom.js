import { Grid, TextField, Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

function ChatRoom(props) {
    let [currentMessage, setCurrentMessage] = useState(null);
    let [messages, setMessages] = useState(null);

    useEffect(() => {
        if (props.user && props.targerUser) {

        }
    })

    if (!(props.user && props.targetUser)) {
        return '';
    }

    return (
        <Grid container style={{ marginLeft: '18%', width: '85%', height: '100%' }}>
            <Grid item style={{ width: '100%', height: '85%', overflow: 'scroll' }}>
                {getMessages(user)}
            </Grid>
            <Grid item style={{ width: '85%', height: '15%', position: 'fixed', bottom: '0', overflow: 'scroll' }}>
                <TextField
                    style={{ width: '95%' }}
                    label="Message"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                ></TextField>
                <div style={{ padding: '10px' }}>
                    <Button variant='contained' color='primary' style={{ marginLeft: '10px' }}>Submit</Button>
                    <Button variant='contained' color='secondary' style={{ marginLeft: '10px' }} onClick={() => setCurrentMessage('')} >Cancel</Button>
                </div>
            </Grid>
        </Grid>
    )
}

export default ChatRoom;