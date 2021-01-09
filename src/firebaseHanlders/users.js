import firebase from 'firebase';

let db = firebase.firestore();

function saveUser(user){
    if(user){
        db.collection('user').add({
            id:user.uid,
            email : user.email,
            userName : user.displayName,
        })
    }
}