import React from 'react'

const HeaderComponent = () => {

  const styles = {
    header:{
      position: 'fixed',
      top: '0px',
      marginBottom: '5px',
      width: '100%',
      height: '100px',
      backgroundColor: 'green',
      paddingLeft: '60px',
      color: 'white'
    }
  }

  return(
    <div>
      <div style={styles.header}>
        <h1>Vehicle Tracker</h1>
      </div>
    </div>
  )


}

export default HeaderComponent
