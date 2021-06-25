import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const store = admin.firestore();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const userRegister = functions.auth.user().onCreate((user, context) => {
  const userRef = store.doc(`users/${user.uid}`);
  return userRef.set({
    createdAt: context.timestamp,
  });
});
