// Scripts for firebase and firebase messaging
// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
// eslint-disable-next-line no-undef
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyBznrC305erFdChfl7ClHi57chiC1Th5jk",
  authDomain: "partipost-ebb86.firebaseapp.com",
  projectId: "partipost-ebb86",
  storageBucket: "partipost-ebb86.appspot.com",
  messagingSenderId: "824838106149",
  appId: "1:824838106149:web:a0f4ae8013f6f3ee27a3cc",
  measurementId: "G-CLHJ6H4GNY",
};

// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
// eslint-disable-next-line no-undef
if (firebase.messaging.isSupported()) {
  var messaging = firebase.messaging();
}
// const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  // console.log("Received background message ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "./favicon.svg",
  };

  // eslint-disable-next-line no-restricted-globals
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});
