
  //this assumes that the socket.io server is always the same as the express one
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


//everytime the count is updated, we get this message so they all update together
socket.on('voteData', function(data) {
  optionsInfo = data;
  //run trough all options and update the HTML elements to match the number of votes
  for(var i = 0; i < optionsInfo.length; i++)
  {
    
    document.getElementById("user_txt"+optionsInfo[i].id).innerHTML =
    optionsInfo[i].name+" com "+
    optionsInfo[i].votes+" votos";
  }
  
});

//function to emit the vote to the server
 var userVote = function(idVote)
 {socket.emit('vote',idVote);}

