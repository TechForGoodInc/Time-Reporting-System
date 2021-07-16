# Getting Started
This project was created using React.js and uses Firebase authentication, database, and hosting.\
Once cloned, you will need to use `npm install` to install dependencies.\
You will also need to create a file called firebaseCfg.js in the src folder. In this file, copy firebaseConfig from your Firebase app's config info found in ProjectSettings/General at the bottom.\
firebaseCfg.js should look something like this:
```
var firebaseConfig = {
    apiKey: "your API key",
    authDomain: "your domain",
    projectId: "your project ID",
    storageBucket: "your storage bucket",
    messagingSenderId: "your messaging sender ID",
    appId: "your app ID"
};

export default firebaseConfig;
```

# Testing

Use `npm start` to run the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

# Deployment

Use `firebase use projectID` to link to your firebase project

Use `npm run build` to build the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

Use `firebase deploy` to deploy the project to the domain specified in Hosting/Dashboard
