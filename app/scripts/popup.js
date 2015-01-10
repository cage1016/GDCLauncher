/*jshint -W030 */

'use strict';


angular.module('launcher', ['launcher.services', 'launcher.controllers', 'launcher.filter'])
    .value('bg', chrome.extension.getBackgroundPage());

angular.module('launcher.services', [])
    .factory('project', ['$q', 'bg',
        function($q, bg) {
            var get = function(force) {
                force = force || false;

                var deferred = $q.defer();

                bg.getProjects(force).then(function(data) {
                    return bg.updateIcon(data);
                }).then(function(data) {
                    deferred.resolve(data);
                });

                return deferred.promise;
            };

            return {
                get: get
            };
        }
    ]);

angular.module('launcher.controllers', [])
    .controller('listControllers', ['$scope', 'project', 'bg',
        function($scope, project, bg) {

            project.get().then(function(data) {
                $scope.gcl = data;
            });

            $scope.openDashBoard = function() {
                bg.open('https://console.developers.google.com/project');
            };

            $scope.openProject = function(project) {
                bg.open('https://console.developers.google.com/project/' + project.id);
            };
            $scope.openAppEngine = function(project) {
                bg.open('https://console.developers.google.com/project/' + project.appEngineProjectId + '/appengine');
            };

            $scope.openBilling = function(project) {
                bg.open('https://console.developers.google.com/billing/' + project.numericProjectId);
            };

            $scope.openRunning = function(project) {
                bg.open('http://' + project.id + '.appspot.com/');
            };

            $scope.login = function() {
                bg.open('https://accounts.google.com/ServiceLogin');
            };

            $scope.update = function() {
                var regex = /\(([^)]+)\)/g;
                var msg = $scope.gcl.lastupdate.match(regex)[0];
                if ($scope.gcl.logined) {
                    $scope.gcl.lastupdate = $scope.gcl.lastupdate.replace(msg, ' (loading...)');
                } else {
                    $scope.gcl.lastupdate = $scope.gcl.lastupdate.replace(msg, ' (checking...)');
                }
                project.get(true).then(function(data) {
                    $scope.gcl = data;
                });
            };
        }
    ]);

angular.module('launcher.filter', [])
    .filter('highlight', ['$sce',
        function($sce) {
            return function(text, search, caseSensitive) {
                var result;
                if (search || angular.isNumber(search)) {
                    text = text.toString();
                    search = search.toString();
                    if (caseSensitive) {
                        result = text.split(search).join('<span class="ui-match">' + search + '</span>');
                    } else {
                        result = text.replace(new RegExp(search, 'gi'), '<span class="ui-match">$&</span>');
                    }
                } else {
                    result = text;
                }
                return $sce.trustAsHtml(result);
            };
        }
    ]);