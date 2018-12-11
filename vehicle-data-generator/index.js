const csvParse      = require ( "csv-parse")
const csvStringify   = require('csv-stringify')
const fs            = require ( "fs")
const Writable      = require ("stream").Writable

var array = []

const NATS = require("nats")
const nats = NATS.connect({json: true})

const readOutLoud = (vehicleName) => {

	const fileStream = fs.createReadStream("./meta/route.csv")

	// =========================
	// Question Point 1:
	// What's the difference betweeen fs.createReadStream, fs.readFileSync, and fs.readFileAsync?
	// And when to use one or the others
	// Answer: 
	// fs.createReadStream -  Synchronously read the file in chunks, saiving memory, 
	//                        it is used in cases of files are big
	//
	// fs.readFileSync - Asynchronously read the entire file and alocated in memory, 
	//                   usually is used in small files.
	// 

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
					array.unshift(obj)
					
				}, Math.ceil(Math.random() * 150))
			}
		})))
	// =========================
	// Question Point 2:
	// What would happend if it failed to publish to nats or connection to nats is slow?
	// Maybe you can try to emulate those slow connection
	//
	// Answer: Nats cut off the connection when the customer connection is slow
	// =========================
}

const reversePath = () => {

	let backArray =[]
	let columns = {
		time: 'time',
		energy: 'energy',
		gps: 'gps',
		odo: 'odo',
		speed: 'speed',
		soc: 'soc',
	}
	array.map((item, i) => backArray.push([item.time,item.energy,item.gps,item.odo,item.speed,item.soc]))

	csvStringify(backArray, { header: true, columns: columns }, (err, output) => {
		if (err) throw err
		fs.writeFile('./meta/back.csv', output, (err) => {
			if (err) throw err
		});
	})
}

const readOutLoudBack = (vehicleName) => {
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

// This next few lines simulate Henk's (our favorite driver) shift
console.log('Henk checks in on test-bus-1 starting his shift...')
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
			Promise.resolve(reversePath())
				.then(_ => {
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
				}
			)
		}, 6000);
	})


// To make your presentation interesting maybe you can make henk drive again in reverse

