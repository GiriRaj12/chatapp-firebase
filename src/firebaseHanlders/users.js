import firebase from 'firebase';

function getDB() {
    return firebase.firestore();
}

export function saveUser(user) {
    let db = getDB();

    console.log(user);

    let addUser = {
        id: user.uid,
        email: user.email,
        userName: user.displayName,
        imageUrl: user.photoURL
    }

    console.log(addUser);

    if (user) {
        db.collection('user').doc(user.uid).set(addUser).then(e => {
            console.log(e);
            window.location.replace('/Chat');
        })
    }
}

export function getUsers() {
    let db = getDB();
    return db.collection('user').get();
}

