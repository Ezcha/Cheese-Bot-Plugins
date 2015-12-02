module.exports.inject = inject;
function inject(bot) {

var doSentry = false
var checkLoop = null
var testEntity = null
var entityList = null
var entityMap = null
var master = null

bot.on("whisper", function(username, message) {
	if (message === "sentry") {
		if (doSentry === false) {
			doSentry = true
			master = username
			bot.whisper(username, "Sentry mode activated.")
			fakeConsole("Sentry mode activated.", "info")
			checkLoop = setInterval(sentryCheck, 500)
		} else {
			doSentry = false
			bot.whisper(username, "Sentry mode deactivated.")
			fakeConsole("Sentry mode deactivated.", "info")
			clearInterval(checkLoop)
		}
	}
})

function sentryCheck() {
	entityList = bot.entities
	entityMap = Object.keys(entityList).map(function(key) { return entityList[key]; }).filter(function(e) { return e.type != "object" && e.type != "orb" && [bot.username, master].indexOf(e.username)==-1 })
	testEntity = nearestEntity(entityMap)
	if (testEntity !== null) {
		bot.attack(testEntity)
	}
}

bot.on("death", function() {
	fakeConsole("Sentry mode deactivated.", "info")
	clearInterval(checkLoop)
})

function sameBlock(pos1,pos2)
{
	return pos1.floored().equals(pos2.floored());
}
function isNotEmpty(pos)
{
	return isBlockNotEmpty(bot.blockAt(pos));
}
function isBlockNotEmpty(b)
{
	return b!==null && b.boundingBox!=="empty";
}
function positionReachable(pos,params)
{
	return bot.navigate.findPathSync(pos,params).status === 'success';
}
function remove(a,e)
{
	return a.filter(function(v) { return v == e ? false : true;});
}
function visiblePosition(a,b)
{
	var v=b.minus(a);
	var t=Math.sqrt(v.x*v.x+v.y*v.y+v.z*v.z);
	v=v.scaled(1/t);
	v=v.scaled(1/5);
	var u=t*5;
	var na;
	for(var i=1;i<u;i++)
	{
		na=a.plus(v);
		if(!sameBlock(na,a))
		{
			if(isNotEmpty(na)) return false;
		}
		a=na;
	}
	return true;
}
function nearestReachableEntity(entities)
{
	var ent;
	while(1) // see if a too long computation couldn't cause problem (fork ?)
	{
		ent=nearestEntity(entities);
		if(!positionReachable(ent.position))
		{
			if(entities.length>1) entities=remove(entities,ent); // to change ?
			else return null;
		}
		else return ent;
	}
}
function nearestEntity(entities)
{
	var r=entities.reduce(function(acc,entity)
	{
		var d=entity.position.distanceTo(bot.entity.position);
		if(d<acc[1])
		{
			acc[0]=entity;
			acc[1]=d;
		}
		return acc;
	},[null,1000000]);
	return r[0];
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
fakeConsole("Started sentry plugin.", "info")
}
