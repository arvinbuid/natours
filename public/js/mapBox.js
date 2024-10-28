/* eslint-disable */

console.log('Hello from the client side!');
const locations = JSON.parse(document.getElementById('map').dataset.locations);

// Create map
const map = L.map('map').setView([31.111745, -118.113491], 5);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  crossOrigin: true
}).addTo(map);

// Add markers to the map, also store coordinates in an array for bounds calculation
const markerArray = [];
locations.forEach(loc => {
  const reversedArr = [...loc.coordinates].reverse();

  const myIcon = L.icon({
    iconUrl: './../img/pin.png',
    iconSize: [30, 35],
    iconAnchor: [15, 35]
  });

  L.marker(reversedArr, { icon: myIcon })
    .addTo(map)
    .bindPopup(`Day ${loc.day}: ${loc.description}`, {
      maxWidth: 200, // Increase or decrease width
      minWidth: 150,
      offset: [0, -20],
      className: 'custom-popup'
    });

  markerArray.push(reversedArr);
});

// Fit the map to the markers' bounds to ensure all markers are visible
const bounds = L.latLngBounds(markerArray);
map.fitBounds(bounds);
