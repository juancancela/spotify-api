const request = require('request')
const express = require('express')
const cors = require('cors')
const app = express()

const PORT = 3090
const CLIENT_ID = '66f04f7cdae543949e5ead480e75c7d5'
const CLIENT_SECRET = 'd93fe250d82d4ff78178058e3ff6d457'
const SPOTIFY_AUTH_ENDPOINT = 'https://accounts.spotify.com/api/token'
const SPOTIFY_TRACK_ENDPOINT = 'https://api.spotify.com/v1/search?type=track&q='

app.use(cors())

var token

function authOpts() {
    return {
        url: SPOTIFY_AUTH_ENDPOINT,
        headers: {
            'Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
        },
        form: {
            grant_type: 'client_credentials'
        },
        json: true
    }
}


function searchOpts(searchValue = "", token) {
    return {
        url: SPOTIFY_TRACK_ENDPOINT + searchValue,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        json: true
    }
}

app.get('/tracks', (req, res) => {
    let searchValue = req.query.q || ''
    if (!token) {
        request.post(authOpts(), (err, rsp, body) => {
            token = body.access_token
            request.get(searchOpts(searchValue, token), (err, rsp, body) => {
                res.send(body.tracks)
            })
        })
    } else {
        request.get(searchOpts(searchValue, token), (err, rsp, body) => {
            res.send(body.tracks)
        })
    }
})

app.listen(PORT, () => {
    console.log(`spotify-test-app-api listening on port ${PORT}`);
});

setInterval(function() {
    token = null;
}, 150000);
