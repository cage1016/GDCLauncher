'use strict';

var BASE_URL = 'https://console.developers.google.com/';


module.exports.GOOGLE_DEVELOPERS_CONSOLE_URL = BASE_URL + 'm/project';

module.exports.STATUSCOLOR = {
	ERR: {
		color: '#ff4c62'
	},
	OK: {
		color: '#3c763d'
	}
};

module.exports.OPENDASHBOARD = BASE_URL + '/project';

module.exports.APPENGINE = BASE_URL + 'project/%(projectId)s/appengine';

module.exports.PROJECT = BASE_URL + 'project/%(id)s';

module.exports.BILLING = BASE_URL + 'billing/%(numericProjectId)s';

module.exports.RUNNING = 'http://%(id)s.appspot.com';

module.exports.MONITORING = BASE_URL + '/account/login/$(id)s/';

module.exports.LOGIN = 'https://accounts.google.com/ServiceLogin';
