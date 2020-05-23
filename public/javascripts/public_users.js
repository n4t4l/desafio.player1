
	var something = function() {
    res.redirect('/users');
  }

	  var config = 
	  {
		  method:'post',
		  url: "/users/register",
		  headers: {'Content-type': 'application/json',"ta_enviando":"sim"},
		  data:{}

	  }

	var Login = function()
	{
		config.url = "/users";
		config.data = 
		{
			"almosso":Math.random(),
			
			"name":	document.getElementsByName("login")[0].value ,
			"password":document.getElementsByName("password")[0].value
		}

		axios(config).then(
			function(response)
			{
				console.log()
				document.cookie = "player1_cookie="+response.data.acessToken;
				console.log(response);
				window.location = "/insert/";
			}
		);

	}
	var Register = function()
	{
		config.data = 
		{
			"name":	document.getElementsByName("login")[0].value ,
			"password":document.getElementsByName("password")[0].value
		}
		axios(config).then(
			function(response)
			{
			 	
				console.log(response);
			}
		);
	}
// /a(href="/insert/?id="+user.id)
