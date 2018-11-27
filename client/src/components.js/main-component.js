import React, { Component } from 'react'
import GaugeComponent from './gauge-component'
import io from "socket.io-client"
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react'
import axios from 'axios'
import ListComponent from './list-component';

const styles = {
  map:{
    margin: '0 auto',
    width: '80%',
    height: '300px',
  },
  chart: {
    width: '30%',
    margin: '300px 0px 0px 10%',
    position: 'absolute',
    display: 'inline-box',
    height: '250px',
    border: '1px solid black'
  },
  log: {
    width: '50%',
    height: '250px',
    margin: '300px 0px 0px 40%',
    position: 'absolute',
    display: 'inline-box',
    overflow: 'auto',
    fontSize: '.8em',
    border: '1px solid black'
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
      odo: 0,
      lat: 0,
      lng: 0,
      zoom: 2,
      online: false,
      logs: [],
      limit: 5
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
        soc: data.soc,
        energy: data.energy,
        lat: data.gps[0],
        lng: data.gps[1],
        odo: data.odo,
        zoom: 16,
        sending: true,
      })
    })

    this.handleLog('vehicle.test-bus-1', this.state.limit)
  }

  handleChangeLimit = (e) => {
    this.setState({limit: e.target.value})
  }

  handleLog = (vehicle, limit) => {
    axios.get(`http://localhost:8080/vehicle/${vehicle}/limit/${limit}`)
    .then(response => {
      this.setState({logs: response.data});
    })
    .catch(function (error) {
      console.log(error);
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
          <div>
            Online: <div style={(this.state.online)? styles.ledOn : styles.ledOff }></div>
          </div>
          <div>
            Log size: <input type="number" value={this.state.limit} onChange={(e)=>{ this.handleChangeLimit(e) }} min="1" max="50"></input>
            <button onClick={()=> this.handleLog('vehicle.test-bus-1', this.state.limit)}>Refresh</button>
          </div>
          <div>
            <h5>{`Distance: ${this.state.odo} Km`}</h5>
          </div>
        </div>
        <div style={styles.log}>
        <ListComponent list={this.state.logs} />
        </div>
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_MAPS_KEY
})(MainComponent);