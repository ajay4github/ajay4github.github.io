if ('serviceWorker' in navigator) {
  console.log('Service Worker is supported');
  navigator.serviceWorker.register('sw.js').then(function() {
    return navigator.serviceWorker.ready;
  }).then(function(reg) {
    console.log('Service Worker is ready :^)', reg);
    
  }).catch(function(error) {
    console.log('Service Worker error :^(', error);
  });
}
//event
var enablePushSwitch = document.querySelector('.js-enable-push');
  enablePushSwitch.addEventListener('change', function(e) {
    if (e.target.checked) {
		   navigator.serviceWorker.ready.then(function(reg) {
			   console.log('sub');
				reg.pushManager.subscribe({userVisibleOnly: true}).then(function(sub) {
				// Check for a permission prompt issue
				if ('permissions' in navigator) {
				  navigator.permissions.query({name: 'push', userVisibleOnly: true})
					.then(function(permissionState) {
					  console.log('subscribe() Error: Push permission state = ',
					  permissionState);
			   
					}).catch(function(err) {
					  console.log('Ooops Push Couldn\'t Register',
						'<p>When we tried to ' +
						'get the subscription ID for GCM, something went wrong, not ' +
						'sure why.</p>' +
						'<p>Have you defined "gcm_sender_id" and ' +
						'"gcm_user_visible_only" in the manifest?</p>' +
						'<p>Error message: ' +
						err.message +
						'</p>');
					  
					});
				}	
				// Check for a permission prompt issue
				console.log('endpoint:', sub.endpoint);
				document.location.href=sub.endpoint;
			});
		});
    } 
  });
function loadJSON(path, success, error)
{
    console.log(path);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
                	var data = JSON.parse(xhr.responseText);
                	console.log('count :' + data.query.count);
                	var results = data.query.results;
                	var title = results.channel.title;
                	console.log('title :' + title);
                	var body = results.channel.description;
                	console.log('body :' + body);
                	var link = results.channel.title;
                	console.log('link :' + link);
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
};
//loadJSON('http://localhost/gcm-push/sample-data.json', function(data) { 'data '+ console.log(data); }, function(xhr) { console.error(xhr); });