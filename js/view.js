var Aspect = null;
var mobileMinimumPixels = 420;
// var MOBILE = (window.innerWidth < mobileMinimumPixels);
var MOBILE = (typeof window.orientation !== 'undefined');

var reloadViewAspect = function()
{
	// MOBILE = (window.innerWidth < mobileMinimumPixels);
	MOBILE = (typeof window.orientation !== 'undefined');
	Aspect = {
		// screen dimensions / global
		MOBILE : MOBILE,
		screenWidth : window.innerWidth,
		screenHeight : window.innerHeight,
		whiteBackgroundTexture : PIXI.Texture.WHITE,

		// NavBarComponent
		navBarBackgroundColor : 0xFFFFFF,
		navBarHeight : MOBILE?200:100,
		navBarShadowColor : 0x000000,
		navBarShadowHeight : MOBILE?8:6,
		swagCutsMainLogoSize : MOBILE?180:85,
		contactNumberWidth : MOBILE?window.innerWidth:160,
		contactNumberHeight : MOBILE?120:60,
		contactNumberBackgroundColor : 0x000000,
		navBarEdgeRatio : MOBILE?0.05:0.1,

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