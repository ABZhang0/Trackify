import React, { Component } from 'react';
import './App.css';
import SpotifyWebApi from 'spotify-web-api-js';

var spotifyApi = new SpotifyWebApi();

class App extends Component {
  constructor() {
    super();

    const params = this.getHashParams();
    if (params.access_token) {
      spotifyApi.setAccessToken(params.access_token);
    }

    this.state = {
      loggedIn: params.access_token ? true : false,
      nowPlaying: {
        name: "Not checked",
        image: ""
      },
      topArtists: [],
    };
  }

  getHashParams() { // mystery code
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g;
    var q = window.location.hash.substring(1);

    e = r.exec(q);
    while (e) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
      e = r.exec(q);
    }

    return hashParams;
  }

  getNowPlaying() {
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        this.setState({
          nowPlaying: {
            name: response.item.name,
            image: response.item.album.images[0].url
          }
        })
      });
  }

  getFavoriteArtists() {
    spotifyApi.getMyTopArtists()
      .then((response) => {
        this.setState({ topArtists: response.items });
      });
  }

  render() {
    return (
      <div className="App">
        <h1>Trackify</h1>
        <a href="http://localhost:8888/login">
          <button>Login With Spotify</button>
        </a>
        <div className="NowPlaying"> Now Playing: { this.state.nowPlaying.name } </div>
        <div>
          <img src={ this.state.nowPlaying.image } alt="" style={ { width: 150 } }/>
        </div>
        <button onClick={ () => this.getNowPlaying() }>
          Check Now Playing
        </button>
        <ul>
          { this.state.topArtists.map((item, index) => <li key={ index }>{ item.name }</li>) }
        </ul>
        <button onClick={ () => this.getFavoriteArtists() }>
          Get Favorite Artists
        </button>
      </div>
    );
  }
}

export default App;
