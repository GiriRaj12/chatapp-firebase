import React from 'react';
import { Button, Card, CardContent, Typography } from '@material-ui/core';
import firebase from 'firebase';
import './styles/LoginPage.css';

function LoginPage(){
    let auth = firebase.auth();

    const googleSignIn = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
        .then((response) =>{
            console.log(response);
            window.location.replace('/Chat');
        })
        .catch((err)=> {
            console.log(err);
        });
    }

    return (
        <div className='sign-in-view'>
            <div className='sign-in-container'> 
            <Card style={{width:'40%', height:'40%'}}>
                <CardContent>
                    <Typography>Please sign in to continue</Typography>
                </CardContent>
                <Button
                    variant='contained'
                    color='primary'
                    onClick={()=>googleSignIn()}
                >
                    Google SignIn
                </Button>
            </Card>
            </div>
        </div>
    )
}

export default LoginPage;