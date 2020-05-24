
  //this assumes that the socket.io server is always the same as the express one
  var page_ip = window.location.href.split("?")[0];
  var socket = new io.connect(page_ip);

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

socket.on('updateOptions', function(data) {
  console.log("update em");
  optionsInfo = data;
  //run trough all options and update the HTML elements to match the number of votes
  var newInnerHTML = "";
  
  for(var i = 0; i < optionsInfo.length; i++)
  {
    newInnerHTML += generateOptionHTML(optionsInfo[i].id,optionsInfo[i].name,optionsInfo[i].img,optionsInfo[i].votes);
  }
  document.getElementById("div_votes").innerHTML = newInnerHTML;
  
});

var generateOptionHTML=function(id,name,img,votes)
{
  return bigString = "<div class='image-block'><div id='user_txt"+id+"' class='usertext'>"+
  name+" com "+votes+" votos</div><img id='IdName' src='"+img+"'>"+
  "<button type='button' onclick='userVote("+id+")'>Vote em "+name+"</button>"
}
//function to emit the vote to the server
 var userVote = function(idVote)
 {socket.emit('vote',idVote);}

