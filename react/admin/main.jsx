var React = require('react'),
  ReactDOM = require('react-dom'),
  LibsApp = require('./libs-app.jsx');

//LIBRARY LIST

if (typeof libs !== 'undefined'){
  ReactDOM.render(
    <LibsApp initialLibs={libs} initialFilters={filter_data}/>, 
    document.getElementById('libraries')
  );
}
