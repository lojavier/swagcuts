// https://pixijs.io/pixi-text-style/#
class TextComponent
{
    constructor(app, posx, posy, width, height, text, fontfamily, fontsize, nonfocuscolor, focuscolor, backgroundnonfocuscolor, backgroundfocuscolor, alignment = 'left', interactive = false)
    {
	    var m_posX = posx;
	    var m_posY = posy;
    	var m_width = width;
    	var m_height = height;
    	var m_text = text;
    	var m_fontFamily = fontfamily;
    	var m_fontSize = fontsize;
    	var m_nonFocusColor = nonfocuscolor;
    	var m_focusColor = focuscolor;
    	var m_backgroundNonFocusColor = backgroundnonfocuscolor;
    	var m_backgroundFocusColor = backgroundfocuscolor;
    	var m_align = alignment;
    	var m_interactive = interactive;
    	var m_scaleText = 1;
    	var m_textStyle;
    	var m_pixiText;
    	var m_focusDuration = 200;
    	var m_currentColor;
        var m_targetColor;

    	var m_colorLerpTicker = 0;
	    var m_fadeText = false;
	    var m_style;

	    this.getText = function()
	    {
	    	return m_pixiText;
	    };

	    this.initTextComponent = function()
	    {
	        m_textStyle = new PIXI.TextStyle(
	        {
                fontFamily: m_fontFamily,
                fontSize: m_fontSize * m_scaleText,
                fill: m_nonFocusColor,
                align: m_align,
            });

	        m_pixiText = new PIXI.Text(m_text, m_textStyle);
	        m_pixiText.x = m_posX;
	        m_pixiText.y = m_posY;
	        m_pixiText.interactive = m_interactive;

	        if(m_align == 'left')
	        {
				m_pixiText.anchor.set(0, 0.5);
	        }
	        else if(m_align == 'center')
	        {
				m_pixiText.anchor.set(0.5, 0.5);
	        }
	        else if(m_align == 'right')
	        {
	        	m_pixiText.anchor.set(1, 0.5);
	        }

	        if(m_interactive)
	        {
		        m_pixiText
		        	.on('pointerover', function()
			        {
			        	// this.setFocus(true);
			        	this.cursor = "hover";
			        	console.log("pointerover " + m_text);
			        })
			        .on('pointerout', function()
			        {
			        	// this.setFocus(false);
			        	console.log("pointerout " + m_text);
			        })
			        .on('pointerdown', function()
			        {
			        	this.cursor = "default";
			        })
			        .on('pointerup', function()
			        {
			        	this.cursor = "hover";
			        });
		    }
	    };

	    this.getHeight = function()
	    {
	        var textMetrics = PIXI.TextMetrics.measureText(m_text, m_textStyle);
	        return textMetrics.height;
	    }

	    this.getWidth = function()
	    {
	        var textMetrics = PIXI.TextMetrics.measureText(m_text, m_textStyle);
	        return textMetrics.width;
	    }

	    this.setFocus = function(focus)
	    {
	    	var focusTween = PIXI.tweenManager.createTween(m_textStyle);
	    	//focusTween.stop().clear();
	    	focusTween.loop = false;
	    	focusTween.expire = true;
	        focusTween.time = m_focusDuration;
	        focusTween.easing = PIXI.tween.Easing.outSine();

	        m_nonFocusColor = m_textStyle.fill;
	        m_targetColor = focus ? m_focusColor : m_nonFocusColor;

	        var ar, ag, ab, br, bg, bb;
	        focusTween.on('start', function()
            {
                ar = m_currentColor >> 16, ag = m_currentColor >> 8 & 0xff, ab = m_currentColor & 0xff,
                br = m_targetColor >> 16, bg = m_targetColor >> 8 & 0xff, bb = m_targetColor & 0xff;
            });
	        focusTween.on('update', function(delta)
            {
                var tick = (delta/m_focusDuration).toPrecision(2);
                if(tick != m_colorLerpTicker)
                {
                    m_colorLerpTicker = tick;
                    var rr = Math.round((1 - m_colorLerpTicker) * ar + m_colorLerpTicker * br);
                    var rg = Math.round((1 - m_colorLerpTicker) * ag + m_colorLerpTicker * bg);
                    var rb = Math.round((1 - m_colorLerpTicker) * ab + m_colorLerpTicker * bb);
                    m_textStyle.fill = ((rr << 16) + (rg << 8) + rb);
                }
            });

	        focusTween.start();
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