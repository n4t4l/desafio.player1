
	var something = function() {
    res.redirect('/users');
  }

	var DeleteEntry = function()
	{
		console.log("event target value: "+event.target);
		axios.delete("/insert/?id="+event.target.value).then(
			function(response)
			{
			 	window.location.reload(true);
				console.log("TRU");
			}
		);
	}

	var logOut = function()
	{
			eraseCookie("Player1");
			window.location = "/";
	}

//COOKIE FUNCTIONS 

function eraseCookie(name) {   
    document.cookie = name+'=; Max-Age=-99999999;'; 
}
