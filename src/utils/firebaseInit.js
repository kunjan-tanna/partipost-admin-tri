import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/messaging";

firebase.initializeApp({
  apiKey: "AIzaSyBznrC305erFdChfl7ClHi57chiC1Th5jk",
  authDomain: "partipost-ebb86.firebaseapp.com",
  projectId: "partipost-ebb86",
  storageBucket: "partipost-ebb86.appspot.com",
  messagingSenderId: "824838106149",
  appId: "1:824838106149:web:a0f4ae8013f6f3ee27a3cc",
  measurementId: "G-CLHJ6H4GNY",
});

// PUSH NOTIFICATION CODE
if (firebase.messaging.isSupported()) {
  var messaging = firebase.messaging();
}
// const messaging = firebase.messaging();

const { REACT_APP_VAPID_KEY } =
  "AAAAw99cLRc:APA91bFEplG1U4EZB2iJjnNB3ZvaxO3zsDrMiQc--WL9NlgQWdz3baP_efSEdi2NckPzJCxSrVWcKwCFUCTV9tjm9F_WpofIy4OaAFg6WOKEnR2hpOzjz4RasmSmmGnxXD_bjLy4L2U9";
const publicKey = REACT_APP_VAPID_KEY;

export const getToken = async (setTokenFound) => {
  let currentToken = "";

  try {
    currentToken = await messaging.getToken({ vapidKey: publicKey });
    if (currentToken) {
      setTokenFound(true);
    } else {
      setTokenFound(false);
    }
  } catch (error) {
    // console.log("An error occurred while retrieving token. ", error);
  }

  return currentToken;
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
    });
  });
