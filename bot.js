var Discord = require("discord.js");
var Learn = require('./learn.js');
var Audio = require('./audio.js');
var fs = require('fs');

var Commands = [];

Commands.push({cmd:"!list", run:list, desc: "List All Commands"});
Commands.push({cmd:"!link", run:sendInviteLink, desc: "Get Bot Join Link"});
Commands.push({cmd:"!stop", run:stopAudio, desc: "Stop Current Audio"});
Commands.push({cmd:"!avatar", run:setAvater, desc:"Set Bot Avatar"});
Commands.push({cmd:"!test", run:test, desc:"Test Bot"});
Commands.push({cmd:"!leave", run:leaveVoice, desc:"Leave Audio"});

var mybot = new Discord.Client();
mybot.loginWithToken("MTcwMDIwODA3MTk4NjM4MDgw.CfCntw.lUVQYtFJ-Jh2flq0-TXRUImjkZw");

var currentVoice = "";

Audio.OnComplete = function(){
  console.log("COMPLETE AUDIO LOAD");
  for (var i = 0; i < Audio.AudioFiles.length; i++) {
    var Current = Audio.AudioFiles[i];
    var newCommand = {
      cmd: "!play " + Current.name,
      run: playAudio,
      desc: "Play Audio: " + Audio.AudioFiles[i].name
    };

    Commands.push(newCommand);
  }
}


mybot.on("ready", function(){

});

mybot.on("message", function(message){
  var channel = message.channel;
  console.log("[OnMessage] Got Message: " + message.content + " in "+ channel);
  runCommand(message, channel);
});

mybot.on("voiceJoin", function(channel, user){
  if(user.username == "VictoryForPhil"){
    mybot.joinVoiceChannel(channel);
    currentVoice = channel;
  }
});

mybot.on("voiceLeave", function(channel, user){
  if(user.username == "VictoryForPhil"){
    leaveVoice(channel);
  }
});


function runCommand(cmd, server) {
  for (var i = 0; i < Commands.length; i++) {
    var currentCMD = Commands[i];
    console.log(currentCMD);
    if(currentCMD.cmd.includes(cmd)){
      currentCMD.run(cmd, server);
    }
  }
}

function playAudio(cmd, channel) {
  for (var i = 0; i < Audio.AudioFiles.length; i++) {
      var clip = Audio.AudioFiles[i];
      if(cmd == "!play "+clip.name){
        console.log("Playing Audio");
        console.log(clip);
        mybot.voiceConnections[0].playFile("./audio/" + clip.file, 1);
        mybot.sendMessage(channel, "```Playing: "+clip.name+" ```");
      }
    }
}

function list(cmd, server) {

  var final = "```";
  for (var i = 0; i < Commands.length; i++) {
    final = final + Commands[i].cmd + " - " + Commands[i].desc+ '\n'
  }final = final + "```";
  mybot.sendMessage(server,final);

}
function stopAudio(cmd, channel) {
  mybot.voiceConnection.stopPlaying();
  mybot.sendMessage(channel, "```Stoped Audio! ```");
}

function sendInviteLink(cmd, channel) {
  mybot.sendMessage(channel, "https://discordapp.com/oauth2/authorize?&client_id=170020780174737408&scope=bot&permissions=0")
}

function setAvater() {
  fs.readFile("icon.jpg", {encoding: 'base64'},function(err, data) {
    if(err){
      console.log(err);
    }
    data = "data:image/jpeg;base64," + data;
    console.log("Image Icon Read. Setting.");

     //var base64data = new Buffer(data).toString('base64');
     mybot.setAvatar(data, function(err){
       if(err){
         console.log(err);
       }
       console.log("Set Avatar");
       mybot.sendMessage(channel, "```Set Avatar! ```");
     });

  });

}
function test(cmd, channel) {
  mybot.sendMessage(channel, "```Test! ```");
}

function leaveVoice(cmd, channel) {
  mybot.leaveVoiceChannel(currentVoice);
}
