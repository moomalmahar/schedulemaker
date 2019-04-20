const createClient = require('hafas-client')
const nahshProfile = require('hafas-client/p/nahsh')
const client = createClient(nahshProfile, 'my-awesome-program')
let moment = require('moment');



module.exports = {

    async post(req, res) {
        let names = []
        let alllocations = []
        try {
            if (req.body.search) {
                let searchterm = 'Kiel ' + req.body.search
                client.locations(searchterm)
                    .then((locations) => {
                        getLocation(locations, res, alllocations)
                    })
                    .catch(console.error)
            } else if (req.body.id) {
                let alljourneys = []
                let dest = req.body.id.toString()
                let arrivalTime = moment(req.body.arrival, 'YYYY-MM-DD HH:mm').format()
                client.journeys(dest, '9049033', {arrival: arrivalTime})
                    .then((journeys) => {
                        getJourneys(journeys, res, alljourneys)
                    })
                    .catch(console.error)
            } else {
                client.nearby({
                    type: 'location',
                    latitude: req.body.lat,
                    longitude: req.body.lon
                }, {distance: 500})
                    .then((nearby) => {
                        getNearby(nearby, res, names)
                    })
                    .catch(console.error)
            }
        } catch (err) {
            res.status(500).send({
                error: "Couldn't create song"
            })
        }
    }

}

function getJourneys(journeys, res, alljourneys) {
    for (let i = 0; i < journeys.length; i++) {
        let oneleg = []
        let mode = ''
        for (let j = 0; j < journeys[i].legs.length; j++) {
            if (journeys[i].legs[j].mode) {
                mode = 'walk'
            } else {
                mode = journeys[i].legs[j].line.name
            }
            oneleg.push({
                destination: journeys[i].legs[j].destination.name,
                arrival: journeys[i].legs[j].arrival,
                departure: journeys[i].legs[j].departure,
                mode: mode
            })
        }
        alljourneys.push({legs: oneleg})
    }
    res.send(alljourneys)
}
function getLocation(locations, res, alllocations) {
    for (let i = 0; i < locations.length; i++) {
        if (locations[i].type === 'location') {
            continue
        }
        alllocations[i] = locations[i]
    }
    names = alllocations.filter(e => e)
    res.send(JSON.stringify(names))
}
function getNearby(nearby, res,names){
    for (let i = 0; i < nearby.length; i++) {
        names[i] = nearby[i]
    }
    res.send(JSON.stringify(names))
}