class NavBarComponent
{
    constructor(app)
    {
    	var m_rootContainer;
    	var m_navBarContainer;
    	var m_bottomShadowContainer;
    	var m_mainLogoContainer;
    	var m_contactNumberContainer;
    	var m_mainLogoSprite;
    	var m_background;
    	var m_shadow;
    	var m_contactRect;
    	var m_contactTextComponent;
    	var m_contactText;
    	
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

    		return m_navBarContainer;
    	};

    	this.drawBottomShadow = function()
    	{
    		m_bottomShadowContainer = new PIXI.Container();
    		m_bottomShadowContainer.position.set(0, Aspect.navBarHeight);

    		m_shadow = new PIXI.Sprite(Aspect.whiteBackgroundTexture);
            m_shadow.width = Aspect.screenWidth;
            m_shadow.height = Aspect.navBarShadowHeight;
            m_shadow.tint = Aspect.navBarShadowColor;
            m_shadow.alpha = 0.2;
            m_bottomShadowContainer.addChild(m_shadow);

    		return m_bottomShadowContainer;
    	};

    	this.addMainLogo = function()
    	{
    		m_mainLogoContainer = new PIXI.Container();
    		m_mainLogoContainer.position.set(Aspect.screenWidth*Aspect.navBarEdgeRatio, Aspect.navBarHeight/2);
    		m_mainLogoContainer.pivot.set(0, Aspect.mainLogoSize/2);
    		m_mainLogoContainer.interactive = true;

    		m_mainLogoSprite = new PIXI.Sprite.fromImage(Aspect.swagCutsMainLogoImage)
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
		        	m_mainLogoContainer.cursor = "hover";
		        })
		        .on('pointerdown', function()
		        {
		        	m_mainLogoContainer.cursor = "default";
		        })
		        .on('pointerup', function()
		        {
		        	m_mainLogoContainer.cursor = "hover";
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
                Aspect.contactNumberTextColor,
                Aspect.contactNumberTextColor,
                'center'
            );
            m_contactNumberContainer.addChild(m_contactTextComponent.getText());

    		return m_contactNumberContainer;
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

    	// this.setFocus = function(focus, callback)
     //    {
     //        m_focused = focus;
     //        m_cellTargetColor = focus ? m_cellFocusedColor : m_cellNonfocusedColor;
     //        m_cellCurrentColor = m_background.tint;

     //        if(!m_backgroundColorTween)
     //        {
     //            var ar, ag, ab, br, bg, bb;
     //            m_backgroundColorTween = PIXI.tweenManager.createTween(m_background);
     //            m_backgroundColorTween.on('start', function()
     //                {
     //                    ar = m_cellCurrentColor >> 16, ag = m_cellCurrentColor >> 8 & 0xff, ab = m_cellCurrentColor & 0xff,
     //                    br = m_cellTargetColor >> 16, bg = m_cellTargetColor >> 8 & 0xff, bb = m_cellTargetColor & 0xff;
     //                });
     //            m_backgroundColorTween.on('update', function(delta)
     //                {
     //                    var tick = (delta/m_colorLerpDuration).toPrecision(2);
     //                    if(tick != m_colorLerpTicker)
     //                    {
     //                        m_colorLerpTicker = tick;
     //                        var rr = Math.round((1 - m_colorLerpTicker) * ar + m_colorLerpTicker * br);
     //                        var rg = Math.round((1 - m_colorLerpTicker) * ag + m_colorLerpTicker * bg);
     //                        var rb = Math.round((1 - m_colorLerpTicker) * ab + m_colorLerpTicker * bb);
     //                            m_background.tint = ((rr << 16) + (rg << 8) + rb);
     //                        }
     //                        else if(tick == 1)
     //                        {
     //                            m_background.tint = m_cellTargetColor;
     //                        }
     //                });
     //            m_backgroundColorTween.on('end', function()
     //                {
     //                    m_cellColor = m_background.tint;
     //                    // if(m_focused) callback();
     //                });
     //        }

     //        m_backgroundColorTween.stop().clear();
     //        m_backgroundColorTween.time = m_colorLerpDuration;
     //        m_backgroundColorTween.easing = focus ? PIXI.tween.Easing.inSine() : PIXI.tween.Easing.outSine();
     //        m_backgroundColorTween.start();

     //        if(m_titleTextComponent) m_titleTextComponent.setFocus(focus);
     //        if(m_subtitleTextComponent) m_subtitleTextComponent.setFocus(focus);
     //        if(m_ChannelNumTextComponent) m_ChannelNumTextComponent.setFocus(focus);
     //        if((m_programIcon && m_programIcon.visible) || (m_fav1Icon && m_fav1Icon.visible) || (m_fav2Icon && m_fav2Icon.visible))
     //        {
     //          this.setFocusToIcons(focus);
     //        }

     //        if (m_info && m_isRealApp)
     //            PIXI_LOG && console.log(`setFocus(${focus}): ${this.getProgramName()} start-${m_info.startTime} duration:${m_info.duration} tint:${m_cellCurrentColor}-${m_cellTargetColor}`);
     //    }

    	this.initNavBar();
    }
};