var Aspect = null;
var mobileMinimumPixels = 420;
// var MOBILE = (window.innerWidth < mobileMinimumPixels);
var MOBILE = false;

var isMobileDevice = function()
{
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

var reloadViewAspect = function()
{
	// MOBILE = (window.innerWidth < mobileMinimumPixels);
	MOBILE = isMobileDevice();
	Aspect = {
		// screen dimensions / global
		MOBILE : MOBILE,
		screenWidth : window.innerWidth,
		screenHeight : window.innerHeight,
		whiteBackgroundTexture : PIXI.Texture.WHITE,

		// NavBarComponent
		mainLogoSize : MOBILE?180:85,
		navBarBackgroundColor : 0xFFFFFF,
		navBarHeight : MOBILE?200:100,
		navBarShadowColor : 0x000000,
		navBarShadowHeight : MOBILE?24:12,
		contactNumberWidth : MOBILE?window.innerWidth:160,
		contactNumberHeight : MOBILE?120:60,
		contactNumberBackgroundColor : 0x000000,
		contactNumberTextSize : MOBILE?60:22,
		contactNumberTextColor : 0xFFFFFF,
		navBarEdgeRatio : MOBILE?0.05:0.08,
		navBarMenuTextSize : MOBILE?24:20,
		navBarMenuTextPositionX : MOBILE?0:20,
		navBarMenuTextPositionY : MOBILE?0:20,
		navBarMenuTextSpacingX : MOBILE?0:40,
		navBarMenuTextSpacingY : MOBILE?40:0,
		navBarMenuTextNonFocusColor : 0x000000,
		navBarMenuTextFocusColor : 0xFF7648,

		// HomeComponent
		// homeBackgroundColor : 0x00edda,
		homeBackgroundColor : 0xFBE8A4,

		// contact info
		// websiteURL : 'https://www.swagcuts.com/',
		websiteURL : 'http://192.168.1.64:8080/',
		groomerFirstName : 'Danielle',
		groomerLastName : 'Gonzalez',
		groomerPhoneNumber : '9095698490',
		groomerEmail : 'danielle.gonzalez519@gmail.com',

		// images
		swagCutsMainLogoImage : '../images/swag-cuts-main-logo.png',
	};
}

reloadViewAspect();