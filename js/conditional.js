/* 
 * Copyright Yisen Liu
 * yisenliu@gmail.com
 */
 
// Exclude the iPad
Modernizr.addTest('ipad', function () {
	return !!navigator.userAgent.match(/iPad/i);
});

// Exclude the iPhone
Modernizr.addTest('iphone', function () {
	return !!navigator.userAgent.match(/iPhone/i);
});

// Exclude the iPod touch
Modernizr.addTest('ipod', function () {
	return !!navigator.userAgent.match(/iPod/i);
});

// Exclude android phones and tablets
Modernizr.addTest('android', function () {
	return !!navigator.userAgent.match(/android/i);
});

Modernizr.addTest('appleios', function () {
	return (Modernizr.ipad || Modernizr.ipod || Modernizr.iphone);
});


Modernizr.load([
	{
		test:Modernizr.hashchange,
		nope:'plugin/jquery/jquery.ba-hashchange.min.js'
	},
	{
		test:Modernizr.appleios,
		yep:'plugin/ios-viewport-scaling-bug-fix.js'
	}
]);
