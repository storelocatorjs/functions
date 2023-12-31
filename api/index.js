import db from '../db.json'
import Stores from '../stores.js'
import express, { urlencoded, json } from 'express'
import cors from 'cors'

const app = express()
var whitelistDomain = ['storelocator.js.org', 'localhost']
app.use(
	cors({
		origin: function (origin, callback) {
			if (whitelistDomain.indexOf(origin) !== -1) {
				callback(null, true)
			} else {
				callback(new Error('Storelocatorjs: Origin is not allowed by CORS'))
			}
		}
	})
)
app.use(urlencoded({ extended: true }))
app.use(json())

// Set the default route
app.post('/', (request, response) => {
	response.header('Content-type', 'application/json')

	// Get request parameters
	const lat = request.body.lat || null
	const lng = request.body.lng || null
	const radius = request.body.radius || null
	const limit = request.body.limit || null
	let results = null

	// Filter stores if parameters are valid
	if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
		const stores = new Stores({
			db,
			lat,
			lng,
			radius,
			limit
		})
		results = stores.init()
	}

	// Send status 200 with JSON results
	response.json(results)
})

const port = process.env.PORT || 8000
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})

export default app
