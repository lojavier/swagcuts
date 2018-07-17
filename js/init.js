// https://www.shutterstock.com/image-vector/scissors-icon-337423679?src=Ar1lLQuiXesuyWhO9iQYjA-1-2
// Alice Font
var m_app;
var m_rootContainer;
var m_navBarComponent;

var init = function()
{
	m_app = new PIXI.Application(
		Aspect.screenWidth,
		Aspect.screenHeight,
		{
			backgroundColor : 0x1099bb
		});
	document.body.appendChild(m_app.view);
	var defaultIcon = "url('./images/scissors-closed-pointer.png'),auto";
	var hoverIcon = "url('./images/scissors-opened-pointer.png'),auto";
	m_app.renderer.plugins.interaction.cursorStyles.default = defaultIcon;
	m_app.renderer.plugins.interaction.cursorStyles.hover = hoverIcon;
	m_app.screen.cursor = "default";

	m_rootContainer = new PIXI.Container();
	m_rootContainer.cursor = "default";
	m_app.stage.addChild(m_rootContainer);

	m_navBarComponent = new NavBarComponent(m_app);
	m_rootContainer.addChild(m_navBarComponent.getRootContainer());

	addTicker();
};

var addTicker = function()
{
    m_app.ticker.add(function()
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
	m_app.renderer.resize(Aspect.screenWidth, Aspect.screenHeight);
	m_navBarComponent.refresh();
};

init();