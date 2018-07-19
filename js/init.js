// https://www.shutterstock.com/image-vector/scissors-icon-337423679?src=Ar1lLQuiXesuyWhO9iQYjA-1-2
// Alice Font
var app;
var m_rootContainer;
var m_navBarComponent;

var init = function()
{
	app = new PIXI.Application(
		Aspect.screenWidth,
		Aspect.screenHeight,
		{
			backgroundColor : 0x1099bb
		});
	document.body.appendChild(app.view);
	var defaultIcon = "url('./images/scissors-closed-pointer.png'),auto";
	var hoverIcon = "url('./images/scissors-opened-pointer.png'),auto";
	app.renderer.plugins.interaction.cursorStyles.default = defaultIcon;
	app.renderer.plugins.interaction.cursorStyles.hover = hoverIcon;
	app.screen.cursor = "default";
	app.stage
		.on('pointerover', function()
	    {
	    	app.screen.cursor = "default";
	    })
		.on('pointermove', function()
	    {
	    	app.screen.cursor = "default";
	    });

	m_rootContainer = new PIXI.Container();
	app.stage.addChild(m_rootContainer);

	m_navBarComponent = new NavBarComponent(app);
	m_rootContainer.addChild(m_navBarComponent.getRootContainer());

	addTicker();
};

var addTicker = function()
{
    app.ticker.add(function()
	{
		if(Aspect.screenWidth != window.innerWidth || Aspect.screenHeight != window.innerHeight)
		{
			refreshSizing();
		}
	});
};

var refreshSizing = function()
{
	reloadViewAspect();
	app.renderer.resize(Aspect.screenWidth, Aspect.screenHeight);
	m_navBarComponent.refresh();
};

init();