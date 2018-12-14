const csvParse      = require ( "csv-parse")
const csvStringify   = require('csv-stringify')
const fs            = require ( "fs")
const Writable      = require ("stream").Writable

var array = []

const NATS = require("nats")
const nats = NATS.connect({json: true})

const readOutLoud = (vehicleName) => {
	const fileStream = fs.createReadStream("./meta/route.csv")
	let i = 0
	return (fileStream 
		.pipe(csvParse({ delimiter: ",", columns: true, cast: true }))
		.pipe(new Writable({
			objectMode: true,
			write(obj, enc, cb) {	

				setTimeout(() => {

					i++
					if((i % 100) === 0)
						console.log(`vehicle ${vehicleName} sent have sent ${i} messages`)

					nats.publish(`vehicle.done.${vehicleName}`, obj, cb)
					
				}, Math.ceil(Math.random() * 150))
			}
		})))

}

const reversePath = () => {

  const fileIn = fs.createReadStream('./meta/route.csv')
 
  fileIn.on('data', (chunk) => {
    let line = String(chunk).split('\n')
    for(var i = 1; i<line.length ; i++){
      array.unshift({
        time: line[i].split(',')[0],
        energy: line[i].split(',')[1],
        gps: line[i].split(',')[2],
        odo: line[i].split(',')[3],
        speed: line[i].split(',')[4],
        soc: line[i].split(',')[5],
      })
    }
  })
  
  
  fileIn.on('end', () => {
    for(var i = 2 ; i<array.length ; i++){
      array[i].time = Number(array[i-1].time) + 1000
      array[i].gps = array[i].gps
      array[i].odo = (Number(array[i-1].odo) + .02).toFixed(3)
      if(i % 10 === 0) {
        array[i].energy = (Number(array[i-1].energy) + .064).toFixed(3)
      } else {
        array[i].energy = (Number(array[i-1].energy)).toFixed(3)
      }
      if(i % 100 === 0) {
        array[i].soc = (Number(array[i-1].soc) - 1.2).toFixed(3)
      } else {
        array[i].soc = (Number(array[i-1].soc)).toFixed(3)
      }
    }
  
    let backArray =[]
    let columns = {
      time: 'time',
      energy: 'energy',
      gps: 'gps',
      odo: 'odo',
      speed: 'speed',
      soc: 'soc',
    }file
 
    csvStringify(array, { header: true, columns: columns }, (err, output) => {
      if (err) throw err
      fs.writeFile('./meta/back.csv', output, (err) => {
        if (err) throw err
      });
    })
  })
}

const readOutLoudBack = (vehicleName) => {
  
  reversePath()
  
  const fileStream = fs.createReadStream("./meta/back.csv")
	let i = 0
	return (fileStream 
		.pipe(csvParse({ delimiter: ",", columns: true, cast: true }))
		.pipe(new Writable({
			objectMode: true,
			write(obj, enc, cb) {	
				setTimeout(() => {

					i++
					if((i % 100) === 0)
						console.log(`vehicle ${vehicleName} sent have sent ${i} messages`)

					nats.publish(`vehicle.done.${vehicleName}`, obj, cb)
					
				}, Math.ceil(Math.random() * 150))
			}
		})))
}


console.log('Henk checks in on test-bus-1 starting his shift...')
const obj = {
  time: 1511436338000,
  gps: '52.093448638916016|5.117378234863281',
  msg: 'Henk checks in on test-bus-1 starting his shift...'
}
nats.publish('vehicle.error.test-bus-1', obj)

readOutLoud('test-bus-1')
	.once('finish', () => {

		const obj = {
			time: 1511437648000,
			gps: '52.089332580566406|5.1061015129089355',
			msg: 'henk is on the last stop and he is taking a cigarrete while waiting for his next trip'
		}
		nats.publish('vehicle.error.test-bus-1', obj)
		console.log('henk is on the last stop and he is taking a cigarrete while waiting for his next trip')

    setTimeout(() => {

      const obj = {
        time: 1511437648000,
        gps: '52.089332580566406|5.1061015129089355',
        msg: 'henk starts a new trip - return journey'
      }
      nats.publish('vehicle.error.test-bus-1', obj)
      console.log('henk starts now a back trip')

      readOutLoudBack('test-bus-1')
        .once('finish', () => {
          const obj = {
            time: 1511436338000,
            gps: '52.093448638916016|5.117378234863281',
            msg: 'henk arrives to the destination'
          }
          nats.publish('vehicle.error.test-bus-1', obj)
          console.log('henk arrives to the destination')
      })
		}, 6000);
	})


// To make your presentation interesting maybe you can make henk drive again in reverse

