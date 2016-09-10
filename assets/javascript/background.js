/* exported getProjects */
/*jshint -W030 */

'use strict';

var gdclStorage = require('./gdclStorage');
var settings = require('./settings');
var projects = require('./projects');
var log = require('./log');
var sprintf = require('sprintf-js').sprintf;

chrome.runtime.onInstalled.addListener(function (details) {
  log('previousVersion', details.previousVersion);
});


function setIcon(statusCode, msg) {
  chrome.browserAction.setBadgeBackgroundColor(settings.STATUSCOLOR[
    statusCode]);
  chrome.browserAction.setBadgeText({
    text: msg
  });
}


function updateIcon(data) {
  return new Promise(function (resolve) {
    if (data.logined) {
      setIcon('OK', data.projects.length.toString());
      resolve(data);
    } else {
      setIcon('ERR', 'Login');
      resolve(data);
    }
  });
}



function forceUpdate() {
  return projects.fetch(true).then(function (data) {
    return updateIcon(data);
  }).then(function (data) {
    log(data);
    return data;
  });
}

function gdclInit() {
  forceUpdate();
}


// This event is fired each time the user updates the text in the omnibox,
// as long as the extension's keyword mode is still active.
chrome.omnibox.onInputChanged.addListener(
  function (text, suggest) {
    var results = [];
    if (gdclStorage.hasData('projects')) {
      var projects = gdclStorage.get('projects');

      var result = projects.filter(function (project) {
        return project.name.indexOf(text) > -1 || project.id
          .indexOf(text) > -1;
      });

      for (var k in result) {
        var p = result[k];

        // project
        results.push({
          content: sprintf(settings.PROJECT, {
            id: p.id
          }),
          description: 'Project: ' + p.name
        });

        // running
        results.push({
          content: sprintf(settings.RUNNING, {
            id: p.id
          }),
          description: '(' + p.name + ') ' + sprintf(
            settings.RUNNING, {
              id: p.id
            })
        });
      }
    }
    suggest(results);
  });


// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(function (text) {
  if (text) {
    chrome.tabs.update({
      url: text
    });
  } else {
    chrome.tabs.update({
      url: settings.OPENDASHBOARD
    });
  }
});


document.addEventListener('DOMContentLoaded', function () {
  gdclInit();
});


/**
 * Copy text to clipboard
 * @param  {string} text string want to copy to clipboard
 */
function copy(text) {
  var copyTextarea = document.createElement('textarea');
  copyTextarea.value = text;
  document.body.appendChild(copyTextarea);
  copyTextarea.select();
  document.execCommand('copy');
  document.body.removeChild(copyTextarea);
}

window.copy = copy;
window.forceUpdate = forceUpdate;
