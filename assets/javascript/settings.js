'use strict';

var BASE_URL = 'https://console.cloud.google.com/'


module.exports.GOOGLE_DEVELOPERS_CONSOLE_URL = BASE_URL + 'm/recentProjects?maxProjects=20';

module.exports.STATUSCOLOR = {
	ERR: {
		color: '#ff4c62'
	},
	OK: {
		color: '#3c763d'
	}
};

module.exports.OPENDASHBOARD = BASE_URL + 'project';

module.exports.APPENGINE = BASE_URL + 'project/%(appEngineProjectId)s/appengine';

module.exports.PROJECT = BASE_URL + 'project/%(id)s';

module.exports.BILLING = BASE_URL + 'billing/%(numericProjectId)s';

module.exports.RUNNING = 'http://%(id)s.appspot.com';

module.exports.MONITORING = BASE_URL + 'project/%(id)s/monitoring/stackdriver-signup';

module.exports.LOGIN = 'https://console.cloud.google.com/';
