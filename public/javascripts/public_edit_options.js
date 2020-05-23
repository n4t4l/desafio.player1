var config = 
{
  method:'post',
  url: "/insert/edit/",
  headers: {'Content-type': 'application/json',"ta_enviando":"sim"},
  data:{}

}

var EditOption = function()
{
  var bodyFormData = new FormData(document.forms[0]);
  bodyFormData.set('id', optionsInfo.id);
  bodyFormData.set('img2', optionsInfo.img);
  console.log("ayy");
  console.log(config);
  config.data = bodyFormData;
  axios(config).then(
  function(response)
  {console.log(response);});
}


