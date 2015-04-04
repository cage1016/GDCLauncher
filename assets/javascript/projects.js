'use strict';

var gdclStorage = require('./GDCLStorage');
var settings = require('./settings');
require('./utils');

var Project = function() {};

function get(url) {
	return new Promise(function(resolve, reject) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.setRequestHeader('Accept', 'application/json');
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				if (xhr.status === 401) {
					reject(new Error('please login Google account first.'));
					console.log(url + ' ' + xhr.status + ' signOut');
				}
				resolve(JSON.parse(xhr.responseText.substr(4)));
			}
		};
		xhr.send();
	});
}



Project.prototype.fetch = function(force) {
	return new Promise(function(resolve) {

		force = force || false;

		var _job = function() {
			return get(settings.GOOGLE_DEVELOPERS_CONSOLE_URL).then(function(data) {
				var gcl = {
					'projects': data,
					'logined': true
				};
				gdclStorage.save(gcl);

				resolve(gcl);
			}, function(error) {
				console.error(error);

				var gcl = {
					'logined': false
				};
				gdclStorage.save(gcl);

				resolve(gcl);
			});
		};


		if (force) {
			_job();
		} else {
			if (gdclStorage.hasData('projects')) {
				resolve(gdclStorage.get('projects'));
			} else {
				_job();
			}
		}
	});
};


module.exports = new Project();
