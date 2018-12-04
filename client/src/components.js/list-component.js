import React from 'react'

const styles = {
  cell:{
    textAlign: 'center',
    paddingLeft: '20px',
    paddingRight: '30px'
  },
  tableHead: {
    position: 'fixed'
  }
  //position: 'absolute'
};


const ListComponent = ({ list }) => {
  if(!list.vehicles) return <p>Loading</p>
  return(    <div>
      <table>
        <thead>
          <tr>
              <th scope="col">Name</th>
              <th scope="col">Time</th>
              <th scope="col">Speed</th>
              <th scope="col">Lat</th>
              <th scope="col">Lng</th>
              <th scope="col">Energy</th>
              <th scope="col">SOC</th>
              <th scope="col">ODO</th>
          </tr>
        </thead>
        <tbody>
        {list.vehicles.map(item => 
          <tr key={item._id}>
            <td style={styles.cell}>{item.name}</td>
            <td style={styles.cell}>{item.time}</td>
            <td style={styles.cell}>{item.speed}</td>
            <td style={styles.cell}>{item.gps[0]}</td>
            <td style={styles.cell}>{item.gps[1]}</td>
            <td style={styles.cell}>{item.energy}</td>
            <td style={styles.cell}>{item.soc}</td>
            <td style={styles.cell}>{item.odo}</td>
          </tr>
        )}
        </tbody>
      </table>
    </div>
  )
}

export default ListComponent