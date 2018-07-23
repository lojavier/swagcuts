class HomeComponent
{
    constructor(app)
    {
    	var m_rootContainer;
    	var m_homeContainer;
    	var m_background;

    	this.drawHome = function()
    	{
    		var posY = Aspect.MOBILE ? Aspect.contactNumberHeight+Aspect.navBarHeight : Aspect.navBarHeight;
    		m_homeContainer = new PIXI.Container();
    		m_homeContainer.position.set(Aspect.screenWidth/2, posY);

    		m_background = new PIXI.Sprite(Aspect.whiteBackgroundTexture);
            m_background.width = Aspect.screenWidth-100;
            m_background.height = 2000;
            m_background.tint = Aspect.homeBackgroundColor;

            m_homeContainer.addChild(m_background);
            m_homeContainer.pivot.set(m_homeContainer.width/2, 0);


            var m_contactRect = new PIXI.Sprite(Aspect.whiteBackgroundTexture);
            m_contactRect.position.set(Aspect.screenWidth/2, 50);
            m_contactRect.width = 300;
            m_contactRect.height = Aspect.contactNumberHeight;
            m_contactRect.tint = Aspect.contactNumberBackgroundColor;
            m_homeContainer.addChild(m_contactRect);

      //       m_navBarContainer.addChild(this.drawBottomShadow());
      //       m_navBarContainer.addChild(m_background);
    		// m_navBarContainer.addChild(this.addMainLogo());
    		// m_navBarContainer.addChild(this.addContactNumber());
    		// m_navBarContainer.addChild(this.addMenuOptions());

    		return m_homeContainer;
    	};

    	this.initHome = function()
    	{
    		m_rootContainer = new PIXI.Container();
    		m_rootContainer.addChild(this.drawHome());
    	};

    	this.getRootContainer = function()
    	{
    		return m_rootContainer;
    	};

    	this.refresh = function()
    	{
   			m_rootContainer.removeChildren();
    		m_rootContainer.addChild(this.drawHome());
    	};

    	this.initHome();
    }
};