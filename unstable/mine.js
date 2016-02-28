var mineflayer = require('mineflayer');
var mcData=require("minecraft-data")("1.8.8");
var scaffoldPlugin = require('mineflayer-scaffold')(mineflayer);
var vec3 = mineflayer.vec3;

module.exports.inject = inject;
function inject(bot) {

  var blocks = [56,14,15,16,21,73,74,129];
  var working = false;
  var test = false;

  bot.on("whisper", function(username, message) {
    if (message === "mine" && working === false) {
      working = true;
      doMine();
    }
    if (message === "stop" && working === true) {
      working = false;
      fakeConsole("Ending cycle...","info");
    }
  });
  
  //Mine
  function doMine() {
      fakeConsole("Locating ores...","info");
      bot.findBlock({
        point: bot.entity.position,
        matching: blocks,
        maxDistance: 64,
        count: 1,
    }, function(err, blockPoints) {
      if (err) {
        fakeConsole('Error trying to find ores: ' + err,"error");
        disMine();
        return;
      }
      if (blockPoints.length) {
        bot.scaffold.to(vec3(blockPoints[0].position.x,blockPoints[0].position.y,blockPoints[0].position.z),function(err) {
          if (err) {
            fakeConsole("Navigation error.","error");
            disMine();
            return;
          } else {
            if (working === true) {
              setTimeout(doMine(),1000);
              return;
            } else {
              disMine();
              return;
            }
          }
        });
      } else {
        fakeConsole("Couldn't find any ores within range.","error");
        disMine();
        return;
      }
    });
  }
  
  function disMine() {
    working = false;
    fakeConsole("Finished mining.","info");
    return;
  }
  
  //Fake console
  function fakeConsole(text,type) {
    document = doc = window.document ;
    var text = arguments[0];
    var type = arguments[1];
    var para = document.createElement("P");
    var t = document.createTextNode(text);
    para.className = type;
    para.appendChild(t);
    document.getElementById('Space').appendChild(para);
    window.scrollTo(0,document.body.scrollHeight);
  }
  fakeConsole("Started mine plugin.", "info");
}