/** @jsx React.DOM */

/*jshint -W109*/
/*jshint -W108*/

'use strict';

var bg = chrome.extension.getBackgroundPage();

var React = require('react');
var settings = require('../settings');
var sprintf = require('sprintf-js').sprintf;

var ProjectListItem = React.createClass({

    highlight: function (text, search) {
        if (this.props.search.trim()) {
            text = text.toString();
            return text.split(search).join('<span class="ui-match">' + search + '</span>');
        }
        return text;
    },

    render: function () {

        var extra;
        if (this.props.project.status === 1) {
            extra = <div className="extra">
                <div className="ui red label small">pending deletion</div>
            </div>;
        } else {
            extra = null;

        }

        return (
            <div className="item">
                <div className="content">
                    <a className="header" onClick={this._openProject}>
                        <span dangerouslySetInnerHTML={{__html: this.highlight(this.props.project.name, this.props.search)}}></span>
                        <i className="external icon inline"></i>
                    </a>

                    <div className="description">
                        <p>
                            <span dangerouslySetInnerHTML={{__html: this.highlight(this.props.project.id, this.props.search)}}></span>
                        </p>
                    </div>
                    <div className="ui list">
                        <a className="item" onClick={this._openAPPENGINE}>GAE : {this.props.project.appEngineProjectId}
                            <i className="external icon inline"></i>
                        </a>
                        <a className="item" onClick={this._openAPPENGINERunning}>GAE : Running
                            <i className="external icon inline"></i>
                        </a>
                        <a className="item" onClick={this._openBilling}>Billing : {this.props.project.numericProjectId}
                            <i className="external icon inline"></i>
                        </a>
                        <a className="item" onClick={this._openMonitoring}>Monitoring :
                            <span dangerouslySetInnerHTML={{__html: this.highlight(this.props.project.assignedIdForDisplay, this.props.search)}}></span>
                            <i className="external icon inline"></i>
                        </a>
                    </div>
                {extra}
                </div>
            </div>
        );
    },

    _openProject: function () {
        var url = sprintf(settings.PROJECT, {
            id: this.props.project.id
        });
        bg.open(url);
    },

    _openAPPENGINE: function () {
        var url = sprintf(settings.APPENGINE, {
            appEngineProjectId: this.props.project.appEngineProjectId
        });
        bg.open(url);
    },

    _openAPPENGINERunning: function () {
        var url = sprintf(settings.RUNNING, {
            id: this.props.project.id
        });
        bg.open(url);
    },

    _openBilling: function () {
        var url = sprintf(settings.BILLING, {
            numericProjectId: this.props.project.numericProjectId
        });
        bg.open(url);
    },

    _openMonitoring: function () {
        var url = sprintf(settings.MONITORING, {
            id: this.props.project.id
        });
        bg.open(url);
    }

});

module.exports = ProjectListItem;
