import React from 'react'

const DetailComponent = ({online , distance, incident}) => {

  const styles = {
    online: {
      display: 'inline',
    },
    distance: {
      color: 'black',
      marginTop: '15px'
    },
    incident: {
      color: 'red',
      marginTop: '15px'
    },
    On: {
      color: 'green',
      fontSize: '2em',
      marginTop: '15px'
    },
    Off: {
      color: 'red',
      fontSize: '2em',
      marginTop: '15px'
    }
  }

  return(
    
    <div>
      <div style={styles.online}>
        <div style={(online)? styles.On : styles.Off }>
          {(online)? 'Online' : 'Offline'}
        </div>
        
      </div>

      <div style={styles.distance}>
        <div>{`Distance: ${distance} Km`}</div>
      </div>
      <div style={styles.incident}>
        <div>Incident:</div>
          {
           incident.time && <div>{`${new Date(incident.time).toLocaleString('de-DE', {hour12: true})} - ${incident.msg}`}</div>
          }
      </div>
    </div>
  )
} 

export default DetailComponent