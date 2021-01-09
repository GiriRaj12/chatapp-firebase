import React, { useEffect } from 'react';
import firebase from 'firebase';

function LandingPage(){

useEffect(() =>{
    firebase
    .auth().onAuthStateChanged(user =>{
        if(user){
            window.location.replace('/Chat')
        }
        else{
            window.location.replace('/Login')
        }
    })
});

    return(
        <div>
            Loading ...
        </div>
    )
}

export default LandingPage;