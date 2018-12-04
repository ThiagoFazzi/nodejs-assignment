import React from 'react'

const LogComponent =() => {
  const styles = {
    button: {
      position: 'absolute',
      bottom: '15px',
      right: '10px',
    }
  }

  return(
    <div style={styles.button}>
      <button>Logs</button>
    </div>
  )
}

export default LogComponent