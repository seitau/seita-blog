import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

let serviceAccount;
if (process.env.NODE_ENV === 'test') {
    serviceAccount = require('../../../service_account/secret.json');
} else {
    serviceAccount = functions.config().service_account;
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://kindle-7ef16.appspot.com/",
});
const db = admin.firestore()

const createNewUser = async function(userId) {
    console.log('Creating new user');
    return await admin.auth().createUser({
        uid: userId,
    })
    .catch((err) => {
        console.error("Error creating new user:", err);
    });
}
const authenticate = async function(userId) {
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
        console.log('User: ' + userId + ' does not exist');
        await createNewUser(userId);
    }
}

const firebase = {
    db,
    functions,
    admin,
    authenticate,
};

export default firebase;
