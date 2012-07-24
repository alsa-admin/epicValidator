<?php

class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
{
	/**
	 *
	 * @var unknown_type
	 */
	protected $_logger;

	/**
	 *
	 */
	protected function _initSession()
	{
		return Zend_Session::start();
	}

	/**
	 *
	 */
	protected function _initLogging()
	{
		$this->bootstrap('frontController');
		$logger = new Zend_Log();
		$writer = 'production' == $this->getEnvironment() ?
			new Zend_Log_Writer_Stream(APPLICATION_PATH
				.'/../docs/logs/app.log') :
			new Zend_Log_Writer_Firebug();
		$logger->addWriter($writer);

		if('production' == $this->getEnvironment()) {
			//     		$filter = new Zend_Log_Filter_Priority(Zend_Log::ERR);
			//     		$logger->addFilter($filter);
		}
		$this->_logger = $logger;
		Zend_Registry::set('log', $logger);
	}

	/**
	 *
	 */
	protected function _initAutoload()
	{
		$this->_logger->info('Bootstrap ' . __METHOD__);

		// Add autoloader empty namespace
		$autoLoader = Zend_Loader_Autoloader::getInstance();
		$autoLoader->registerNamespace('<custom namespace here>');
		$resourceLoader = new Zend_Loader_Autoloader_Resource(array(
			'basePath' => APPLICATION_PATH,
			'namespace' => '',
			'resourceTypes' => array(
				'form' => array(
					'path' => 'forms/',
					'namespace' => 'Form_'
				),
				'model' => array(
					'path' => 'models/',
					'namespace' => 'Model_'
				)
			)
		));
		// Return it so that it can be stored by the bootstrap
		return $autoLoader;
	}

	/**
	 *
	 */
	protected function _initLocale()
	{
		$this->_logger->info('Bootstrap ' . __METHOD__);

		$locale = new Zend_Locale('en_US');
		Zend_Registry::set('Zend_Locale', $locale);
	}

	/**
	 *
	 */
	protected function _initDoctype()
	{
		$this->_logger->info('Bootstrap ' . __METHOD__);

		//init the view
		$this->bootstrap('view');
		$view = $this->getResource('view');

		//Load global stylesheets
		$view->headLink()->appendStylesheet('/styles/epic-validator.css')
			->headlink()->appendStylesheet('/scripts/jquery-ui-1.8.17/themes/base/jquery-ui.css');

		//Load Scripts
		$view->headScript()->prependFile('http://code.jquery.com/jquery-latest.min.js')
			->headScript()->appendFile('/scripts/jquery-ui-1.8.17/ui/minified/jquery-ui.min.js')
			->headScript()->appendFile('/scripts/epicValidator.js')
			->headScript()->appendFile("/scripts/crosshairs.js")
			->headScript()->appendFile("/scripts/scripts.epicValidator.com.js");
	}

}