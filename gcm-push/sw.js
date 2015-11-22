console.log('Started', self);
var urlToOpen = "";
self.addEventListener('install', function(event) {
  self.skipWaiting();
  console.log('Installed', event);
});

self.addEventListener('activate', function(event) {
  console.log('Activated', event);
});

self.addEventListener('push', function(event) {
  console.log('Push message received', event);
  // TODO
  //var title = 'Yay a message !!!';  
  //var body = 'You have received a push message.';  
  var icon = 'chrome-touch-icon-192x192.png';  
  var tag = 'simple-push-demo-notification-tag';
  var tm = new Date();
  var dataURL = 'http://localhost/gcm-push/sample-data.json?t=' + tm.getTime();
  event.waitUntil(
    //data
   fetch(dataURL)
      .then(function(response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          // Throw an error so the promise is rejected and catch() is executed
          throw new Error();
        }

        // Examine the text in the response
        return response.json().then(function(data) {
          if (data.query.count === 0) {
            // Throw an error so the promise is rejected and catch() is executed
            throw new Error();
          }

          var body = data.query.results.channel.description;
          var title = data.query.results.channel.title;
          var notificationTag = 'simple-push-demo-notification';

          // Add this to the data of the notification
          urlToOpen = data.query.results.channel.link;
          return showNotification(title, body, icon, tag); 
        });
      })
      .catch(function(err) {
        console.error('Unable to retrieve data', err);

        var title = 'An error occured';
        var message = 'We were unable to get the information for this ' +
          'push message';

        return showNotification(title, message);
      })

    
  );  
  //TODO
});
self.addEventListener('notificationclick', function(event) {
  //var url = event.notification.data.url;
  var url = urlToOpen;
  event.notification.close();
  event.waitUntil(clients.openWindow(url));
});
function showNotification(title, body, icon, data) {
  var notificationOptions = {
    body: body,
    icon: icon ? icon : 'images/touch/chrome-touch-icon-192x192.png',
    tag: 'simple-push-demo-notification',
    data: data
  };
  if (self.registration.showNotification) {
    return self.registration.showNotification(title, notificationOptions);
  } else {
    new Notification(title, notificationOptions);
  }
}