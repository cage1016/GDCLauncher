/* exported getProjects */
/*jshint -W030 */

'use strict';

Date.prototype.Format = function(fmt) { //author: meizz
    var o = {
        'M+': this.getMonth() + 1, //月份
        'd+': this.getDate(), //日
        'h+': this.getHours(), //小時
        'm+': this.getMinutes(), //分
        's+': this.getSeconds(), //秒
        'q+': Math.floor((this.getMonth() + 3) / 3), //季度
        'S': this.getMilliseconds() //毫秒
    };

    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    }

    return fmt;
};

// http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] !== 'undefined' ? args[number] : match;
        });
    };
}

chrome.runtime.onInstalled.addListener(function(details) {
    console.log('previousVersion', details.previousVersion);
});

var config = {
    GOOGLE_DEVELOPERS_CONSOLE_URL: 'https://console.developers.google.com/m/project',
    STATUSCOLOR: {
        ERR: {
            color: '#ff4c62'
        },
        OK: {
            color: '#3c763d'
        }
    },
};

function setIcon(statusCode, msg) {
    chrome.browserAction.setBadgeBackgroundColor(config.STATUSCOLOR[statusCode]);
    chrome.browserAction.setBadgeText({
        text: msg
    });
}


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

function getProjects(force) {
    return new Promise(function(resolve) {

        force = force || false;

        var _job = function() {
            return get(config.GOOGLE_DEVELOPERS_CONSOLE_URL).then(function(data) {
                var gcl = {
                    'projects': data,
                    'logined': true,
                    'lastupdate': new Date().Format('yyyy-MM-dd hh:mm:ss') + ' (click to update)'
                };
                localStorage.setItem('gcl', JSON.stringify(gcl));

                resolve(gcl);
            }, function(error) {
                console.error(error);

                var gcl = {
                    'logined': false,
                    'lastupdate': 'Login Google Account First'
                };
                localStorage.setItem('gcl', JSON.stringify(gcl));

                resolve(gcl);
            });
        };


        if (force) {
            _job();
        } else {
            var gclStr = localStorage.getItem('gcl');
            if (gclStr) {
                resolve(JSON.parse(gclStr));
            } else {
                _job();
            }
        }
    });
}

function updateIcon(data) {
    return new Promise(function(resolve) {
        if (data.logined) {
            setIcon('OK', data.projects.length.toString());
            resolve(data);
        } else {
            setIcon('ERR', 'Login');
            resolve(data);
        }
    });
}


function init() {
    getProjects(true).then(function(data) {
        return updateIcon(data);
    }).then(function(data) {
        console.log(data);
    });
}


// This event is fired each time the user updates the text in the omnibox,
// as long as the extension's keyword mode is still active.
chrome.omnibox.onInputChanged.addListener(
    function(text, suggest) {
        var results = [];
        var gclStr = localStorage.getItem('gcl');
        if (gclStr) {
            var gcl = JSON.parse(gclStr);

            var result = gcl.projects.filter(function(project) {
                return project.name.indexOf(text) > -1 || project.id.indexOf(text) > -1;
            });

            for (var k in result) {
                var p = result[k];
                results.push({
                    content: 'https://console.developers.google.com/project/' + p.id,
                    description: 'Project: ' + p.name
                });
                results.push({
                    content: 'http://' + p.id + '.appspot.com/',
                    description: '(' + p.name + ') http://' + p.id + '.appspot.com/'
                });
            }
        }
        suggest(results);
    });

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(function(text) {
    if (text) {
        chrome.tabs.update({
            url: text
        });
    } else {
        chrome.tabs.update({
            url: 'https://console.developers.google.com/project'
        });
    }
});

init();