
module.declare( function(require, exports, module) {
	
	/** 
		Photo
		=====
	
		Contains a whole bunch of canned functions that transform images in a canvas context
		** Requires ** hslrgb.js in the same directory
	*/
	
	var hsl = require("./hslrgb");
	exports.VERSION = '0.1';
	
	
	/** 
		private convertToCanvas
		=======================
		
		input: an Image element
		output: a Canvas element
		
		takes an image element and converts it into a canvas for processing, placing the image on the canvas for subsequent processing. The intention is to allow scripts to look for images with a certain classname and process these through this script. This is private though: access to the canvas magic should be through one of the exported functions
		
	*/
	function convertToCanvas(el) {
		var c = document.createElement("canvas");
		c.width = el.width;
		c.height = el.height;
		var ctx = c.getContext('2d');
		ctx.drawImage(el, 0, 0);
		return c;
	};
	
	/** 
		private getPixels
		=================
		
		input: a canvas element
		output: an array of HSL values 
		
		Converts the canvas to HSL for easy processing later. *WARNING* HSL conversions are computation intensive, images should be small.
		
		
		
	*/
	function getPixels(c) {
		var ctx = c.getContext('2d');
		var pix = ctx.getImageData(0,0,c.width,c.height).data;
		var retarr = new Array(pix.length/4);
		var it = 0;
		for (var i = 0; i < pix.length; i += 4) {
			retarr[it] = hsl.rgbToHsl(pix[i], pix[i+1], pix[i+2]);
			it++;
		}
		return retarr;
	};
	
	/** 
		private applyPixels
		===================
		
		input: a canvas element, an array of pixel values in rgba format
		output: canvas element
		
		Pastes pixels back onto the canvas. Not sure why this doesn't do the HSL-RGB conversion.
	*/
	function applyPixels(canvas, pixels) {
		var ctx = canvas.getContext('2d');
		var currdata = ctx.getImageData(0,0,canvas.width,canvas.height);
		//TODO convert back to RGB
		for (var i = 0; i < currdata.data.length; i += 4) {
			currdata.data[i] = pixels[i/4][0];
			currdata.data[i+1] = pixels[i/4][1];
			currdata.data[i+2] = pixels[i/4][2];
			currdata.data[i+3] = 255; 
		}
		ctx.putImageData(currdata,0,0);
		return canvas;
	};
	
	/**
		private convertToImage
		======================
		
		input: a canvas element
		output: an image
		
		The inverse of convertToCanvas. Takes a canvas and makes it into a static image for display.
	*/
	
	function convertToImage(canvas) {
		var i = new Image();
		i.width = canvas.width;
		i.height = canvas.height;
		i.src = canvas.toDataURL();
		return i;
	};


	/**
		private transform
		=================

		input: an image element, a transform function (which takes an hsl pixel array)
		output: void-ish - the transform function is expected to return an rgb pixel array, and the transform replaces the image in the page with the converted version. That's too coupled. TODO think about it
		
		Crude interface for convolution functions, wires all the activities together	
	*/
	var transform = function(el, func) {
		var canv = convertToCanvas(el);
		var hslPixels = getPixels(canv);
		hslPixels = func(hslPixels);
		canv = applyPixels(canv, hslPixels);
		var im = convertToImage(canv);	
		el.src = im.src;
	}

	
	
	/**
		public mono
		===========
		
		input: an image element
		output: replaces image with transformed version
		
		Makes image monochrome
	*/
	
	exports.mono = function(el) {
		transform(el, function(pixels) {
			for (var i = 0; i < pixels.length; i++) {
				pixels[i] = hsl.hslToRgb(pixels[i][0], 0, pixels[i][2]);
			}
			return pixels;			
		});
	};
	
	
	/** 
		public invert
		=============
		
		input: an image element
		output: replaces image with transformed version
		
		Inverts the hue and lightness values of the image for a photographic negative effect
		
	*/		
	
	exports.invert = function(el) {
		transform(el, function(pixels) {
			for (var i = 0; i < pixels.length; i++) {
				pixels[i] = hsl.hslToRgb((pixels[i][0] + 0.5)%1, pixels[i][1], 1-pixels[i][2]);
			}
			return pixels;			
		});
	};
	
	
	/** 
	public contrast
	=============
	
	input: an image element
	output: replaces image with transformed version
	
	Remaps high and low lightness values by the amount specified in the input. Doesn't work as well as I'd like. Might actually need to read up on image processing. Used for the polaroid effect in the demo. The fact that the image is constantly getting rewritten might explain poor performance. See, it is worth writing documentation because you notice things like this.
	
		
	*/
	exports.contrast = function(el, hi, lo) {
		transform(el, function(pixels) {
			for (var i = 0; i < pixels.length; i++) {
				if (pixels[i][2] < 0.3) {
					pixels[i][2] = pixels[i][2] * lo;
				} else if (pixels[i][2] > 0.7) {
					pixels[i][1] = (pixels[i][1] * hi > 1) ? 1 : pixels[i][1] * hi;
				}
				pixels[i] = hsl.hslToRgb(pixels[i][0], pixels[i][1], pixels[i][2]);
			}
			return pixels;			
		});		
	}
	

});