import React from 'react'

const GaugeComponent = ({percentage, strokeWidth, sqSize, color, label, title}) => {


  const sqSizeT = sqSize;
  const radius = (sqSize - strokeWidth) / 2;
  const viewBox = `0 0 ${sqSizeT} ${sqSizeT}`;
  const dashArray = radius * Math.PI * 2;
  const dashOffset = dashArray - dashArray * (percentage) / 100

  const styles = {
    circleBackground: {
      fill: 'none',
      stroke: '#f4f4f4'
    },
    circleProgress: {
      fill: 'none',
      stroke: `${color}`,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      strokeDasharray: `${dashArray}`, 
      strokeDashoffset: `${dashOffset}`,
      transition: 'stroke-dashoffset 2s, stroke-dasharray 2s',
    },
    circleText: {
      fontSize: `${sqSizeT * 0.010}em`,
      fontWeight: 'bold',
      fill: `${color}`,
    },
    control: {
      margin: '10px',
      display: 'inline-block',
      textAlign: 'center'
    },
    title: {
      color: `${color}`,
      fontSize: `${sqSizeT * 0.015}em`,
      fontWeight: 'bold',
    }
  }

  return (
    <div style={styles.control}>
    <div>{title}</div>
      <svg
          width={sqSize}
          height={sqSize}
          viewBox={viewBox}>
          <circle
            style={styles.circleBackground}
            cx={sqSize / 2}
            cy={sqSize / 2}
            r={radius}
            strokeWidth={`${strokeWidth}px`}
            transform={`rotate(90 ${sqSize / 2} ${sqSize / 2})`}
          />
          <circle
            style={styles.circleProgress}
            cx={sqSize / 2}
            cy={sqSize / 2}
            r={radius}
            strokeWidth={`${strokeWidth}px`}
            transform={`rotate(90 ${sqSize / 2} ${sqSize / 2})`} 
          />
      </svg>
      <div>{`${percentage} ${label}`}</div>
    </div>
  )
}

export default GaugeComponent