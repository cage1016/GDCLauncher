/** @jsx React.DOM */

/*jshint -W109*/
/*jshint -W108*/

'use strict';

var bg = chrome.extension.getBackgroundPage();

var React = require('react');
var gdclStorage = require('../gdclStorage');
var ProjectList = require('./popupApp.projectList.react');
var cx = require('cx');
var settings = require('../settings');

var Project = React.createClass({

    getInitialState: function () {
        return {
            logined: gdclStorage.get('logined'),
            projects: gdclStorage.get('projects'),
            search: '',
            lastupdate: gdclStorage.get('lastupdate'),
            loading: false
        };
    },

    render: function () {

        var project;
        if (this.state.projects.length) {
            project = <div className="html ui attached segment">
                <ProjectList projects={this.state.projects} search={this.state.search}/>
            </div>;
        } else {
            project = null;
        }

        return (
            <div>
                <div className="logo-container" onClick={this._goDashboard}>
                    <img class="google-logo" src="/images/devConsoleLogo.svg"/>
                </div>
                <div className={cx({
                    "fluid ui blue button": true,
                    "loading": this.state.loading
                })} onClick={this._forceUpdate}>
                    <i className="icon wait"></i>
                    {this.state.lastupdate} (clcik to update)
                </div>
                <div id="search" className="ui fluid transparent left icon input">
                    <input type="text" placeholder="Search..." onChange={this._onChange}/>
                    <i className="search icon"></i>
                </div>
            {project}
            </div>
        );
    },

    _onChange: function (evt) {
        var search = evt.target.value.trim();
        this.setState({search: search});

        var projectFilter = function (project) {
            return project.name.indexOf(search) > -1 || project.id.indexOf(search) > -1 || project.assignedIdForDisplay.indexOf(search) > -1;
        };

        var newProjects = gdclStorage.get('projects').filter(projectFilter);

        if (search.length === 0) {
            newProjects = !newProjects || gdclStorage.get('projects');
        }
        this.setState({
            projects: newProjects
        });
    },

    _forceUpdate: function () {
        this.setState({loading: true});

        var that = this;
        bg.forceUpdate().then(function (data) {
            data.loading = false;
            that.setState(data);
            if (!data.logined) {
                window.close();
            }
        });
    },

    _goDashboard: function () {
        bg.open(settings.OPENDASHBOARD);
    }
});

module.exports = Project;
