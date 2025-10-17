const radioBrowser = require('radio-browser')

let filter = {
    limit: 5,          // list max 5 items
    by: 'tag',         // search in tag
    searchterm: 'jazz' // term in tag
}
radioBrowser.getStations(filter)
    .then(data => console.log(data))
    .catch(error => console.error(error))
    