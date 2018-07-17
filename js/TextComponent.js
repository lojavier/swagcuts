class TextComponent
{
    constructor(app, width, height, text, fontfamily, fontsize, nonfocuscolor, focuscolor, backgroundfocuscolor, backgroundnonfocuscolor, alignment = 'left')
    {
    	var m_width = width;
    	var m_height = height;
    	var m_text = text;
    	var m_fontFamily = fontfamily;
    	var m_fontSize = fontsize;
    	var m_nonFocusColor = nonfocuscolor;
    	var m_focusColor = focuscolor;
    	var m_backgroundFocusColor = backgroundfocuscolor;
    	var m_backgroundNonFocusColor = backgroundnonfocuscolor;
    	var m_align = alignment;
    	var m_rootContainer;
    	var m_textStyle;

	    this.getTextComponent = function()
	    {
	    	return m_textStyle;
	    };

	    this.initTextComponent = function()
	    {
	        m_textStyle = new PIXI.TextStyle({
                fontFamily: fontfamily,
                fontSize: m_fontSize * m_scaleText,
                fill: m_noFocusColor,
                align: m_align
            });
	        var text = this.getText(m_text, m_width);
	        m_pixiText =  new PIXI.Text(text, m_style);

	        if(m_align == 'right')
	        {
	          m_xPos = m_width - x - this.width();
	        }
	        else if(m_align == 'center')
	        {
	          m_xPos = (m_width - this.width())/2;
	        }

	        m_pixiText.x = m_xPos;
	        m_pixiText.y = m_yPos;

	        /*m_textSprite = new PIXI.Sprite();
	        m_textSprite.addChild(m_pixiText.texture);
	        m_pixiText.anchor.x = m_pixiText.anchor.y = 0.5;

	        m_textSprite.position.x = m_xPos + 10;
	        m_textSprite.position.y = m_yPos;
	        m_textSprite.scale.set(1/m_scaleText);// = 10;
	        m_textSprite.height = 10;*/
	    };
	    
	    /*
	    this.setFocus = function(focus)
	    {
	        var focusTween = PIXI.tweenManager.createTween(m_style);
	        focusTween.expire = true;
	        //focusTween.stop().clear();
	        focusTween.time = m_focusDuration;
	        focusTween.easing = PIXI.tween.Easing.outSine();
	        focusTween.loop = false;
	        var targetcolor = m_noFocusColor;
	        var fadecolor = backgroundNonfocuscolor;
	        var curfadecolor;
	        var cr,cg,cb,dr,dg,db;
	        if(focus)
	        {
	            targetcolor = m_focusColor;
	            fadecolor = backgroundfocuscolor;
	        }
	        var currentColor = m_style.fill;
	        if(m_fadeText)
	        {
	            currentColor = m_style.fill[0];
	            curfadecolor = m_style.fill[1];
	        }
	        var ar = parseInt(currentColor.slice(1, 3), 16),
	        ag = parseInt(currentColor.slice(3, 5), 16),
	        ab = parseInt(currentColor.slice(5, 7), 16),
	        br = targetcolor >> 16, bg = targetcolor >> 8 & 0xff, bb = targetcolor & 0xff;
	        if(m_fadeText)
	        {
	            cr = parseInt(curfadecolor.slice(1, 3), 16),
	            cg = parseInt(curfadecolor.slice(3, 5), 16),
	            cb = parseInt(curfadecolor.slice(5, 7), 16),
	            dr = fadecolor >> 16, dg = fadecolor >> 8 & 0xff, db = fadecolor & 0xff;
	        }
	        focusTween.on('update', function(delta)
	        {
	            var tick = (delta/m_focusDuration).toPrecision(2);

	            if(tick == 1)
	            {
	                m_style.fill = [targetcolor,targetcolor];
	            }else if(tick != m_colorLerpTicker)
	            {
	                m_colorLerpTicker = tick;
	                var rr = Math.round((1 - m_colorLerpTicker) * ar + m_colorLerpTicker * br);
	                var rg = Math.round((1 - m_colorLerpTicker) * ag + m_colorLerpTicker * bg);
	                var rb = Math.round((1 - m_colorLerpTicker) * ab + m_colorLerpTicker * bb);

	                if(m_fadeText)
	                {
	                    var cdr = Math.round((1 - m_colorLerpTicker) * cr + m_colorLerpTicker * dr);
	                    var cdg = Math.round((1 - m_colorLerpTicker) * cg + m_colorLerpTicker * dg);
	                    var cdb = Math.round((1 - m_colorLerpTicker) * cb + m_colorLerpTicker * db);

	                    m_style.fill = [((rr << 16) + (rg << 8) + rb), ((cdr << 16) + (cdg << 8) + cdb)];
	                }
	                else
	                {
	                    m_style.fill = ((rr << 16) + (rg << 8) + rb);
	                }
	            }
	        });
	        focusTween.start();
	    };
	    */

	    this.initTextComponent();
    }
};