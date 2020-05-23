

	  var config = 
	  {
		  method:'post',
		  url: "/login/register",
		  headers: {'Content-type': 'application/json',"ta_enviando":"sim"},
		  data:{}

	  }

	var Login = function()
	{
		config.url = "/login/";
		config.data = 
		{
			"name":	document.getElementsByName("login")[0].value ,
			"password":document.getElementsByName("password")[0].value
		}

		axios(config).then(
			function(response)
			{
				//console.log(response.data);
				if(response.data.acessToken != undefined)
				{
					document.cookie = 'Player1='+response.data.acessToken;
					setCookie("Player1",response.data.acessToken,30);
					document.cookie = 'pls=response.data.acessToken';
					//console.log("document cookie: "+document.cookie);
					window.location = "/insert/";
				}
				
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
			 	
				//console.log(response);
			}
		);
	}
// /COOKIE FUNCTIONS 

function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}


