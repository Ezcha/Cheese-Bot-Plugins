//This plugin is not very stable!
var mineflayer = require('mineflayer');
var mcData=require("minecraft-data")("1.8.8")
var scaffoldPlugin = require('mineflayer-scaffold')(mineflayer);
var vec3 = mineflayer.vec3;
module.exports.inject = inject;

function inject(bot) {

var working = false
var blockNameSet = null

//Command	
bot.on('whisper', function (username, message) {
    if (username == bot.username) return;
    if (message.startsWith('get ')) {
		if (working == false) {
			working = true
			blockNameSet = message.substring(4);
			fakeConsole("Attempting to get " + blockNameSet,"info")
			getBlock();
		}
	}
	if (message === "stop") {
		bot.navigate.stop()
		working = false
		fakeConsole("Ended task.","info")
	}
  });
 
bot.navigate.on('arrived', function () {
  getBlock();
});
 
function getBlock() {
	if (working == true) {
		getBlock = findBlock(blockNameSet, 20, bot.entity.position)
		if (getBlock != null) {
			var tempVar = vec3(getBlock.position.x, getBlock.position.y, getBlock.position.z);
			bot.scaffold.to(tempVar, function(err) {
				if (err) {
					fakeConsole("Navigation error.","error")
				} else {
					//bot.chat("made it!");
					bot.navigate.stop()
					working = false
					//setTimeout(getBlock(),2000)
				}
			});
		} else {
			working = false
			fakeConsole("Finished task.","info")
	}
}

//Block Finder
function findBlock(type, size, point) {
    var block = null;
    var shortest = null;
    var x1 = Math.floor(point.x - size);
    var x2 = Math.floor(point.x + size);
    var y1 = Math.floor(point.y - size);
    var y2 = Math.floor(point.y + size);
    var z1 = Math.floor(point.z - size);
    var z2 = Math.floor(point.z + size);
    //bot.chat(x1 + "");

    for (x = x1; x < x2; x++) {
        for (y = y1; y < y2; y++) {
            for (z = z1; z < z2; z++) {

                var cPoint = vec3(x, y, z);
                var cBlock = bot.blockAt(cPoint);
                //bot.chat(cPoint + "");
                if (cBlock) {
                    //bot.chat(cBlock.name);
                    if (cBlock.name == type) {
                        if ((shortest > cPoint.distanceTo(point)) || shortest == null) {
                            shortest = cPoint.distanceTo(point);
                            block = cBlock;
                        }
                    }
                }
            }
        }
    }

    return block;
}
}

////Fake console
	function fakeConsole(text,type) {
	document = doc = window.document 
	var text = arguments[0]
	var type = arguments[1]
	var para = document.createElement("P");
	var t = document.createTextNode(text);
	para.className = type;
	para.appendChild(t);
	document.getElementById('Space').appendChild(para);
	window.scrollTo(0,document.body.scrollHeight);
	}

fakeConsole("Started get plugin.","info")
 
}
