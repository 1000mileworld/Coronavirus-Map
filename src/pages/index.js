import React from 'react';
import Helmet from 'react-helmet';
import L from 'leaflet';
import axios from 'axios';

import Layout from 'components/Layout';
import Container from 'components/Container';
import Map from 'components/Map';

//import 'assets/stylesheets/application.scss'; //imported by Layout

const LOCATION = {
  lat: 0,
  lng: 0
};
const CENTER = [LOCATION.lat, LOCATION.lng];
const DEFAULT_ZOOM = 2;

let response;

const sources = [
  'https://corona.lmao.ninja/countries',
  'https://gist.githubusercontent.com/1000mileworld/157eb3485ad861f83dc50716531892c4/raw/9b5b58a6558edbf1a33f355a77c10eaf21d3a404/coronavirus%2520stat%25202020-04-08',
  'https://gist.githubusercontent.com/1000mileworld/0f12e488ac84b9bdc7e29638be62454f/raw/a5fa43da7adb5b7f351f3a81354e6eebcc05a570/Coronavirus%2520stat%25202020-04-09'
];

class IndexPage extends React.Component  {

  constructor(props) {
    super(props);
    this.state={
      mapSettings: {
          center: CENTER,
          defaultBaseMap: 'OpenStreetMap',
          zoom: DEFAULT_ZOOM,
          mapEffect: this.mapEffect //reference to function, not calling it
        },
      option: 0
    }
    this.handleClick = this.handleChange.bind(this);
  }
  
  /**
   * mapEffect
   * @description Fires a callback once the page renders
   * @example Here this is an example of being used to zoom in and set a popup on load
   */
  mapEffect = async({leafletElement: map}) => {
    
    try {
      response = await axios.get(sources[this.state.option]);
    } catch(e) {
      console.log(`Failed to fetch countries: ${e.message}`, e);
      return;
    }
  
    const { data = [] } = response;
    //console.log(data);
  
    const hasData = Array.isArray(data) && data.length > 0;
  
    if ( !hasData ) return;
  
    const geoJson = {
      type: 'FeatureCollection',
      features: data.map((country = {}) => {
        const { countryInfo = {} } = country;
        const { lat, long: lng } = countryInfo;
        return {
          type: 'Feature',
          properties: {
            ...country,
          },
          geometry: {
            type: 'Point',
            coordinates: [ lng, lat ]
          }
        }
      })
    }
  
    //console.log(geoJson);
  
    //create hover over icon on map using Leaflet
    const geoJsonLayers = new L.GeoJSON(geoJson, {
      pointToLayer: (feature = {}, latlng) => {
        const { properties = {} } = feature;
        let updatedFormatted;
        let casesString;
    
        const {
          country,
          updated,
          cases,
          deaths,
          recovered
        } = properties
    
        casesString = `${cases}`;
    
        if ( cases > 1000 ) {
          casesString = `${casesString.slice(0, -3)}k+`
        }
    
        if ( updated ) {
          updatedFormatted = new Date(updated).toLocaleString();
        }
    
        const html = `
          <span class="icon-marker">
            <span class="icon-marker-tooltip">
              <h2>${country}</h2>
              <ul>
                <li><strong>Confirmed:</strong> ${cases}</li>
                <li><strong>Deaths:</strong> ${deaths}</li>
                <li><strong>Recovered:</strong> ${recovered}</li>
                <li><strong>Last Update:</strong> ${updatedFormatted}</li>
              </ul>
            </span>
            ${ casesString }
          </span>
        `;
    
        return L.marker( latlng, {
          icon: L.divIcon({
            className: 'icon',
            html
          }),
          riseOnHover: true
        });
      }
    });
    geoJsonLayers.addTo(map);

    const token = '';

    //map.setView([51.505, -0.09], 13);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/satellite-streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: token
    }).addTo(map);
    
  }

  handleChange = (e) => {
    this.setState({
      option: parseInt(e.target.value)
    });  
  }

  render() {
    return (
      <Layout pageName="home">
        <Helmet>
          <title>Coronavirus Tracker</title>
        </Helmet>

        {/* Need key attribute to force component to rerender on state update (React uses the key prop to understand the component-to-DOM Element relation) */}
        <Map {...this.state.mapSettings} key={this.state.option}/> 

        <Container type="content" className="text-center home-start">
          <h2>Wordwide Coronavirus/COVID-19 Case Tracker</h2>
          <p>Select from past saved data or get most recent:</p>
          <select id="dropdown" className="select-css" onChange={this.handleChange}>
            <option value="0">Most recent</option>
            <option value="1">April 8, 2020</option>
            <option value="2">April 9, 2020</option>
          </select>
        </Container>
      </Layout>
    );
  }
};

export default IndexPage;
