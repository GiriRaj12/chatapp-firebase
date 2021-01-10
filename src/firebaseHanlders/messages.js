import firebase from 'firebase';

export function saveInitiatedMessages(userId, initiatedUser) {
    console.log('Initiated User', initiatedUser);
    firebase.firestore()
        .collection('messages')
        .doc(userId)
        .get()
        .then(function (doc) {
            if (doc.exists) {
                let updatedObj = doc.data();
                console.log('Doc exists', updatedObj);
                let array = updatedObj.initiatedList;
                let bol = true;

                for (let currentUser of array) {
                    if (currentUser.id === initiatedUser.id) {
                        bol = false;
                    }
                }
                updatedObj.initiatedList.push(initiatedUser);
                if (bol) {
                    updateInitiatedMessages(updatedObj, userId);
                }
            }
            else {
                let obj = {
                    id: userId,
                    initiatedList: [initiatedUser]
                }
                console.log('to save', obj);
                createInitiatedMessages(userId, obj);
            }
        })
}

export function updateInitiatedMessages(data, userId) {
    firebase.firestore()
        .collection('messages')
        .doc(userId)
        .delete()
        .then(() => {
            createInitiatedMessages(userId, data)
        });
}

export function createInitiatedMessages(userId, data) {
    firebase.firestore()
        .collection('messages')
        .doc(userId)
        .set(data);
}

export function deleteInitiatedMessage(userId) {
    firebase.firestore()
        .collection('messages')
        .doc(userId)
        .then(function (doc) {
            if (doc.exists) {
                let updateObj = removeUserId(doc.data(), userId);
                updateInitiatedMessages(updateObj, userId);
            }
        })
}

function removeUserId(obj, userId) {
    let array = obj.initiatedList;
    let indext = -1;
    let count = 0;
    for (let user of userId) {
        if (user.id === userId) {
            indext = count;
            break;
        }
        count++;
    }
    if (indext !== -1)
        array.splice(indext, 1);
    obj.initiatedList = array;
    return obj;
}

export function getInitiatedMessages(userId) {
    return firebase.firestore().collection('messages').doc(userId);
}

export function getChatRoomMessages(id) {
    return firebase.firestore().collection('messages').doc(id);
}

export function saveChatRoomMessage(obj, id) {
    console.log(obj, id);
    firebase.firestore().collection('messages').doc(id)
        .get()
        .then(function (doc) {
            if (doc.exists) {
                let messages = doc.data();
                let messageArray = messages.messages.push(obj);
                firebase.firestore().collection('messages')
                    .doc(id)
                    .update({
                        'messages': messageArray
                    })
                    .then((e) => console.log(e));
            }
            else {
                let messageObj = {
                    userId: id,
                    messages: [obj]
                }

                firebase.firestore().collection('messages')
                    .doc(id)
                    .set(messageObj);
            }
        })
}