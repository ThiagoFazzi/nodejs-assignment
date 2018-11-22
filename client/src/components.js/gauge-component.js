import React from 'react'

const GaugeComponent = ({percentage, strokeWidth, sqSize, color}) => {


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
      fontSize: `${sqSizeT * 0.015}em`,
      fontWeight: 'bold',
      fill: `${color}`,
    }
  }

  return (
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
          transform={`rotate(90 ${sqSize / 2} ${sqSize / 2})`} />
        <text
          style={styles.circleText}
          x="50%"
          y="50%"
          dy=".3em"
          textAnchor="middle">
          {`${percentage}%`}
        </text>
    </svg>
  )
}

export default GaugeComponent