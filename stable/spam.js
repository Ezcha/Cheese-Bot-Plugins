module.exports.inject = inject;

function inject(bot) {

var spamMessage = ""
var count = 0
var countSecondary = 0

bot.on('whisper', function(username, message) {
	if (message.startsWith("dospam ")) {
		spamMessage = message.substring(7)
		fakeConsole(username + " enabled spam mode!", "info")
		setTimeout(saySpam(), 500)
	}
})

function saySpam() {
	count += 1
	countSecondary += 1
	if (count == 14) {
		count = 0
		setTimeout(function() { saySpam() }, 4000)
	} else {
		if (countSecondary == 22) {
			setTimeout(function() { saySpam() }, 7000)
		} else {
			if (spamMessage.substring(0, 1) == "/") {
				bot.chat(spamMessage)
			} else {
				bot.chat(makeid() + "[ " + spamMessage + " ]" + makeid())
			}
			setTimeout(function() { saySpam() }, 500)
		}
	}
}

function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
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

fakeConsole("Started spam plugin.","info")
 
}
