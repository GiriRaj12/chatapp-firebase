import firebase from 'firebase';
import firebaseAppConstants from './constants';


export default function initializeApp(){
    firebase.initializeApp(firebaseAppConstants);
}
