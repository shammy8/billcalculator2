import firebase from 'firebase/app';

export interface UserDoc {
  createdAt: firebase.firestore.Timestamp;
  primaryBill?: string;
}
