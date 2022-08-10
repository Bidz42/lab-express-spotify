require('dotenv').config();

const { query } = require('express');
const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
// Our routes go here:

app.get('/', (req, res) => {
    res.render('index')
});

app.get('/artists', (req, res) => {
    spotifyApi
        .searchArtists(req.query.search)
        .then(data => {
            res.render('artists', { items: data.body.artists.items })
        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err)
        });
})

app.get('/albums/:artistId', (req, res) => {
    spotifyApi.getArtistAlbums(req.params.artistId)
        .then(data => {
            res.render('albums', { items: data.body.items });
        })
        .catch(err => {
            console.log('error', err);
        });
});

app.get('/tracks/:tracksId', (req, res) => {
    spotifyApi.getAlbumTracks(req.params.tracksId)
        .then(data => {
            res.render('tracks', { items: data.body.items });
        })
        .catch(err => {
            console.log('error', err);
        });
});


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
