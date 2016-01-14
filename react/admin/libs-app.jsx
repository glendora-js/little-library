var React = require('react');

var FilterBox = React.createClass({
  render :  function(){
    return (
      <div className="well filters">
        <div className="row"> 
          <div className="col-sm-4">
            <div className="form-group">
              <label>City</label> 
              <input name="city" defaultValue={this.props.filters.city} className="form-control" placeholder="Glendora" onChange={this.props.handleChange} autoFocus={true}/>
            </div>
            <div className="form-group">
              <label>Zipcode</label>
              <input name="zip" defaultValue={this.props.filters.zip} className="form-control" placeholder="91740" onChange={this.props.handleChange}/>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="form-group">
              <label>Steward</label>
              <input name="steward_name" defaultValue={this.props.filters.steward_name}  className="form-control" placeholder="John Doe" onChange={this.props.handleChange}/>
            </div>
            <div className="form-group">
              <label>Email</label>
              <input name="email" defaultValue={this.props.filters.email} className="form-control" placeholder="email@email.com" onChange={this.props.handleChange}/>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="form-group">
              <label> Status </label>
              <select name="status" className="form-control" defaultValue={this.props.filters.status} onChange={this.props.handleChange}>
                <option value="disable">disabled</option>
                <option value="enable">enabled</option>
                <option value="all">all</option>
              </select>
            </div>
          </div>
        </div>
        <div className="row">  
          <div className="form-group">
            <div className="col-sm-4">
              <button className="btn btn-success" id="filterLibs" onClick={this.props.filterLink}>
                Filter
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

//TODO Pagination needed for large list
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
            <button className="btn btn-default dropdown-toggle" data-toggle="dropdown" ariahaspopup="true" aria-expanded="false">
              {this.showStatus(this.props.lib.status)}  
            </button>
              <ul className="dropdown-menu">
                <li><a href="#" className={!this.props.lib.status ? 'hide' : ''} onClick={this.props.toggleStatus}>disable</a></li>
                <li><a href="#" className={this.props.lib.status ? 'hide' : ''} onClick={this.props.toggleStatus}>enable</a></li>
              </ul>
          </div>
        </td>
        <td> 
          <a className="btn btn-primary" href={"/admin/library/" + this.props.lib.library_id}>
            <i className="fa fa-pencil"></i> 
          </a>
          <button className="btn btn-danger" onClick={this.props.deleteLib}>
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
      filters : {
        status : (this.props.initialFilters['status']) ? this.props.initialFilters['status'] : 'all',
        city : this.props.initialFilters.city,
        zip: this.props.initialFilters.zip,
        steward_name : this.props.initialFilters.steward_name,
        email : this.props.initialFilters.email
      },
      libs : this.props.initialLibs
    };
  },
  handleChange : function(e){
    var filterValue = e.target.value;
    var filterName = e.target.name;
    if (filterValue.length > 0){
      this.state.filters[filterName] = filterValue; 
    } else {
      this.state.filters[filterName] = '';
    }
    this.setState(this.state);
  },
  filterLink : function(e){
    var filter_link = "/admin/libraries";
    var params = "";
    for (var key in this.state.filters){
      if (this.state.filters[key] && this.state.filters[key].length > 0){
        params = (params.length > 0) ? params + "&" : params + "?";
        params = params + key + "=" + encodeURIComponent(this.state.filters[key].trim());
      }
    }
    if (params.length > 0){ 
      window.location.href = filter_link + params; 
    }
  },
  deleteLib : function(library){
    var result = window.confirm('Are you sure?');
    var token = document.querySelector('meta[name="csrf-token"]').getAttribute("content");
    if (result){
      var data = { library_id : library.library_id };
      $.ajax({
        url : '/admin/library/delete',
        type : 'POST',
        beforeSend : function (xhr) {
          xhr.setRequestHeader('X-CSRF-Token', token);
        },
        contentType : 'application/json; charset=utf-8',
        data : JSON.stringify(data),
        success : function(res){
          this.state.libs = this.state.libs.filter(function(item){
            return item.library_id !== library.library_id;
          });
          this.setState(this.state);
        }.bind(this),
        error : function(res){
          window.alert("Error: could not delete library");
        }.bind(this)
      });
    }
  },
  toggleStatus : function(library){
    var data = {
      library_id : library.library_id,
      status : !library.status,
      partial : true
    };
    var token = document.querySelector('meta[name="csrf-token"]').getAttribute("content");
    $.ajax({
      url : '/admin/library/' + library.library_id,
      type : 'POST',
      cache : false,
      beforeSend : function (xhr) {
        xhr.setRequestHeader('X-CSRF-Token', token);
      },
      contentType : 'application/json; charset=utf-8',
      data : JSON.stringify(data),
      success : function(res){
        library.status = !library.status;
        this.setState(this.state);
      }.bind(this)
    });
  },
  render : function(){
    return (
      <div>
        <FilterBox
          filters={this.state.filters}
          handleChange={this.handleChange}
          filterLink={this.filterLink}
        />
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th> Name </th>
              <th> Story </th>
              <th> Street </th>
              <th> City </th>
              <th> State </th>
              <th> Zip </th>
              <th> Email </th>
              <th> Steward </th>
              <th> Status </th>
              <th> Action </th>
            </tr>
          </thead>
          <tbody>
            {this.state.libs.map(function(library, i){
              var deleteLib = this.deleteLib.bind(this, library); 
              var toggleStatus = this.toggleStatus.bind(this, library);
              return (
                <LibItem
                  lib={library}
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
