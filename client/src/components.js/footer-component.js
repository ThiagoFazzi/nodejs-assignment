import React from 'react'

const FooterComponent = () => {
  const styles = {
    footer: {
      position: 'fixed',
      bottom: '0px',
      width: '100%',
      height: '60px',
      backgroundColor: 'green',
      paddingLeft: '30px',
      color: 'white'
    }
  }

  return(
    <div style={styles.footer}>
      <p>Viriciti assignment</p>
    </div>
  )
}

export default FooterComponent