/** @jsx React.DOM */

/*jshint -W109*/
/*jshint -W108*/

'use strict';

var bg = chrome.extension.getBackgroundPage();

var React = require('react');
var gdclStorage = require('../gdclStorage');
var settings = require('../settings');
var Project = require('./popupApp.project.react');


var popupApp = React.createClass({

    getInitialState: function () {
        return {
            logined: gdclStorage.get('logined')
        };
    },

    componentDidMount: function () {
        if (!this.state.logined) {
            var that = this;
            bg.forceUpdate().then(function (data) {
                that.setState(data);
            });
        }
    },

    render: function () {
        var html;
        if (!this.state.logined) {
            html = <div className="fluid ui red button" onClick={this._goLoginPage}>
                <i className="warning sign icon"></i>
                Login Google Account First
            </div>;
        } else {
            html = <Project/>;
        }

        return (
            <div>{html}</div>
        );
    },

    _goLoginPage: function () {
        bg.open(settings.LOGIN);
    }
});

module.exports = popupApp;
