module.exports.inject = inject;
var mineflayer = require('mineflayer');
var vec3 = mineflayer.vec3;

function inject(bot) {

var items = [];
var chestItems = [];
var posChest = null;
var blockChest = null;
var chest = null;
var doStore = false;
var doTake = false;
var itemName = null;

bot.on("whisper", function(username, message) {
	if (message == "deposit") {
		if (bot.players[username].entity.position !== null) {
			posChest = bot.players[username].entity.position;
			blockChest = findBlock('chest', 4, posChest);
			if (blockChest !== null) {
				doStore = true;
				fakeConsole("Emptying inventory at " + posChest, "info");
				var tempVar = vec3(blockChest.position.x, blockChest.position.y, blockChest.position.z);
				bot.navigate.to(tempVar, {
					endRadius: 1
				});
			} else {
				fakeConsole("Could not find a chest near " + username + ".", "error");
			}
		}
	}
	if (message == "stop") {
		doStore = false;
		doTake = false;
	}
	if (message == "inv list") {
	}
	if (message == "withdraw") {
		if (bot.players[username].entity.position !== null) {
			posChest = bot.players[username].entity.position;
			blockChest = findBlock('chest', 4, posChest);
			if (blockChest !== null) {
				doTake = true;
				fakeConsole("Withdrawing items from the chest at " + posChest, "info");
				var tempVar = vec3(blockChest.position.x, blockChest.position.y, blockChest.position.z);
				bot.navigate.to(tempVar, {
					endRadius: 1
				});
			} else {
				fakeConsole("Could not find a chest near " + username + ".", "error");
			}
		}
	}
});


bot.navigate.on('arrived', function () {
    if (doStore === true) {
        doStore = false;
		items = bot.inventory.items();
		chest = bot.openChest(blockChest);
		chest.on('open', function () {
			chestFill(0);
		});
    }
    if (doTake === true) {
        doTake = false;
		chest = bot.openChest(blockChest);
		chest.on('open', function () {
			chestItems = chest.items();
			chestClear(0);
		});
    }
});

function chestFill(i) {
	if (i < items.length) {
		var deItem = items[i].type;
		chest.deposit(deItem, null, bot.inventory.count(deItem), function(err) {
			if (err) {
				fakeConsole("Error depositing items.", "error");
			} else {
				fakeConsole("Deposited " + deItem + ".", "info");
				chestFill(i += 1);
			}
		});
	} else {
        setTimeout(chest.close, 1000);
		setTimeout(function() {fakeConsole("Finished depositing items.", "info")}, 1000);
	}
}

function chestClear(i) {
	if (i < chestItems.length) {
		var deItem = chestItems[i].type;
		chest.withdraw(deItem, null, chest.count(deItem), function(err) {
			if (err) {
				fakeConsole("Error withdrawing items.", "error");
			} else {
				fakeConsole("Withdrawing " + deItem + ".", "info");
				chestClear(i += 1);
			}
		});
	} else {
        setTimeout(chest.close, 1000);
		setTimeout(function() {fakeConsole("Finished withdrawing items.", "info")}, 1000);
	}
}

//Find Block
function findBlock(type, size, point) {
    var block = null;
    var shortest = null;
    var x1 = Math.floor(point.x - size);
    var x2 = Math.floor(point.x + size);
    var y1 = Math.floor(point.y - size);
    var y2 = Math.floor(point.y + size);
    var z1 = Math.floor(point.z - size);
    var z2 = Math.floor(point.z + size);
    for (x = x1; x < x2; x++) {
        for (y = y1; y < y2; y++) {
            for (z = z1; z < z2; z++) {
                var cPoint = vec3(x, y, z);
                var cBlock = bot.blockAt(cPoint);
                if (cBlock) {
                    if (cBlock.name == type) {
                        if ((shortest > cPoint.distanceTo(point)) || shortest === null) {
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

function byName(name) {
	mcData.findItemOrBlockByName(name);
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

fakeConsole("Started inventory plugin.","info")
	
}
