module.exports.inject = inject;

function inject(bot) {

bot.on('kicked', function() {
    autoRestart()
    });
bot.on('end', function() {
	autoRestart()
	});

function autoRestart() {
	fakeConsole("Automatically restarting...","info")
	bot.quit()
	window.location.reload(1)
	location.reload()
	window.location.reload(1)
	location.reload()
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

fakeConsole("Started automatic reconnect plugin.","info")
 
}
