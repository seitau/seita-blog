import firebase from '../common/firebase';

export default firebase.functions.https.onRequest((req, res) => {
    const params = req.query;
    if (!params.hasOwnProperty('oauth_token')) {
        params['oauth_token'] = 'not provided';
    }
    return firebase.db.collection('auth').doc('evernote')
        .update({
            oauth_token: params['oauth_token'],
            oauth_verifier: params['oauth_verifier'],
            sandbox_lnb: params['sandbox_lnb']
        })
        .then(() => {
            console.log("Document written!: ", req.query);
            return res.status(200).send("Evernote auth successfully executed");
        })
        .catch((err) => {
            console.error("Error adding document: " + err);
            return res.status(500).send("Error adding document: " + err);
        });
});
