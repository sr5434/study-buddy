import { initializeApp, getApps } from "firebase/app";
import { firebaseConfig } from "./firebaseConf";
import { getFirestore } from "firebase/firestore";

let app;
let db;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} else {
  app = getApps()[0];
  db = getFirestore(app);
}

export { db };