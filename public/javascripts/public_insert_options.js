
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
// /a(href="/insert/?id="+user.id)
