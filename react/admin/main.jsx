var React = require('react'),
  ReactDOM = require('react-dom'),
  LibsApp = require('./libs-app.jsx');

ReactDOM.render(
  <LibsApp libs={libs}/>, 
  document.getElementById('libraries')
);
