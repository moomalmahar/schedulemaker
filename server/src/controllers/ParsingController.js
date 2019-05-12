let timetable = [] // stores refined timetable ready to be inserted in DB
let fs = require('fs')
let PDFParser = require('pdf2json')
let pdfParser = new PDFParser()
let convertJSON = require('./RefineJson')

module.exports = {
    async post (req, res) {
        try {
            pdfParser.on('pdfParser_dataReady', function (pdfData) {
                toJSONRefine(pdfData)
            })
            pdfParser.loadPDF('src/newpdfs/schedules.pdf')
            let rawdata = fs.readFileSync('src/newpdfs/created.json')
            let oneclass = JSON.parse(rawdata)
            let newjson = []
            let coursearray = []
            // TODO: parse the JSON
            for (let i = 0; i < oneclass.length; i++) {
                // TODO: first check if title and detail are empty
                if (oneclass[i].title === '' && oneclass[i].detail === '') {
                    continue
                }
                // TODO: check if only title is empty
                else if (oneclass[i].title === '') {
                    // TODO: if detail contains CAU then class university = CAU else it is FH Kiel
                    // TODO: put these in a function so that they can be reused but for now let them be \m/ cheers
                    if (oneclass[i].detail.includes('CAU')) {
                        oneclass[i].university = 'CAU'
                        // TODO: remove the university from detail so that we're left with professor and module name and class location
                        oneclass[i].detail = oneclass[i].detail.replace('CAU', '')
                    } else {
                        oneclass[i].university = 'FH Kiel'
                    }
                    // TODO: get the class number which is generally something like C01-0.01 for which we use a regex
                    // TODO: put these in a function so that they can be reused but for now let them be \m/ cheers
                    let classlocationregex = new RegExp(/[C][0-9]{2}[-][0-9]{1,2}[.][0-9]{1,2}/)
                    let classlocation = oneclass[i].detail.match(classlocationregex)
                    if (classlocation) {
                        oneclass[i].location = classlocation[0]
                        // TODO: remove the class location from detail so that we're left with professor and module name
                        oneclass[i].detail = oneclass[i].detail.replace(classlocation[0], '')
                    } else {
                        oneclass[i].location = 'N/A'
                    }
                    // TODO: check for course code eg PM100 using regex and then take rest to module name
                    let modulecoderegex = new RegExp(/[A-Z]{2}[0-9]{3}/)
                    let modulecode = oneclass[i].detail.match(modulecoderegex)
                    if (modulecode) {
                        let modulecodelocation = ''
                        oneclass[i].modulecode = modulecode[0]
                        // TODO: get the module name if there is a module code else return n/a
                        let splitarray = oneclass[i].detail.split(' ')
                        // TODO: get location in array of string where the module code is to split it
                        for (let i = 0; i < splitarray.length; i++) {
                            if (splitarray[i].includes(modulecode)) {
                                modulecodelocation = i
                                break
                            }
                        }
                        if (modulecodelocation > 0) {
                            coursearray = splitarray.slice(modulecodelocation + 1)
                            oneclass[i].title = coursearray.join(' ')
                        } else {
                            oneclass[i].title = 'N/A'
                        }
                    } else {
                        oneclass[i].modulecode = 'N/A'
                    }
                }

                // TODO: when there is a title populated, we do not need to parse the details for course name. we only need location from that
                // TODO: from the title we need to get the module code and then split the string for the module name
                else {
                    // TODO: take the detail and extract university and class location from it
                    if (oneclass[i].detail.includes('CAU')) {
                        oneclass[i].university = 'CAU'
                        // TODO: remove the university from detail so that we're left with professor and class location
                        oneclass[i].detail = oneclass[i].detail.replace('CAU', '')
                    } else {
                        oneclass[i].university = 'FH Kiel'
                    }
                    let classlocationregex = new RegExp(/[C][0-9]{2}[-][0-9]{1,2}[.][0-9]{1,2}/)
                    let classlocation = oneclass[i].detail.match(classlocationregex)
                    if (classlocation) {
                        oneclass[i].location = classlocation[0]
                    } else {
                        oneclass[i].location = 'N/A'
                    }

                    // TODO: get them module code outta the detail sis
                    // TODO: alsooooooo there is something i noticed which is that sometimes the course name is with - instead of spaces smh sis who made this
                    let modulecoderegex = new RegExp(/[A-Z]{2}[0-9]{3}/)
                    let modulecode = oneclass[i].detail.match(modulecoderegex)
                    if (modulecode) {
                        oneclass[i].modulecode = modulecode[0]
                    }
                }

                if (oneclass[i].title !== '') {
                    newjson.push({
                        moduleStart: oneclass[i].start,
                        moduleEnd: oneclass[i].end,
                        moduleCode: oneclass[i].modulecode,
                        moduleTitle: oneclass[i].title,
                        moduleLocation: oneclass[i].location,
                        moduleUniversity: oneclass[i].university
                    })
                }
            }
            fs.appendFile('src/newpdfs/nonempty.json', JSON.stringify(newjson), (err) => {
                if (err) throw err
            })
        } catch (err) {
            console.log(err)
        }
    }
}

function toJSONRefine (objdata) {
    timetable = convertJSON.convertPDF2JSON(objdata)
    try {
        fs.writeFile('src/newpdfs/created.json', JSON.stringify(timetable), (err) => {
            if (err) throw err
            console.log('File made')
        })
    } catch (err) {
        console.log('File not made')
    }
}
