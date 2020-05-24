var config = 
{
  method:'put',
  url: "/insert/",
  headers: {'Content-type': 'application/json',"ta_enviando":"sim"},
  data:{}

}

var EditOption = function()
{
  //here if we used the button as submit it would be sent automatically, but we need to add some info (id and old img src, in case of no file)
  //so we manually create a formdata to send as body of requisition and then let formidable deal with it
  var bodyFormData = new FormData(document.forms[0]);
  bodyFormData.set('id', optionsInfo.id);
  bodyFormData.set('img', optionsInfo.img);
  //then we set the formdata as request body 
  config.data = bodyFormData;
  axios(config).then
  (//and we send it
    function(response)
    {
      if(response.status == 200)
      {
        axios.post('/refresh/')
        .then(response => {
        console.log(response);
        })
        .catch(error => {
        console.log(error);
        });
        window.location = "/insert/edit/?id="+optionsInfo.id;//if ok, refresh
        
      }
    }
  );
}


