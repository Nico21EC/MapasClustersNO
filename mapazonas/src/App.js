import React, { useState, useRef } from 'react';
import useSwr from 'swr';
import GoogleMapReact from 'google-map-react';
import useSupercluster from 'use-supercluster';
import  pin  from './pin.svg';
import  paciente  from './pacientes.json';
import './App.css';

const fetcher = (...args) => fetch(...args).then((response) => response.json());
const Marker = ({ children }) => children;

export default function App() {
  //1st. Mapa
  const mapRef = useRef();
  const [bounds, setBounds] = useState(null); //limites
  const [zoom, setZoom] = useState(10);

  //const url =paciente;
  //cambio a object .... !!
  const url ='https://data.police.uk/api/crimes-street/all-crime?lat=52.629729&lng=-1.131592&date=2019-10';
  const { data, error } = useSwr(url, { fetcher });
  const crimes = data && !error ? data : [];
  const points = crimes.map((crime) => ({
    type: 'Feature',
    properties: { cluster: false, pacienteId: crime.id},
    geometry: {
      type: 'Point',
      coordinates: [
        //toma de coordenadas
        parseFloat(crime.location.longitude),
        parseFloat(crime.location.latitude),
      ],
    },
  }));

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 },
  });

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyDJNimX1HBEtsaAXdOO6eToq061kDx0uJ4' }}
        defaultCenter={{ lat: 52.6376, lng: -1.135171 }}
        //defaultCenter={{ lat: -0.33405, lng: -78.45217 }}
        defaultZoom={10}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map }) => {
          mapRef.current = map;
        }}
        onChange={({ zoom, bounds }) => {
          setZoom(zoom);
          setBounds([
            bounds.nw.lng,
            bounds.se.lat,
            bounds.se.lng,
            bounds.nw.lat,
          ]);
        }}
      >
        {clusters.map((cluster) => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const {
            cluster: isCluster,
            point_count: pointCount,
          } = cluster.properties;

          if (isCluster) {
            return (
              <Marker
                key={`cluster-${cluster.id}`}
                lat={latitude}
                lng={longitude}
              >
                <div
                  className='cluster-marker'
                  style={{
                    width: `${10 + (pointCount / points.length) * 20}px`,
                    height: `${10 + (pointCount / points.length) * 20}px`,
                  }}
                  //test 2
                  onClick={() => {
                    const expansionZoom = Math.min(
                      supercluster.getClusterExpansionZoom(cluster.id),
                      20
                    );
                    mapRef.current.setZoom(expansionZoom);
                    mapRef.current.panTo({ lat: latitude, lng: longitude });
                  }}
                >
                  {pointCount}
                </div>
              </Marker>
            );
          }

          return (
            <Marker
              key={`crime-${cluster.properties.crimeId}`}
              lat={latitude}
              lng={longitude}
            >
              <button className='paciente-marker'>
                
                <img src={pin} />
              </button>
            </Marker>
          );
        })}
      </GoogleMapReact>
    </div>
  );
}
