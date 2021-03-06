

	var DeleteEntry = function()
	{
		//console.log("event target value: "+event.target);
		axios.delete("/insert/?id="+event.target.value).then(
			function(response)
			{
				axios.post('/refresh/')
				.then(response => {
				window.location.reload(true);
				console.log(response);
				})
			}
		);
	}

	var logOut = function()
	{
			eraseCookie("Player1");
			eraseCookieFromAllPaths("Player1");
			window.location = "/";
	}

	var refreshUsers = function()
	{
		var bodyFormData = new FormData(document.forms[0]);
		axios.post('/insert/',bodyFormData)
		.then(response => {
			axios.post('/refresh/')
			.then(response => {
			window.location.reload(true);
	  		console.log(response);
			})
		})
		.catch(error => {
	  	console.log(error);
		});
	}

//COOKIE FUNCTIONS 

function eraseCookie(name) {   
    document.cookie = name+'=; expires=Thu, 01-Jan-1970 00:00:01 GMT;';
}

function eraseCookieFromAllPaths(name) {
    // This function will attempt to remove a cookie from all paths.
    var pathBits = location.pathname.split('/');
    var pathCurrent = ' path=';

    // do a simple pathless delete first.
    document.cookie = name + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT;';

    for (var i = 0; i < pathBits.length; i++) {
        pathCurrent += ((pathCurrent.substr(-1) != '/') ? '/' : '') + pathBits[i];
        document.cookie = name + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT;' + pathCurrent + ';';
    }
}