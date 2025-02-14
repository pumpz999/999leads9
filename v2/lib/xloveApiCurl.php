<?php

class XloveApi {

	/**
	 * @var string 2 char values can be found on xlovecash
	 */
	private $language;

	/**
	 * @var string provided by xlovecash
	 */
	private $authServiceItemId;

	/**
	 * @var string provided by xlovecash
	 */
	private $authSecretKey;

	/**
	 * @var string
	 */
	private $protocolAndHostname;

	/**
	 * @param array $config
	 */
	public function __construct($config) {
		$this->language            = 'en';
		$this->protocolAndHostname = 'https://webservice-affiliate.xlovecam.com';

		if (empty($config['affiliateId'])) {
			throw new \InvalidArgumentException('Affiliate id is missing', 10052);
		}
		if (empty($config['secretKey'])) {
			throw new \InvalidArgumentException('secretKey is missing', 10053);
		}

		$this->authServiceItemId = strval($config['affiliateId']);
		$this->authSecretKey     = strval($config['secretKey']);

		if (!empty($config['endpoint'])) {
			// only usefull if you test in preprod
			$this->protocolAndHostname = $config['endpoint'];
		}
	}

	public function setLanguage($language) {
		$this->language = $language;
	}

	public function performerFilterList($config = array()) {
		if (empty($config['lang'])) {
			$config['lang'] = $this->language;
		}

		return $this->run('/model/filterList/', $config);
	}

	public function performerOnlineList($config = array()) {

		if (empty($config['lang'])) {
			$config['lang'] = $this->language;
		}

		return $this->run('/model/listonline/', $config);
	}

	public function performerCheckIsOnline($performerIdList) {

		$config = array(
			'modelid' => $performerIdList,
		);

		return $this->run('/model/checkisonline/', $config);
	}

	public function performerProfileInfo($performerIdList) {

		$config = array(
			'modelid' => $performerIdList,
		);

		return $this->run('/model/getprofileinfo/', $config);
	}


	public function ssoRegister(array $config) {
		$mandatoryFieldList = array('nickname', 'email');
		foreach ($mandatoryFieldList as $key) {
			if (empty($config[$key])) {
				throw new \InvalidArgumentException('Sso register parameter is missing: ' . $key, 10054);
			}
		}

		return $this->run('/v1/sso/register/', $config);
	}

	public function ssoLogin(array $config) {
		$mandatoryFieldList = array('token');
		foreach ($mandatoryFieldList as $key) {
			if (empty($config[$key])) {
				throw new \InvalidArgumentException('Sso login parameter is missing: ' . $key, 10057);
			}
		}

		return $this->run('/v1/sso/login/', $config);
	}

	public function ssoNicknameCheckAvailable(array $config) {
		$mandatoryFieldList = array('nickname');
		foreach ($mandatoryFieldList as $key) {
			if (empty($config[$key])) {
				throw new \InvalidArgumentException('Sso login parameter is missing: ' . $key, 10057);
			}
		}

		return $this->run('/v1/sso/nicknameCheckAvailable/', $config);
	}

	private function run($uri, $dataList = array()) {
		// auth parameters
		$dataList['authServiceId'] = '2';
		$dataList['authItemId']    = $this->authServiceItemId;
		$dataList['authSecret']    = $this->authSecretKey;
		$dataList['timestamp']     = time();

		$url     = $this->protocolAndHostname . $uri;
		$payload = http_build_query($dataList);
		$ch = curl_init();

		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_HEADER, false);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);

		$contentType = null;
		curl_setopt($ch, CURLOPT_HEADERFUNCTION, function ($curl, $header) use (&$contentType) {
				$len    = strlen($header);
				$header = explode(':', $header, 2);
				if (count($header) < 2) {
					// ignore invalid headers
					return $len;
				}
				$key = strtolower(trim($header[0]));
				if ($key === 'content-type') {
					$contentType = trim($header[1]);
				}

				return $len;
			}
		);

		$output = curl_exec($ch);

		$statusCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		$errorCode = curl_errno($ch);

		curl_close($ch);

		if (!empty($errorCode)) {
			throw new RuntimeException('cURL error system code found: ' . $errorCode, 10046);
		}

		if ($statusCode !== 200) {
			throw new RuntimeException('cURL error http code found: ' . $statusCode, 10048);
		}

		if ($contentType !== 'application/json') {
			throw new RuntimeException('Invalid content type (' . $contentType . ')', 10047);
		}

		$content = json_decode($output, true);
		if (empty($content)) {
			throw new RuntimeException('json decode failed', 10049);
		}

		if (!empty($content['error'])) {
			if (empty($content['error']['code'])) {
				throw new RuntimeException('API: unexpected error', 10050);
			}
			throw new RuntimeException('API Error raw: ' . $content['error']['msg'], intval($content['error']['code']));
		}

		if (empty($content['content'])) {
			throw new RuntimeException('API Error: empty content', 10051);
		}

		return $content['content'];
	}
}
