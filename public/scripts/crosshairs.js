/* Javascript document
 *
 * @Author:	Ken Stowell
 * @Date:
 *
 * @Description: tooltip modal plugin
 *
 * Copyright (c) 2012 Ken Stowell,
 * https://github.com/ktstowell/Crosshairs.js

 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:

 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */
/**********************************************************************************************************************************************************
 * CROSSHAIRS jQUERY PLUGIN																																																																*
 **********************************************************************************************************************************************************
 *
 * @desc: 'One-sheet' navigation traverser.
 *
 *
 */
(function($) {

	//Instantiate as a jQuery plugin and create a new Crosshairs object
	jQuery.fn.Crosshairs = function(options) {
		return this.each(function() {
			new Crosshairs(this, options);
		});
	};


	var Crosshairs = function(crosshair, options) {
		window.Crosshairs = this;

		this.$ch = $(crosshair);
		this.options = $.extend({}, Crosshairs.defaults, options);

		//option specific shortcuts
		this.w = this.options.width;//width option
		this.h = this.options.height;//height option
		this.vis = this.options.visible; // Display the ch box - mainly used for development
		this.url = this.options.show_in_url; // generate hashed urls
		this.align = this.options.alignment;//alignment option
		this.off = this.options.offset;//Offset option
		this.pth = this.options.pathing;//pathing option
		this.md = this.options.mode; // animation mode
		this.spd = this.options.speed;//width option
		this.cont = this.options.content;//content object
		this.$wrp = this.options.wrapper; //Wrapper object

		//Init object methods
		this.init();
	};

	/************************
	 * CROSSHAIRS DEFAULTS
	 * @desc: default options for plugin behavior
	 *
	 */
	Crosshairs.defaults = {
		width: '20px', //width
		height: '20px',//height
		visible: false,//toggle for crosshairs visibility
		show_in_url: true, // Generates hashed urls
		alignment: 'center', //portion of the box the content is aligned to upon moving
		offset: 0, //margin from the box - integer only
		pathing: 'fixed', //pathing type
		mode: '', //Animation mode
		speed: 5000, //TODO: allow for dynamic speed, to travel at same velocity over various distances
		easing: '', // TODO: incorporate easing
		content: '',//trigger and targets for content moving
		wrapper: '' // Wrapper element that actually recieves the animation.
	};

	/************************
	 * CROSSHAIRS PROTOTYPE
	 * @desc: object methods for the Crosshairs object
	 */
	Crosshairs.prototype = {
		/**
		 * INIT
		 * @desc: first things first :)
		 */
		init: function() {
			var self = this;

			//Init the actual crosshairs
			this.buildCrossHairs();

			//Set up target event handling
			this.bindEvents();

			//Load appropriate content based on  direct URL injection
			this.loadFrame();
		},
		/**
		 * BIND EVENTS
		 * @desc: build the event handlers for the targets
		 */
		bindEvents: function() {
			var self = this;

			if(this.cont) {
				//build the trigger event handler
				$.each(self.cont, function(key, val) {
					$(val.trigger.selector).bind('click', function(e) {
						//prevent the browser from default <a> behavior
						e.preventDefault();
						//if show in url is true - hash the url
						if(self.url === true) {
							window.location.hash = '/'+this.textContent.toLowerCase();
						}
						//for each object in content, bind it's 'trigger' to a method call for the appropriate target content
						self.pathToTarget(val.target.selector);
					});
				});
			} else {
				//since the content is empty, check to see if there is a mode set
				if (this.md) {
					//scale for other animation modes in the future
					if (this.md.traversal == 'slide-deck') {

						this.md.forward.live('click', function() {
							console.log('clicked!')
							self.pathToTarget('', 'forward');
						});

						this.md.reverse.live('click', function() {
							console.log('clicked!')
							self.pathToTarget('', 'reverse');
						});
					}
				}
			}
		},
		/**
		 * BUILD CROSSHAIRS
		 * @desc: style the crosshairs
		 */
		buildCrossHairs: function() {
			var self = this;

			//First set display, width and height values
			$('#crosshairs').css({
				'visibility' : (self.vis == true) ? 'visible' :  'hidden',
				'width': self.w,
				'height': self.h,
				'border' : '1px solid black'
			});

			//Now adjust position
			$('#crosshairs').css({
				'position': 'fixed',
				'top' : ($(window).height() - $('#crosshairs').height()) /2,
				'left': ($(window).width() - $('#crosshairs').width()) /2
			});

			// Build Wrapper
			$(self.$wrp).css({
				'width':'100%',
				'height':'100%',
				'position': 'absolute',
				'top':'0',
				'left':'0'
			});
		},
		/**
		 * LOAD FRAME
		 * @desc: if a user were to navigate directly to a hashed url, load the appropriate content
		 */
		loadFrame: function() {
			var self = this;
			//check if hashing is turned on
			if(this.url === true) {
				//get current url
				var c_url = window.location.hash;
				//loop the content object to get the coords of whatever is in the URL
				$.each(self.cont, function(key, val) {
					if(c_url.search(key) >-1) {
						var target = self.getItemCoordinates($('section#'+key+'-wrapper'));
						//set the position of the page wrapper div
						$(self.$wrp).css({
							'top' : -target.TL.y,
							'left' : -target.TL.x
						});
					}
				});
			}
		},
		/**
		 * PATH TO TARGET
		 * @param target
		 *
		 * TODO: This isn't very modular and needs re-architecting
		 */
		pathToTarget: function(target, dir) {
			var self = this;

			//default traversal
			if(!this.md) {
				//get the current position
				var o = parseInt(this.off);//offset
				var c = current_position = self.getItemCoordinates(this.$ch);//current crosshair location based on ch settings, alignment and offset
				var c_left, c_top;//final coords for current position.

				switch(self.align) {
					case 'center':
						c_left = c.TL.x + (this.$ch.width() /2) + o;
						c_top = c.TL.y + (this.$ch.height() / 2) + o;
						break;
					case 'top-left':
						c_left = c.TL.x + o;
						c_top = c.TL.y + o;
						break;
					case 'top-right':
						c_left = c.TR.x + o;
						c_top = c.TR.y + o;
						break;
					case 'bottom-left':
						c_left = c.BL.x + o;
						c_top = c.BL.y + o;
						break;
					case 'bottom-right':
						c_left = c.BR.x + o;
						c_top = c.BR.y + o;
						break;
					default:
						c_left = c.TL.x + (this.$ch.width() /2) + o;
						c_top = c.TL.y + (this.$ch.height() / 2) + o;
						break;
				}

				//get the target position
				var t = self.getItemCoordinates($(target));
				var t_left, t_top;

				switch(self.align) {
					case 'center':
						t_left = t.TL.x + ($(target).width() /2) + o;
						t_top = t.TL.y + ($(target).height() / 2) + o;
						break;
					case 'top-left':
						t_left = t.TL.x + o;
						t_top = t.TL.y + o;
						break;
					case 'top-right':
						t_left = t.TR.x + o;
						t_top = t.TR.y + o;
						break;
					case 'bottom-left':
						t_left = t.BL.x + o;
						t_top = t.BL.y + o;
						break;
					case 'bottom-right':
						t_left = t.BR.x + o;
						t_top = t.BR.y + o;
						break;
					default:
						t_left = t.TL.x + ($(target).width() /2) + o;
						t_top = t.TL.y + ($(target).height() / 2) + o;
						break;
				}

				//Animate content
				var dist_left, dist_top;
				//if pathing type is fixed, calculate distance from CH
				if(this.pth === 'fixed') {
					dist_left = t_left - c_left;
					dist_top = t_top - c_top;

					//animate the path to the new coords
					$(self.$wrp).stop().animate(
						{
							top: -dist_top +'px',
							left: -dist_left+'px'
						}, self.spd, 'swing', function(){
							// Completion code.
						});
				}
			} else {
				// For non-default traversal modes
				if(this.md && this.md.traversal == 'slide-deck') {
					var dist;
					//calculate distance
					if (typeof this.md.distance == 'string') {
						dist = $(window).width() * parseFloat(this.md.distance);
						dist = dist / 100;
					} else {
						if (typeof this.md.distance == 'number') {
							dist = this.md.distance;
						}
					}

					$(self.$wrp).stop().animate({
						left:((dir == 'forward')? '-='+dist : '+='+dist)
					}, self.spd, 'swing', function() {

					});
				}
			}
		},
		/**
		 * GET ITEM COORDINATES
		 * @desc: gets item coordiantes for each x,y intersection
		 * @param elem
		 */
		getItemCoordinates: function(elem) {
			var self = this;
			var $elem = $(elem);
			var pos = $elem.position();

			//return an obecjt with the coords of each point
			return {
				TL: {
					x:pos.left,
					y:pos.top
				},
				TR: {
					x: pos.left+$elem.width(),
					y: pos.top
				},
				BL: {
					x: pos.left,
					y: pos.top+$elem.height()
				},
				BR: {
					x: pos.left+$elem.width(),
					y: pos.top+$elem.height()
				}
			};
		}
	};
})(jQuery);

/************************************************************* END ***************************************************************************************/


