module.exports.inject = inject;
 
function inject(bot) {

 
    var followers = [];
    var loop;
    var leader;
	var usernames = []; ////Unused for now, will be used to store alt lists into arrays
	var passwords = []; ////Unused for now, will be used to store alt lists into arrays
 
bot.on('whisper', function(username, message) {
    if (message == "leader") {
      leader = bot.username
	  bot.chat("/msg " + username + " The bot " + leader + " is now a leader!")
    }
});
	
	
bot.on('whisper', function(username, message) {
        if (message.startsWith('recruit ')) {
            if (leader === bot.username) {
                bot.chat("/msg " + username + " You have recruited " + message.substring(8) + ". Thank you for signing them up!");
                followers.push(message.substring(8));
            } else {
                fakeConsole("This bot is not a leader! Please make them a leader by messaging them 'leader'.", "error");
            }
            }
       
        for (loop = 0; loop < followers.length; loop++) {
    bot.whisper(followers[loop], message);
}
       
        });			
 
 
    function fakeConsole(text, type) {
        document = doc = window.document;
        var text = arguments[0];
        var type = arguments[1];
        var para = document.createElement("P");
        var t = document.createTextNode(text);
        para.className = type;
        para.appendChild(t);
        document.getElementById('Space').appendChild(para);
        window.scrollTo(0, document.body.scrollHeight);
    }
  fakeConsole("Started teamwork plugin, made by Flarp. This plugin uses Cheesebot code, which was created by Minecheesecraft/Ezcha.", "info");
}
