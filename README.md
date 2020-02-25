# typescript-firebase-auth-example

[![Netlify Status](https://api.netlify.com/api/v1/badges/46b4c999-5c0c-4427-a012-08b55ac97a91/deploy-status)](https://app.netlify.com/sites/typescript-fcm-example/deploys)

Typescript example for Firebase Auth using service workers.

The following assumes an existing knowledge of NodeJS and Firebase development.

## Environment Setup

1. You will need to create a `.env` or `.env.local` (this is preferred, as to keep any sensitive credentials out of your repository) file with the following variables.

   ```sh
   # .env.local
   # Follow the instructions here to obtain your Firebase config https://firebase.google.com/docs/web/setup
   FIREBASE_API_KEY=your value here
   FIREBASE_PROJECT_ID=your value here
   FIREBASE_MESSAGING_SENDER_ID=your value here
   FIREBASE_APP_ID=your value here
   FIREBASE_MEASUREMENT_ID=your value here
   ```

2. Allow Chrome to use insecure certificates for localhost `chrome://flags/#allow-insecure-localhost`
