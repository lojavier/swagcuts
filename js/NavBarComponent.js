class NavBarComponent
{
    constructor(app)
    {
    	var m_rootContainer;
    	var m_navBarContainer;
    	var m_bottomShadowContainer;
    	var m_mainLogoContainer;
    	var m_menuContainer;
    	var m_contactNumberContainer;
    	var m_mainLogoSprite;
    	var m_background;
    	var m_shadow;
    	var m_contactRect;
    	var m_contactTextComponent;
    	var m_contactText;
    	var m_menuOptions = ['Home','About Me','My Services','Contact'];
    	var m_menuTextComponents = [];
    	var m_menuTextContainers = [];
    	var m_selectedMenuOptionIndex = 0;
    	
    	// this.addNavBarMask = function()
     //    {
     //        var visibleAreaX = -m_railX;
     //        var visibleAreaY = m_railY-55;
     //        var visibleAreaWidth = m_railX + (Aspect.nPosterNumber * Aspect.nMoviePosterWidth) + ((Aspect.nPosterNumber+3) * Aspect.nPostergap);
     //        var visibleAreaHeight = Aspect.nMoviePosterHeight * 1.4;

     //        var posterVisibleArea = new PIXI.Graphics();
     //        posterVisibleArea.clear();
     //        posterVisibleArea.beginFill(0x000000, 0);
     //        posterVisibleArea.drawRect(visibleAreaX, visibleAreaY, visibleAreaWidth, visibleAreaHeight);
     //        posterVisibleArea.lineStyle(0);
     //        posterVisibleArea.endFill();
     //        posterVisibleArea.position.set(0, 0);

     //        var maskContainer = new PIXI.Container();
     //        maskContainer.addChild(posterVisibleArea);
     //        m_rootContainer.addChild(maskContainer);
     //        m_posterRailContainer.mask = posterVisibleArea;
     //    }

    	this.drawNavBar = function()
    	{
    		var posY = Aspect.MOBILE ? Aspect.contactNumberHeight : 0;
    		m_navBarContainer = new PIXI.Container();
    		m_navBarContainer.position.set(0, posY);

    		m_background = new PIXI.Sprite(Aspect.whiteBackgroundTexture);
            m_background.width = Aspect.screenWidth;
            m_background.height = Aspect.navBarHeight;
            m_background.tint = Aspect.navBarBackgroundColor;

            m_navBarContainer.addChild(this.drawBottomShadow());
            m_navBarContainer.addChild(m_background);
    		m_navBarContainer.addChild(this.addMainLogo());
    		m_navBarContainer.addChild(this.addContactNumber());
    		m_navBarContainer.addChild(this.addMenuOptions());

    		return m_navBarContainer;
    	};

    	this.drawBottomShadow = function()
    	{
            m_bottomShadowContainer = new PIXI.Container();
    		m_bottomShadowContainer.position.set(0, Aspect.navBarHeight);

            var shadowWidth = Aspect.screenWidth;
            var shadowHeight = Aspect.navBarShadowHeight;
            var alphaDiff = 1 / shadowHeight;
            var alphaValue = 1;
            var shadowGraphic = new PIXI.Graphics();
            shadowGraphic.tint = 0x000000;
            shadowGraphic.alpha = 0.5;

            for (var row = 0; row < shadowHeight; ++row)
            {
                shadowGraphic.lineStyle(1, 0xFFFFFF, alphaValue);
                shadowGraphic.moveTo(0, row);
                shadowGraphic.lineTo(shadowWidth, row);

                alphaValue -= alphaDiff;
            }
            shadowGraphic.endFill();
            m_bottomShadowContainer.addChild(shadowGraphic);

            return m_bottomShadowContainer;

            // m_bottomShadowContainer = new PIXI.Container();
    		// m_bottomShadowContainer.position.set(0, Aspect.navBarHeight);

    		// m_bottomShadowContainer = new PIXI.Container();
    		// m_bottomShadowContainer.position.set(0, Aspect.navBarHeight);

    		// m_shadow = new PIXI.Sprite(Aspect.whiteBackgroundTexture);
      //       m_shadow.width = Aspect.screenWidth;
      //       m_shadow.height = Aspect.navBarShadowHeight;
      //       m_shadow.tint = Aspect.navBarShadowColor;
      //       m_shadow.alpha = 0.2;
      //       m_bottomShadowContainer.addChild(m_shadow);

    		// return m_bottomShadowContainer;
    	};

    	this.addMainLogo = function()
    	{
    		m_mainLogoContainer = new PIXI.Container();
    		m_mainLogoContainer.position.set(Aspect.screenWidth*Aspect.navBarEdgeRatio, Aspect.navBarHeight/2);
    		m_mainLogoContainer.pivot.set(0, Aspect.mainLogoSize/2);
    		m_mainLogoContainer.interactive = true;

    		m_mainLogoSprite = new PIXI.Sprite.fromImage(Aspect.swagCutsMainLogoImage);
    		m_mainLogoSprite.width = Aspect.mainLogoSize;
    		m_mainLogoSprite.height = Aspect.mainLogoSize;
    		if(!m_mainLogoSprite.texture.baseTexture.hasLoaded)
	        {
	            m_mainLogoSprite.texture.baseTexture.on('loaded', function()
	            {
	                m_mainLogoContainer.addChild(m_mainLogoSprite);
	            });
	        }
	        else
	        {
	        	m_mainLogoContainer.addChild(m_mainLogoSprite);
	        }

	        m_mainLogoContainer
		        .on('pointerover', function()
		        {
		        	this.cursor = "hover";
		        })
		        .on('pointerdown', function()
		        {
		        	this.cursor = "default";
		        })
		        .on('pointerup', function()
		        {
		        	this.cursor = "hover";
		        })
		        .on('click', function()
		        {
		        	window.location.href = Aspect.websiteURL;
		        })
		        .on('tap', function()
		        {
		        	window.location.href = Aspect.websiteURL;
		        });
            
            return m_mainLogoContainer;
    	};

    	this.formatPhoneNumber = function(phonenumber, format)
    	{
    		var formattedPhoneNumber = null;
    		switch(format)
    		{
    			case 0:
    				formattedPhoneNumber = phonenumber.substring(0,3) + "-" + phonenumber.substring(3,6) + "-" + phonenumber.substring(6,10);
    				break;

				case 1:
					formattedPhoneNumber = "(" + phonenumber.substring(0,3) + ") " + phonenumber.substring(3,6) + "-" + phonenumber.substring(6,10);
					break;

    			default:
    				formattedPhoneNumber = phonenumber;
    				break;
    		}

    		return formattedPhoneNumber;
    	};

    	this.addContactNumber = function()
    	{
	    	var posX = Aspect.MOBILE ? 0 : Aspect.screenWidth * (1-Aspect.navBarEdgeRatio);
	    	var posY = Aspect.MOBILE ? -Aspect.contactNumberHeight : 0;
	    	var pivotPosX = Aspect.MOBILE ? 0 : Aspect.contactNumberWidth;

    		m_contactNumberContainer = new PIXI.Container();
    		m_contactNumberContainer.position.set(posX, posY);
    		m_contactNumberContainer.pivot.set(pivotPosX, 0);

    		m_contactRect = new PIXI.Sprite(Aspect.whiteBackgroundTexture);
            m_contactRect.width = Aspect.contactNumberWidth;
            m_contactRect.height = Aspect.contactNumberHeight;
            m_contactRect.tint = Aspect.contactNumberBackgroundColor;
            m_contactNumberContainer.addChild(m_contactRect);

            m_contactTextComponent = new TextComponent(
        		app,
                m_contactRect.width/2,
                m_contactRect.height/2,
                m_contactRect.width,
                m_contactRect.height,
                this.formatPhoneNumber(Aspect.groomerPhoneNumber, 0),
                'Georgia, serif',
                Aspect.contactNumberTextSize,
                Aspect.contactNumberTextColor,
                Aspect.contactNumberTextColor,
                'center-middle',
                false
            );
            m_contactNumberContainer.addChild(m_contactTextComponent.getText());

    		return m_contactNumberContainer;
    	};

    	this.addMenuOptions = function()
    	{
    		var logoRightPosX = m_mainLogoContainer.position.x + m_mainLogoSprite.width;
    		var contactLeftPosX = m_contactNumberContainer.position.x - m_contactNumberContainer.width;
    		var menuPosX = logoRightPosX + ((contactLeftPosX-logoRightPosX)/2);

    		m_menuContainer = new PIXI.Container();
    		m_menuContainer.position.set(menuPosX, Aspect.navBarHeight/2);

    		var textPosX = 0;
    		for(var i = 0; i < m_menuOptions.length; ++i)
    		{
    			var selected = (i == 0);
    			m_menuTextComponents[i] = new TextComponent(
	        		app,
	                textPosX,
	                0,
	                0,
	                0,
	                m_menuOptions[i],
	                'Comic Sans MS',
	                Aspect.navBarMenuTextSize,
	                Aspect.navBarMenuTextNonFocusColor,
	                Aspect.navBarMenuTextFocusColor,
	                'left-middle',
	                true,
	                selected
	            );
	            var text = m_menuTextComponents[i].getText();
	            m_menuContainer.addChild(text);
	            text
	            	.on('pointerover', function()
			        {
			        	this.cursor = "hover";
			        })
			        .on('pointerover', function()
			        {
			        	this.setFocus(true);
			        }.bind(m_menuTextComponents[i]))
			        .on('pointerout', function()
			        {
			        	this.setFocus(false);
			        }.bind(m_menuTextComponents[i]))
			        .on('pointerdown', function()
			        {
			        	this.cursor = "default";
			        })
			        .on('pointerup', function()
			        {
			        	this.cursor = "hover";
			        })
			        .on('pointertap', function()
			        {
			        	// window.location.href = Aspect.websiteURL;
			        })
			        .on('tap', function()
			        {
			        	// window.location.href = Aspect.websiteURL;
			        });
	            textPosX += m_menuTextComponents[i].getWidth() + Aspect.navBarMenuTextSpacingX;
    		}
    		m_menuContainer.pivot.set(m_menuContainer.width/2, 0);

    		return m_menuContainer;
    	};

    	this.initNavBar = function()
    	{
    		m_rootContainer = new PIXI.Container();
    		m_rootContainer.addChild(this.drawNavBar());
    	};

    	this.getRootContainer = function()
    	{
    		return m_rootContainer;
    	};

    	this.refresh = function()
    	{
   			m_rootContainer.removeChildren();
    		m_rootContainer.addChild(this.drawNavBar());
    	};

    	this.initNavBar();
    }
};