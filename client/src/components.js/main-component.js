import React, { Component } from 'react'
import GaugeComponent from './gauge-component';
import socketIOClient from "socket.io-client";
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const styles = {
  map:{
    width: '60%',
    height: '100%',
    //float: 'right',
  },
  chart: {
    top: '100px',
    right: '100px',
    position: 'absolute',
  }
  //position: 'absolute'
};

class MainComponent extends Component {

  constructor(){
    super()
    this.state = {
      speed: 0,
      lat: 52.093448638916016,
      lng: 5.117378234863281,
    };
  }


  componentDidMount(){
    //const { endpoint } = this.state;
    const socket = socketIOClient('ws://localhost:8080');
    //socket.on("FromAPI", data => this.setState({ response: data }));
    socket.on("Vehicle", data => {
      this.setState({
        speed: data.speed,
        lat: data.gps[0],
        lng: data.gps[1]
      })
    })
  }



  render() {
    return (
      <div>
        <div style={styles.chart}>
        <GaugeComponent
          color="green"
          strokeWidth="5"
          sqSize="100"
          percentage={this.state.speed}
        />
        </div>
        <Map
          google={this.props.google}
          zoom={16}
          style={styles.map}
          center={{
            lat: `${this.state.lat}`,
            lng: `${this.state.lng}`
          }}
        >
          <Marker
            name={'Your position'}
            //position={{lat: 52.093448638916016, lng:  5.117378234863281}}
            position={{lat: `${this.state.lat}`, lng:  `${this.state.lng}`}}
          />
        </Map>
        
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyA1hygOKnk5N5aJ3-oHHzYQ-031Ug-OP_U'
})(MainComponent);

