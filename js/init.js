// https://www.shutterstock.com/image-vector/scissors-icon-337423679?src=Ar1lLQuiXesuyWhO9iQYjA-1-2
// Alice Font
var appNavbar;
var appMain;
// var m_rootContainer;
var m_navBarContainer;
var m_mainContainer;
var m_navBarComponent;
var m_homeComponent;

var m_defaultIcon = "url('./images/scissors-closed-pointer.png'),auto";
var m_hoverIcon = "url('./images/scissors-opened-pointer.png'),auto";

var init = function()
{
	appNavbar = new PIXI.Application(
		{
			width : Aspect.screenWidth,
			height : Aspect.screenHeight,
			// backgroundColor : 0xf8d559,
			backgroundColor : 0xFFFFFF,
			resolution : 2,
			roundPixels : true,
		});
	// document.body.appendChild(appNavbar.view);
	document.getElementById('navbar').appendChild(appNavbar.view);
	
	appNavbar.renderer.plugins.interaction.cursorStyles.default = m_defaultIcon;
	appNavbar.renderer.plugins.interaction.cursorStyles.hover = m_hoverIcon;
	appNavbar.screen.cursor = "default";
	appNavbar.stage
		.on('pointerover', function()
	    {
	    	appNavbar.screen.cursor = "default";
	    })
		.on('pointermove', function()
	    {
	    	appNavbar.screen.cursor = "default";
	    });

	m_navBarContainer = new PIXI.Container();
	appNavbar.stage.addChild(m_navBarContainer);

	m_navBarComponent = new NavBarComponent(appNavbar);
	m_navBarContainer.addChild(m_navBarComponent.getRootContainer());

	appNavbar.renderer.resize(Aspect.screenWidth, m_navBarContainer.height);

	// m_scrollingContainer = new PIXI.Container();

	// m_homeComponent = new HomeComponent(appNavbar);
	// m_scrollingContainer.addChild(m_homeComponent.getRootContainer());

	// m_rootContainer.addChild(m_scrollingContainer);
	// m_rootContainer.swapChildren(m_rootContainer.getChildAt(0), m_rootContainer.getChildAt(1));

	appMain = new PIXI.Application(
		{
			width : Aspect.screenWidth,
			height : Aspect.screenHeight,
			// backgroundColor : 0xf8d559,
			backgroundColor : 0xFFFFFF,
			resolution : 2,
			roundPixels : true,
		});
	// document.body.appendChild(appMain.view);
	document.getElementById('main').appendChild(appMain.view);
	
	appMain.renderer.plugins.interaction.cursorStyles.default = m_defaultIcon;
	appMain.renderer.plugins.interaction.cursorStyles.hover = m_hoverIcon;
	appMain.screen.cursor = "default";
	appMain.stage
		.on('pointerover', function()
	    {
	    	appMain.screen.cursor = "default";
	    })
		.on('pointermove', function()
	    {
	    	appMain.screen.cursor = "default";
	    });

	m_mainContainer = new PIXI.Container();
	appMain.stage.addChild(m_mainContainer);

	// m_scrollingContainer = new PIXI.Container();

	m_homeComponent = new HomeComponent(appMain);
	m_mainContainer.addChild(m_homeComponent.getRootContainer());

	// m_mainContainer.addChild(m_scrollingContainer);

	
	appMain.renderer.resize(Aspect.screenWidth, m_mainContainer.height);

	addTicker();

	animate();
};

var addTicker = function()
{
    appNavbar.ticker.add(function()
	{
		if(Aspect.screenWidth != window.innerWidth || Aspect.screenHeight != window.innerHeight)
		{
			refreshSizing();
		}
	});
};

var animate = function()
{
	window.requestAnimationFrame(animate);
	PIXI.tweenManager.update();
}

var refreshSizing = function()
{
	reloadViewAspect();
	m_navBarComponent.refresh();
	m_homeComponent.refresh();
	appNavbar.renderer.resize(Aspect.screenWidth, m_navBarContainer.height);
	appMain.renderer.resize(Aspect.screenWidth, m_mainContainer.height);
};

init();