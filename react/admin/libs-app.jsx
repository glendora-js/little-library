var React = require('react');

var FilterBox = React.createClass({
  render :  function(){
    return (
      <div className="well filters">
        <div className="row"> 
          <div className="col-sm-4">
            <div className="form-group">
              <label>City</label> 
              <input type="text" name="city" value="" className="form-control" placeholder="Glendora" autoFocus={true} onKeyDown={this.props.handleKeyDown}/>
            </div>
            <div className="form-group">
              <label>Zipcode</label>
              <input type="text" name="zipcode" value="" className="form-control" placeholder="91740" autoFocus={true} onKeyDown={this.props.handleKeyDown}/>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="form-group">
              <label>Steward</label>
              <input type="text" name="steward" value="" className="form-control" placeholder="John Doe" autoFocus={true} onKeyDown={this.props.handleKeyDown}/>
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="text" name="email" value="" className="form-control" placeholder="email@email.com" autoFocus={true} onKeyDown={this.props.handleKeyDown}/>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="form-group">
              <label> Status </label>
              <div className="dropdown">
                <button className="btn btn-default dropdown-toggle" type="button" id="filterStatus" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                  {this.props.filter.status}
                </button>
                <ul className="dropdown-menu" aria-labelledby="filterStatus">
                  <li><a href="#" className={this.props.filter.status == "all" ? 'hide' : ''} onClick={this.props.filterLibs}>all</a></li>
                  <li><a href="#" className={this.props.filter.status == "enabled" ? 'hide' : ''} onClick={this.props.filterLibs}>enabled</a></li>
                  <li><a href="#" className={this.props.filter.status == "disabled" ? 'hide' : ''} onClick={this.props.filterLibs}>disabled</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

var Pagination = React.createClass({
  render : function(){}
});

var LibItem = React.createClass({
  formatStory : function(story){
    return story.substring(0,30) + "...";
  },
  showStatus : function(status){
    return status ? "enabled" : "disabled";
  },
  render : function(){
    return (
      <tr>
        <td> {this.props.lib.name} </td>
        <td> {this.formatStory(this.props.lib.story)} </td>
        <td> {this.props.lib.street} </td>
        <td> {this.props.lib.city} </td>
        <td> {this.props.lib.state} </td> 
        <td> {this.props.lib.zip} </td>
        <td> {this.props.lib.email} </td>
        <td> {this.props.lib.steward_name} </td>
        <td> 
          <div className="btn-group">
            <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" ariahaspopup="true" aria-expanded="false">
              {this.showStatus(this.props.lib.status)}  
            </button>
              <ul className="dropdown-menu">
                <li><a href="#" className={!this.props.lib.status ? 'hide' : ''} onClick={this.props.filterLibs}>disable</a></li>
                <li><a href="#" className={this.props.lib.status ? 'hide' : ''} onClick={this.props.filterLibs}>enable</a></li>
              </ul>
          </div>
        </td>
        <td> 
          <button className="btn btn-primary" onClick="">
            <i className="fa fa-pencil"></i> 
          </button>
          <button style={{"marginLeft":"4px"}} className="btn btn-danger" onClick="">
            <i className="fa fa-trash"></i>  
          </button>
        </td>
      </tr>
    );
  }
});

var LibsApp = React.createClass({
  getInitialState : function(){
    return {
      filter : { 
        city : '',
        name : '',
        status: 'all',
      },
      libs : this.props.libs
    };
  },
  editLib : function(lib){
    console.log('edit');
  },
  deleteLib : function(lib){
    console.log('delete');
    //TODO trigger delete warning
  },
  createLib : function(lib){
    console.log('create');
  },
  filterLibs : function(){
    console.log('filter libs');
  },
  handleKeyDown : function(event){
    console.log('key down');
  },
  toggleStatus : function(lib){
    console.log('status');
  },

  render : function(){
    return (
      <div>
        <FilterBox
          filter={this.state.filter}
          filterLibs={this.filterLibs}
          handleKeyDown={this.handleKeyDown}
        />
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th> Name </th>
              <th> Story </th>
              <th> Location </th>
              <th> Street </th>
              <th> City </th>
              <th> State </th>
              <th> Zip </th>
              <th> Email </th>
              <th> Status </th>
              <th> Action </th>
            </tr>
          </thead>
          <tbody>
            {this.state.libs.map(function(lib, i){
              var editLib = this.editLib.bind(this, lib);
              var deleteLib = this.deleteLib.bind(this, lib); 
              var toggleStatus = this.toggleStatus.bind(this, lib);
              return (
                <LibItem
                  lib={lib}
                  editLib={editLib}
                  deleteLib={deleteLib}
                  toggleStatus={toggleStatus}
                  key={i}
                />
              );
            }, this)}
          </tbody>
        </table>
      </div> 
    );
  }
});

module.exports = LibsApp;
