module.exports.inject = inject;
var fs = require('fs');

function inject(bot) {

//Startup
var startup = [];
var repeat = [];
var time = [];
var userCommand = [];

//Load data
if (!fs.existsSync("./src/userdata/scheduler")) {fs.mkdirSync("./src/userdata/scheduler")}

if (fs.existsSync("./src/userdata/scheduler/bootCommands.txt")) {
	var startupTemp = fs.readFileSync("./src/userdata/scheduler/bootCommands.txt").toString();
	startup = startupTemp.split("|");
} else {
	fs.writeFile("./src/userdata/scheduler/bootCommands.txt", "", function(err) {if(err) {return console.log(err);}});
}
if (fs.existsSync("./src/userdata/scheduler/repeatCommands.txt")) {
	var repeatTemp = fs.readFileSync("./src/userdata/scheduler/repeatCommands.txt").toString();
	repeat = repeatTemp.split("|");
} else {
	fs.writeFile("./src/userdata/scheduler/repeatCommands.txt", "", function(err) {if(err) {return console.log(err);}});
}
if (fs.existsSync("./src/userdata/scheduler/repeatTime.txt")) {
	var timeTemp = fs.readFileSync("./src/userdata/scheduler/repeatTime.txt").toString();
	time = timeTemp.split("|");
} else {
	fs.writeFile("./src/userdata/scheduler/repeatTime.txt", "", function(err) {if(err) {return console.log(err);}});
}

//Start and run Commands
bot.on('login', function() {
	fakeConsole("Executing scheduled commands...", "info")
	if (startup[0] !== "") {setTimeout(function() { startBoot() }, 1000)}
	if (repeat[0] !== "") {setTimeout(function() { startLoop() }, 1000)}
});

function startBoot() {
	for (i = 0; i < startup.length; i++) {
		if (startup[i].startsWith("^")) {
				var sendString = startup[i].substring(1);
				fakeConsole("Running C-B command \"" + sendString + "\"", "info")
				bot.whisper(bot.username, sendString)
			} else {
				fakeConsole("Running command/chat \"" + startup[i] + "\"", "info")
				bot.chat(startup[i])
			}
		}
	}
function startLoop() {
	for (i = 0; i < repeat.length; i++) {
		fakeConsole("Set the command/message \"" + repeat[i] + "\" to be sent every " + time[i] + " seconds.", "info")
		doLoop(repeat[i], time[i])
	}
}

function doLoop(command,time) {
	var command = arguments[0]
	var time = arguments[1]
	
	if (command.startsWith("^")) {
		fakeConsole("Running the C-B command \"" + command + "\"", "info")
		bot.whisper(bot.username, command)
	} else {
		fakeConsole("Running the command/message \"" + command + "\"", "info")
		bot.chat(command)
	}
	setTimeout(function() { doLoop(command,time) }, time * 1000)
}

//Commands
bot.on('whisper', function(username, message) {
	userCommand = splitWithTail(message," ",3)
	startCommand = splitWithTail(message," ",2)
	//schedule repeat <seconds> <command>
	if (userCommand[0] == "schedule" && userCommand[1] == "repeat") {
		if (userCommand[2] != "" && userCommand[3] != "") {
			repeat.push(userCommand[3]);
			time.push(userCommand[2]);
			fakeConsole("Set \"" + userCommand[3] + "\" to be repeated every " + userCommand[2] + " seconds.", "info")
			bot.whisper(username,"Added to schedule. More info is in the console.")
			doLoop(userCommand[3], userCommand[2])
		} else {
			fakeConsole("schedule repeat <command/message> <seconds>", "error")
			bot.whisper(username,"schedule repeat <seconds> <command/message>")
		}
	}
	//schedule start <command>
	if (userCommand[0] == "schedule" && userCommand[1] == "start") {
		if (startCommand.length >= 3) {
			startup.push(startCommand[2]);
			fakeConsole("Set \"" + startCommand[2] + "\" to run on bot startup.", "info")
			bot.whisper(username,"Added to schedule. More info is in the console.")
		} else {
			fakeConsole("schedule start <command/message>", "error")
			bot.whisper(username,"schedule start <seconds> <command/message>")
		}
	}
	//schedule save
	if (userCommand[0] == "schedule" && userCommand[1] == "save") {
		//Start
		bot.whisper(username,"Saving schedule...")
		fakeConsole("Saving start commands...", "info")
		savestringTemp = startup.toString();
		savestringTemp0 = savestringTemp.replace(/,/g, "|");
		savestring = savestringTemp0.substring(1);
		fs.writeFile("./src/userdata/scheduler/bootCommands.txt", savestring, function(err) {if(err) {return console.log(err);}});
		//repeat
		fakeConsole("Saving repeat commands...", "info")
		savestringTemp = repeat.toString();
		savestringTemp0 = savestringTemp.replace(/,/g, "|");
		savestring = savestringTemp0.substring(1);
		fs.writeFile("./src/userdata/scheduler/repeatCommands.txt", savestring, function(err) {if(err) {return console.log(err);}});
		//repeat time
		fakeConsole("Saving repeat time...", "info")
		savestringTemp = time.toString();
		savestringTemp0 = savestringTemp.replace(/,/g, "|");
		savestring = savestringTemp0.substring(1);
		fs.writeFile("./src/userdata/scheduler/repeatTime.txt", savestring, function(err) {if(err) {return console.log(err);}});
		fakeConsole("Saved schedule.", "info")
		bot.whisper(username,"Saved schedule.")
	}
});

//Split and tail
function splitWithTail(str,delim,count){
  var parts = str.split(delim);
  var tail = parts.slice(count).join(delim);
  var result = parts.slice(0,count);
  result.push(tail);
  return result;
}

//Fake console
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

fakeConsole("Started schedule plugin.","info")
 
}
