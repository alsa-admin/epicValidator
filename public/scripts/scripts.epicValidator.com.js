/* Javascript document
 *
 * @Author:	Ken Stowell
 * @Date:		
 *
 * @Description: 
 */

/**********************************************************************************************************************************************************
 * GLOBAL VARS/FUNCTIONS																																																																	*
 *********************************************************************************************************************************************************/

/**********************************************************************************************************************************************************
 *	EV_com Object
 **********************************************************************************************************************************************************
 *
 * @desc: Main scripting resources for epicValidator.com
 *
 *
 *
 *
 */
(function () {
	/**
	 * EV_com CONSTRUCTOR
	 */
	var EV_com = function () {
		var self = this;

		//instantiate EV_com methods
		this.init();
	};

	/**
	 * EV_com EV_com METHODS
	 */
	EV_com.prototype = {
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
				$('div.option-tabs').tabs();

				$(window).click(function(e) {
					console.log(e.target);
				});

				//crosshairs init
				$('#crosshairs').Crosshairs({
					width: '20px',
					height: '20px',
					show_in_url: true,
					alignment: 'center',
					offset: 0,
					pathing: 'fixed',
					speed: 800,
					mode: {
						traversal: 'slide-deck',
						distance: '95%',
						forward: $('.slide-button-next'),
						reverse: $('.slide-button-prev')
					},
					wrapper: $('#main-content')
				});
			});

			/**
			 * Window Load
			 */
			$(window).load(function () {

			});
		}
	};

	//instantiate the EV_com and push it to the window EV_com
	var Obj = new EV_com();
	window.O = window.Obj = Obj;
})();


/************************************************************* END ***************************************************************************************/ 

