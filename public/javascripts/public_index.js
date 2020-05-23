
  var page_ip = window.location.href.split("?")[0];
  var socket = io.connect(page_ip);

  socket.on('connect', function(data) {
    socket.emit('join', 'Hello World from client');

    socket.on('messages', function(data) {
      alert(data);
    });
    
    
 });

 //function to find a object by property on a array (i stole this part, tbh) 
 function findWithAttr(array, attr, value) {
  for(var i = 0; i < array.length; i += 1) {
      if(array[i][attr] === value) {
          return i;
      }
  }
  return -1;
}



socket.on('voteData', function(data) {
  optionsInfo = data;
  console.log("recebi do serv");
  for(var i = 0; i < optionsInfo.length; i++)
  {
    
    document.getElementById("user_txt"+optionsInfo[i].id).innerHTML =
    optionsInfo[i].name+" com "+
    optionsInfo[i].votes+" votos";
  }
  
});

 var userVote = function(idVote)
 {
   
    //find the object with this id so we can get it's name and vote count locally
    var resultID = findWithAttr(optionsInfo,"id",idVote);
    //console.log(optionsInfo[resultID]);
    //emit the vote
    socket.emit('vote',idVote);
    //this calls the function to update the vote on the server
    //but we also update the vote locally so in case of high latency 
    //the user doesnt see it (at least in his own vote)
    //optionsInfo[resultID].votes = optionsInfo[resultID].votes +1;
    //document.getElementById("user_txt"+idVote).innerHTML = optionsInfo[resultID].name+" com "+
    //optionsInfo[resultID].votes+" votos";
    //and now we wait for the server to transmit the options list back to us so we can update it 
 }

