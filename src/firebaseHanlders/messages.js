import firebase from 'firebase';
import { v4 } from 'uuid';

export function saveInitiatedMessages(userId, initiatedUser, chatId) {
    console.log('Initiated User', initiatedUser);
    console.log("TargetId", userId);
    firebase.firestore()
        .collection('messages')
        .doc(userId)
        .get()
        .then(function (doc) {
            initiatedUser.chatId = chatId ? chatId : v4();
            if (doc.exists) {
                console.log("Has doc for initiation")
                let updatedObj = doc.data();
                let array = updatedObj.initiatedList;
                let bol = true;

                for (let currentUser of array) {
                    if (currentUser.id === initiatedUser.id) {
                        bol = false;
                    }
                }

                updatedObj.initiatedList.push(initiatedUser);

                if (bol) {
                    console.log("Updating list");
                    updateInitiatedMessages(updatedObj, userId);
                }

            } else {
                console.log("Has no doc for initiation")
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
    return firebase.firestore().collection('chats').doc(id);
}

export function saveChatRoomMessage(obj, currentUser, targetUser) {
    console.log('CURRENT USER', currentUser);
    console.log('CHAT OBJ', obj);
    console.log('TARGET USER', targetUser);
    getChatRoomMessages(targetUser.chatId)
        .get()
        .then((doc) => {
            if (doc.exists) {
                console.log("Has doc");
                let messages = doc.data();
                messages.messages.push(obj);
                let messageArray = messages.messages;
                firebase.firestore().collection('chats')
                    .doc(targetUser.chatId)
                    .update({
                        'messages': messageArray
                    })
                    .then((e) => console.log(e));
            }
            else {
                console.log("No doc");
                let messageObj = {
                    id: targetUser.chatId,
                    messages: [obj]
                }

                console.log(messageObj);

                getChatRoomMessages(targetUser.chatId)
                    .set(messageObj)
                    .then(e => {
                        console.log('Done', e);
                    })
            }
        });

    if (currentUser.uid !== targetUser.id) {
        let user = {
            email: currentUser.email,
            id: currentUser.uid,
            imageUrl: currentUser.photoURL,
            userName: currentUser.displayName,
        }
        saveInitiatedMessages(targetUser.id, user, targetUser.chatId);
    }
}