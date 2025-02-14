<?php

/**
 * You can run it in command line mode.
 * Ex: php run.php
 */

require_once(__DIR__ . "/../lib/xloveApiCurl.php");

$config = array(
	// Change this value with your affiliate id (keep it as string even if it's a number)
	'affiliateId' => '000',

	// Change this value too with the one provider in the promotool page
	'secretKey'   => 'xxxxxxx',
);


class TestXloveApi {
	private $blockTitle;
	private $config;

	public function __construct($config) {
		$this->config = $config;
	}

	private function blockStart($title) {
		$this->blockTitle = $title;

		echo "====== Start of: $title ======\n";
	}


	private function blockEnd() {
		echo "====== End of: " . $this->blockTitle . " ======\n\n";
		$this->blockTitle = null;
	}

	public function run() {
		$api = new XloveApi($this->config);

		$this->blockStart('performerFilterList');
		$filterList = $api->performerFilterList();
		print_r($filterList);
		$this->blockEnd();

		$this->blockStart('performerOnlineList');
		$onlineList = $api->performerOnlineList(array(
			'limit' => 5,
		));
		print_r($onlineList);
		$this->blockEnd();

		// performerId to be used for the next tests
		// these ID list could be extracted from the result of performerOnlineList()
		$performerIdList = array(148387, 732480);

		$this->blockStart('performerCheckIsOnline');
		$isOnline = $api->performerCheckIsOnline($performerIdList);
		print_r($isOnline);
		$this->blockEnd();

		$this->blockStart('performerProfileInfo');
		$profileInfo = $api->performerProfileInfo($performerIdList);
		print_r($profileInfo);
		$this->blockEnd();


		/////////////////////////////
		// SSO related functions
		//

		$nickname =  'ssoTestApiT' . substr(time(), -5) . 'o';

		$this->blockStart('ssoNicknameCheckAvailable');
		$ssoNicknameCheck = $api->ssoNicknameCheckAvailable(array(
			'nickname' => $nickname,
		));
		print_r($ssoNicknameCheck);
		$this->blockEnd();

		$this->blockStart('ssoRegister');
		$ssoRegisterOutput = $api->ssoRegister(array(
			'nickname' => $nickname,
			'email'    => 'ssoTest' . time() . '@yopmail.com',
		));
		print_r($ssoRegisterOutput);
		$this->blockEnd();


		if (!empty($ssoRegisterOutput['token'])) {
			// you must save $ssoRegisterOutput['token'] in your database.
		}

		// by following the link $ssoRegisterOutput['url'] the user complete the registration.
		// the next time you have to do a login by using the token
		// the code is disabled because it will not work since the account is not yet valid
		if (false) {
			$this->blockStart('ssoLogin');
			$ssoOutput = $api->ssoLogin(array(
				'token' => 'xxxxxxxxx',
			));
			print_r($ssoOutput);
			$this->blockEnd();
		}

	}
}

if (php_sapi_name() !== 'cli') {
	// not in command line
	echo "You can also run this script in command line.\n\n";
	header('Content-type: text/plain');
}

echo "In the next lines, you will see the result of function call.\n\n";

$testApi = new TestXloveApi($config);

try {
	$testApi->run();
}
catch (\Exception $e) {
	// it's a good idea to log error somewhere (error_log or in a NoSQL database)
	// so you can have some stat and contact us ASAP when there is a problem
	echo "Error " . $e->getCode() . ': ' . $e->getMessage() . "\n";
}
