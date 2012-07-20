/* Javascript document
 *
 * @Author:	Ken Stowell
 * @Date:
 *
 * @Description: project page at: https://trello.com/board/epicvalidator/4fe8b2d92b4e3c31037fee11
 *
 */

/**********************************************************************************************************************************************************
 * GLOBAL VARS/FUNCTIONS																																																																	*
 *********************************************************************************************************************************************************/

/**********************************************************************************************************************************************************
 *	EPIC VALIDATOR jQUERY PLUGIN
 **********************************************************************************************************************************************************
 *
 *
 */
(function ($) {

	//Instantiate as a jQuery plugin and create a new Crosshairs object
	jQuery.fn.epicValidator = function(options) {
		return this.each(function() {
			new epicValidator(this, options);
		});
	};
	
	/**
	 * epicValidator CONSTRUCTOR
	 */
	var epicValidator = function (ev, options) {
		var self = this;

		this.$ev = $(ev);
		this.options = $.extend({}, epicValidator.defaults, options);

		//instantiate object methods
		this.init();
	};

	/**
	 * EPIC VALIDATOR DEFAULTS
	 */
	epicValidator.defaults = {
		generic: {
			onFocusOut: function() {

			},
			onFocusIn: function() {

			},
			onEnterKey: function() {
			}
		},
		text : {
			required: true,
			triggers: {
				keypress: false,
				focusOut: true,
				focusIn: false,
				pasteIn: false
			},
			onPassedValidation: function() {

			},
			onFailedValidation: function() {

			}
		},
		checkbox : {

		},
		select: {

		},
		email: {

		},
		password: {

		},
		button: {

		},
		submit: {

		}
	};

	/**
	 * epicValidator epicValidator METHODS
	 */
	epicValidator.prototype = {
		/**
		 * INIT
		 */
		init:function () {
			var self = this;

			//load dynamic page elements
			this.buildPage();
		},
		/**
		 * BUILD PAGE
		 */
		buildPage:function () {
			/**
			 * Document Ready
			 */
			$(document).ready(function () {

			});

			/**
			 * Window Load
			 */
			$(window).load(function () {

			});
		}
	};

	//instantiate the object and push it to the window object
	var Obj = new epicValidator();
	window.O = window.Obj = Obj;
})(jQuery);


/************************************************************* END ***************************************************************************************/ 

