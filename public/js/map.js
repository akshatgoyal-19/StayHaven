var map = L.map('map').setView(lisCoordinates,13);

var marker = L.marker(lisCoordinates,).addTo(map);
marker.bindPopup(`<h4> ${listing.title}</h4> `).openPopup();
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
