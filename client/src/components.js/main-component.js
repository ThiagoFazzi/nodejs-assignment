import React, { Component } from 'react'
import GaugeComponent from './gauge-component'
import io from "socket.io-client"
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react'
import axios from 'axios'
import ListComponent from './list-component'
import HeaderComponent from './header-component'
import FooterComponent from './footer-component'
import DetailComponent from './detail-component';



const styles = {
  background: {
    backgroundColor: 'green',
    width: '100%',
    height: 'auto',
    top: '105px',
    position: 'fixed'
  },
  map:{
    margin: '30px 2% 30px 5%',
    width: '43%',
    height: '400px',
    position: 'relative',
    display: 'inline-block',
    borderRadius: '20px',
  },
  chart: {
    width: '43%',
    margin: '30px 5% 7px 50%',
    position: 'relative',
    display: 'inline-block',
    height: 'auto',
    borderRadius: '20px',
    border: '2px solid white',
    backgroundColor: 'green',
    padding: '10px'
  },
  details: {
    width: '43%',
    margin: '15px 5% 20px 50%',
    position: 'relative',
    display: 'inline-block',
    height: '150px',
    borderRadius: '20px',
    backgroundColor: '#c2c2c2',
    padding: '10px'
  },
  logButton: {
    position: 'absolute',
    bottom: '15px',
    right: '40px',
  },
  logList: {
    backgroundColor: 'white',
    color: 'black',
    width: '100%',
    height: '255px',
    overflow: 'auto',
    position:  'relative',
    fontSize: '1.2em',
    marginTop: '15px',
    zIndex: 3
  },
  logScreen: {
    paddingTop: '10px',
    paddingLeft: '10px',
    paddingRight: '10px',
    bottom: '0px',
    color: 'white',
    width: '94%',
    height: '300px',
    margin: '0px 3% 0px 3%',
    position: 'absolute',
    backgroundColor: 'black',
    border: '1px solid black',
    borderRadius: '15px 15px 0 0',
    transition: 'bottom 2s easy',
    zIndex: 2,
  }
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
      logOpen: false,
      logs: [],
      limit: 5,
      incident: {
        time: '',
        msg:''
      }
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
        zoom: 17,
        sending: true,
      })
    })
    .on('Error', data => {
      this.setState({incident: {time: data.time, msg: data.msg}})
    })

    this.handleLog('test-bus-1', this.state.limit)
  }

  handleLogScreen = (e) => {
    (this.state.logOpen) ? this.setState({logOpen: false}) : this.setState({logOpen: true})
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
        <HeaderComponent />
        <div style={styles.background}>
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
              color="lime"
              strokeWidth="15"
              sqSize="120"
              percentage={this.state.speed}
              label={'km/h'}
              title={'Speed'}
            />
            <GaugeComponent
              color="blue"
              strokeWidth="15"
              sqSize="120"
              percentage={this.state.soc}
              label={'%'}
              title={'SOC'}
            />
            <GaugeComponent
              color="red"
              strokeWidth="15"
              sqSize="120"
              percentage={this.state.energy}
              label={'kw/h'}
              title={'Energy'}
            />
          </div>
          <div style={styles.details}>
              <DetailComponent online={this.state.online} distance={this.state.odo} incident={this.state.incident}/>
          </div>
        </div>
        <FooterComponent/>
        { this.state.logOpen &&
          <div style={styles.logScreen}>
            Log size: <input type="number" value={this.state.limit} onChange={(e)=>{ this.handleChangeLimit(e) }} min="1" max="50"></input>
            <button onClick={()=> this.handleLog('test-bus-1', this.state.limit)}>Refresh</button>
            <div style={styles.logList} onClick={this.handleLogScreen}>
              <ListComponent list={this.state.logs} />
            </div>
          </div>
        }
        <div style={styles.logButton}>
          <button onClick={this.handleLogScreen}>Logs</button>
        </div>
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_MAPS_KEY
})(MainComponent);