PHP HTTP client for XloveCam.com
Version: 2.0
-------------

What Is This?
-------------

This library is a PHP HTTP client that makes it easy to send HTTP requests to XloveCam.com API.
It provides real time information about the models found on XloveCam.com in Json format so you
can build your own promotool.

Requirements
------------
The following are required to use this library:

- A functioning PHP 5.4+ environment with HTTPS access to the internet.
- Additionally, the PHP install must have cURL support available.
  - On Debian & Ubuntu, you'll need the php5-curl package.
  - On Windows, cURL should already be available, but you may need to enable
    it in php.ini (uncomment 'extension=php_curl.dll').
- Some working knowledge of the PHP language.
- The API keys that are provided on the Json API XloveCash promotool page.


How To Use It
-----------------------

1. Setup a configuration array with information provided in the promotool page:

	$config = array(
		'affiliateId' => 'id numeric',
		'secretKey'   => 'hexadecimal string',
	);

2. Create the API object:

	$api = new XloveApi($config);


3. Call method on this object.

In case of errors, you will have an exception. Think to try/catch it.


Examples
-----------------------

The demo script can be run in command line.

Before to run it, edit the configuration array to use the correct information.



Comments / Suggestions
----------------------
We always welcome comments, suggestions, and constructive complaints. You can
find several ways to contact us at  https://xlovecash.com/contact
