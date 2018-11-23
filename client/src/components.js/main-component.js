import React, { Component } from 'react'
import GaugeComponent from './gauge-component';
import io from "socket.io-client";
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const styles = {
  map:{
    margin: '0 auto',
    width: '80%',
    height: '300px',
  },
  chart: {
    width: '40%',
    margin: '300px 0px 0px 10%',
    position: 'absolute',
    display: 'inline-box'
  },
  ledOn: {
    border: '1px solid #c2c2c2',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    backgroundColor: 'lime',
    display: 'inline-block'
  },
  ledOff: {
    display: 'inline-block',
    backgroundColor: 'red',
    border: '1px solid #c2c2c2',
    borderRadius: '50%',
    width: '20px',
    height: '20px'
  }
  //position: 'absolute'
};

class MainComponent extends Component {
  constructor(){
    super()
    this.state = {
      speed: 0,
      soc: 0,
      energy: 0,
      lat: 0,
      lng: 0,
      zoom: 2,
      online: false,
    }
  }

  componentDidMount(){
    const socket = io.connect('ws://localhost:8080', {autoConnect: true});
    socket
    .on('connect_error',() => console.log('Trying to connect'))//('connect', ()=>console.log('erro'))
    .on('disconnect', () => {
      this.setState({online: false})
    })
    .on('connect', () => {
      this.setState({online: true})
    })
    .on("Vehicle", data => {
      this.setState({
        speed: data.speed,
        soc: data.soc.$numberDecimal,
        energy: data.energy.$numberDecimal,
        lat: data.gps[0],
        lng: data.gps[1],
        zoom: 16,
        sending: true,
      })
    })
  }



  render() {
    return (
      <div>
        <Map
          google={this.props.google}
          zoom={this.state.zoom}
          style={styles.map}
          initialCenter={{
            lat: `${this.state.lat}`,
            lng: `${this.state.lng}`
          }}
          center={{
            lat: `${this.state.lat}`,
            lng: `${this.state.lng}`
          }}
        >
          <Marker
            name={'Your position'}
            position={{lat: `${this.state.lat}`, lng:  `${this.state.lng}`}}
          />
        </Map>
        <div style={styles.chart}>
        <GaugeComponent
          color="green"
          strokeWidth="15"
          sqSize="80"
          percentage={this.state.speed}
          label={'km/h'}
          title={'Speed'}
        />
        <GaugeComponent
          color="blue"
          strokeWidth="15"
          sqSize="80"
          percentage={this.state.soc}
          label={'%'}
          title={'SOC'}
        />
        <GaugeComponent
          color="red"
          strokeWidth="15"
          sqSize="80"
          percentage={this.state.energy}
          label={'kw/h'}
          title={'Energy'}
        />
        <div style={(this.state.online)? styles.ledOn : styles.ledOff }></div>
        </div>

      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyA1hygOKnk5N5aJ3-oHHzYQ-031Ug-OP_U'
})(MainComponent);

