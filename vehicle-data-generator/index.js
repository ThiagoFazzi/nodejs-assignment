
/*

In this file you will find how we send raw data to other services via nats
There are 2 question points for you to tell us the answer on your presentation
If you're up for it

*/
const csvParse      = require ( "csv-parse")
const csvStringify   = require('csv-stringify')
const fs            = require ( "fs")
const Writable      = require ("stream").Writable

var array = []

// NATS Server is a simple, high performance open source messaging system
// for cloud native applications, IoT messaging, and microservices architectures.
// https://nats.io/
// It acts as our pub-sub (https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern)
// mechanism for other service that needs raw data

const NATS = require("nats")

// At this point, do not forget to run NATS server!

// NATS connection happens here
// After a connection is made you can start broadcasting messages (take a look at nats.publish())

const nats = NATS.connect({json: true})
//const arrayFile = []

// This function will start reading out csv data from file and publish it on nats
const readOutLoud = (vehicleName, direction) => {

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
	// fs.readFileAsync -  
	// =========================

	// Now comes the interesting part,
	// Handling this filestream requires us to create pipeline that will transform the raw string
	// to object and sent out to nats
	// The pipeline should looks like this
	//
	//  File -> parse each line to object -> published to nats
	//

	let i = 0

	//console.log(fileStream)
	return (fileStream 
		
		// Filestream piped to csvParse which accept nodejs readablestreams and parses each line to a JSON object
		.pipe(csvParse({ delimiter: ",", columns: true, cast: true }))
		
		// Then it is piped to a writable streams that will push it into nats
		.pipe(new Writable({
			objectMode: true,
			write(obj, enc, cb) {	
				// setTimeout in this case is there to emulate real life situation
				// data that came out of the vehicle came in with irregular interval
				// Hence the Math.random() on the second parameter
				setTimeout(() => {

					i++
					if((i % 100) === 0)
						console.log(`vehicle ${vehicleName} sent have sent ${i} messages`)

					// The first parameter on this function is topics in which data will be broadcasted
					// it also includes the vehicle name to seggregate data between different vehicle

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

