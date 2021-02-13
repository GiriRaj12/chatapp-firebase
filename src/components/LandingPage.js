import React, { useEffect } from 'react';
import firebase from 'firebase';
import { useHistory } from 'react-router-dom';


function LandingPage() {

    let history = useHistory();

    useEffect(() => {
        firebase
            .auth().onAuthStateChanged(user => {
                if (user) {
                    history.push("/Chat");
                }
                else {
                    history.push("/Login");
                }
            })
    });

    return (
        <div>
            Loading ...
        </div>
    )
}

export default LandingPage;