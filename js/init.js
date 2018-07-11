var app = new PIXI.Application(
	window.innerWidth, 
	window.innerHeight, 
	{
		backgroundColor : 0x1099bb
	});
document.body.appendChild(app.view);

var rootContainer = new PIXI.Container();
app.stage.addChild(rootContainer);

// app.ticker.add(function(delta) {
// });