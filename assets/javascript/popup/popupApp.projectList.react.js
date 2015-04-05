/** @jsx React.DOM */

/*jshint -W109*/
/*jshint -W108*/

'use strict';

var React = require('react');
var ProjectListItem = require('./popupApp.projectListItem.react');

var ProjectList = React.createClass({
    render: function () {

        var projectItems = [];

        for (var key in this.props.projects) {
            projectItems.push(
                <ProjectListItem project={this.props.projects[key]} search={this.props.search} />
            );
        }

        return (
            <div className="ui divided items">
            {projectItems}
            </div>
        );
    }
});

module.exports = ProjectList;
