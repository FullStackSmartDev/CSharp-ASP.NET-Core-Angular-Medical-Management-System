// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: "http://localhost:5000/api/",
  baseUrl: "http://localhost:5000/",
  appName: "webrtc-angularfire2",
  firebase: {
    apiKey: "AIzaSyAcMOgG58ZIfB0Mr62tpUS6YUB8wpnvIJg",
    authDomain: "webrtc-e1eeb.firebaseapp.com",
    databaseURL: "https://webrtc-e1eeb.firebaseio.com",
    projectId: "webrtc-e1eeb",
    storageBucket: "",
    messagingSenderId: "276952673200"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
