// Enter an API key from the Google API Console:
      //   https://console.developers.google.com/apis/credentials
      var apiKey = 'AIzaSyBhr0EgT4SEgylQI1r8munay3iGdBQ5_Ok';

      // Enter a client ID for a web application from the Google API Console:
      //   https://console.developers.google.com/apis/credentials?project=_
      // In your API Console project, add a JavaScript origin that corresponds
      //   to the domain where you will be running the script.
      var clientId = 'YOU617282100264-vnnbvgbal0d5iocccf7lprnht2ea4vj8.apps.googleusercontent.comEB_CLIENT_ID.apps.googleusercontent.com';

      // Enter one or more authorization scopes. Refer to the documentation for
      // the API or https://developers.google.com/people/v1/how-tos/authorizing
      // for details.
      var scopes = 'profile';

      var authorizeButton = document.getElementById('authorize-button');
      var signoutButton = document.getElementById('signout-button');

      // The discovery JSON object.
      var peopleApiDiscovery;

      function handleClientLoad() {
        // Load the API client and auth2 library.
        var loadGapiClient = new Promise(function(resolve, reject) {
          gapi.load('client:auth2', resolve);
        });

        // Fetch the People API discovery served on local server. You can also
        // pack the json as a string to avoid extra network request.
        // After this promise is fulfilled, the peopleApiDiscovery variable
        // will be set.
        // This discovery document is downloaded from
        // https://people.googleapis.com/$discovery/rest?version=v1
        var fetchPeopleApiDiscovery = fetch('people/people_rest_v1.json').then(
            function(resp){
          return resp.json();
        }).then(function(json) {
          peopleApiDiscovery = json;
          return Promise.resolve();
        });

        // When both the gapi.client is loaded and the discovery JSON object
        // is ready, call initClient to start API call.
        Promise.all([loadGapiClient, fetchPeopleApiDiscovery]).then(initClient);
      }

      function initClient() {
        gapi.client.init({
            apiKey: apiKey,
            discoveryDocs: [peopleApiDiscovery],
            clientId: clientId,
            scope: scopes
        }).then(function () {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

          authorizeButton.onclick = handleAuthClick;
          signoutButton.onclick = handleSignoutClick;
        });
      }

      function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
          authorizeButton.style.display = 'none';
          signoutButton.style.display = 'block';
          makeApiCall();
        } else {
          authorizeButton.style.display = 'block';
          signoutButton.style.display = 'none';
        }
      }

      function handleAuthClick(event) {
        gapi.auth2.getAuthInstance().signIn();
      }

      function handleSignoutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
      }

      // Load the API and make an API call.  Display the results on the screen.
      function makeApiCall() {
        gapi.client.people.people.get({
          resourceName: 'people/me'
        }).then(function(resp) {
          var p = document.createElement('p');
          var name = resp.result.names[0].givenName;
          p.appendChild(document.createTextNode('Hello, '+name+'!'));
          document.getElementById('content').appendChild(p);
        });
      }