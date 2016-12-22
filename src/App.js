import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import 'react-bootstrap';
import Button from 'react-bootstrap/lib/Button';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Clearfix from 'react-bootstrap/lib/Clearfix';
import Image from 'react-bootstrap/lib/Image';
import ResponsiveEmbed from 'react-bootstrap/lib/ResponsiveEmbed';
import FormControl from 'react-bootstrap/lib/FormControl';
import Form from 'react-bootstrap/lib/Form';
import InputGroup from 'react-bootstrap/lib/InputGroup';







require( 'google-client-api' )().then( function( gapi ) {
    gapi.client.setApiKey("AIzaSyDTigd2cW-BMTgOaZ6zQEm1i0k5bQ39n6Y");
    gapi.client.load('youtube', 'v3', function() {
                        Box.search();
                });
});

var Box = React.createClass({
  getInitialState: function(){
    return {ytResponse:[], currentVideo:[]}
  },
  search: function(word) {
    var q = word;
    console.log(gapi.client);
    var request = gapi.client.youtube.search.list({
      q: q,
      part: 'snippet',
      type: 'video',
      maxResults: 20
    });

    request.execute(function(response) {
      this.setState({ytResponse:response});
    }.bind(this));
  },

  getVideo: function(videoObj){
      this.setState({currentVideo:videoObj});


  },

  render: function(){
    return(
      <div className="root">
      <Row className="Box">
          <Col xs={4} className="title_column">
            <h1 className="title" >
              YouTube
            </h1>
          </Col>
          <Col xs={6}>
            <SearchBox onSearch={this.search}/>
          </Col>
          <Col xs={2}></Col>
      </Row>
      <Row align="center" className="video_row">
        <Col ></Col>
        <Col sm={10} md={9} className="playbox">
          <PlayBox videoObj={this.state.currentVideo} />
        </Col>
        <Col sm={2} md={3} className="ResultList_col">
          <div>
            <ResultList ytResponse={this.state.ytResponse} onGetVideo={this.getVideo}/>
          </div>
        </Col>
        <Col ></Col>

      </Row>
      </div>

    )
  }
});

var SearchBox = React.createClass({
  getInitialState: function() {
    return {text: ''};
  },

  handleSubmit: function(e){
    e.preventDefault();
    this.props.onSearch(this.state.text);
  },
  handleSearchChange: function(e){
    this.setState({text: e.target.value});
  },
  render:function(){
    return (
      <Form className="SearchBox" onSubmit={this.handleSubmit} horizontal>
        <Row>
          <Col className="Search_icon_col" xs={1}><InputGroup.Addon className="Search_icon">🔍</InputGroup.Addon></Col>
          <Col xs={9} className="Search_bar_col" >
            <FormControl className="Search_bar"  type="text"
                placeholder="Search YouTube"
                value={this.state.text}
                onChange={this.handleSearchChange}
                responsive/>
          </Col>
          <Col xs={2} className="Search_buttom_col"><FormControl className="Search_buttom" type="Submit" value="Search"/></Col>
        </Row>

      </Form>
    )
  }
});

var ResultList = React.createClass({
  render:function(){
    if (this.props.ytResponse.items==null){
      return null;
    }
    var getVideo = this.props.onGetVideo;
    var resultNodes = this.props.ytResponse.items.map(function(videoInfo){
      return(
        <Result videoInfo={videoInfo} onGetVideo={getVideo}/>
      );
    });
    return(
    <div className="ResultList">
      {resultNodes}
    </div>
    )
  }
});

var Result = React.createClass({
  handleClick: function(){
    this.props.onGetVideo(this.props.videoInfo);

  },
  render: function(){
    return(
      <div className="Result">
          <Image src={this.props.videoInfo.snippet.thumbnails.high.url} onClick={this.handleClick} responsive/ >
            {this.props.videoInfo.snippet.title}
      </div>
    )
  }
});

var PlayBox = React.createClass(
  {
    render:function(){
      console.log(this.props);
      if(this.props.videoObj.id===undefined){
        return null;
      }
      var url = "https://www.youtube.com/embed/"+this.props.videoObj.id.videoId;
      return(
        <div>
        <ResponsiveEmbed a16by9={true} className="PlayBox">
          <iframe width="1000" height="500" src={url}></iframe>
        </ResponsiveEmbed>
        <div>
          <p>{this.props.videoObj.snippet.channelTitle}</p>
          <p>{this.props.videoObj.snippet.description}</p>
        </div>
        </div>
      )
    }
  }
)
ReactDOM.render(
  <Box />,
  document.getElementById('root')
);
