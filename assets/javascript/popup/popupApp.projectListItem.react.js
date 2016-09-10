/** @jsx React.DOM */

/*jshint -W109*/
/*jshint -W108*/

'use strict';

var bg = chrome.extension.getBackgroundPage();

var React = require('react');
var settings = require('../settings');
var sprintf = require('sprintf-js').sprintf;

var ProjectListItem = React.createClass({

  highlight: function(text, search) {
    if (this.props.search.trim()) {
      text = text.toString();
      return text.split(search).join('<span class="ui-match">' + search + '</span>');
    }
    return text;
  },

  render: function() {

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
          <a className="header" onClick={this._open.bind(this, settings.PROJECT, {id: this.props.project.id})}>
            <span className="italic" dangerouslySetInnerHTML={{
              __html: this.highlight(this.props.project.name.trim() || this.props.project.id, this.props.search)
            }}></span>
            <i className="external icon inline"></i>
          </a>
          <div className="ui list">
            <a className="item" onClick={this._copy.bind(this, this.props.project.id)}>
              <span className="italic" dangerouslySetInnerHTML={{
                __html: this.highlight(this.props.project.id, this.props.search)
              }}></span>
              <i className="copy icon inline"></i>
            </a>
            <a className="item" onClick={this._open.bind(this, settings.APPENGINE, {id: this.props.project.id})}>App Engine :
              <span className="italic">{this.props.project.appEngineProjectId}</span>
              <i className="external icon inline"></i>
            </a>
            <a className="item" onClick={this._open.bind(this, settings.BILLING, {numericProjectId: this.props.project.numericProjectId})}>Billing :
              <span className="italic">
                {this.props.project.numericProjectId}</span>
              <i className="external icon inline"></i>
            </a>
            <a className="item" onClick={this._open.bind(this, settings.MONITORING, {id: this.props.project.id})}>Monitoring :
              <span className="italic" dangerouslySetInnerHTML={{
                __html: this.highlight(this.props.project.assignedIdForDisplay, this.props.search)
              }}></span>
              <i className="external icon inline"></i>
            </a>
          </div>
          {extra}
        </div>
      </div>
    );
  },

  _open: function(pattern, params) {
    bg.open(sprintf(pattern, params));
  },

  _copy: function(text) {
    bg.copy(text);
    window.close();
  }

});

module.exports = ProjectListItem;
