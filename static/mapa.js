// Comunicacion con el servidor
let localizacion = new WebSocket("ws://localhost:8000/ws/graph/");

let canLocLat = 0;
let canLocLng = 0;
let miLocLat = 0;
let miLocLng = 0;

if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
        position => {
            miLocLat = position.coords.latitude;
            miLocLng = position.coords.longitude;
            console.log("Latitud asignada a miLocLat:", miLocLat);
            console.log("Longitud asignada a miLocLng:", miLocLng);
        },
        error => {
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    console.error("El usuario denegó la solicitud de geolocalización.");
                    break;
                case error.POSITION_UNAVAILABLE:
                    console.error("La información de ubicación no está disponible.");
                    break;
                case error.TIMEOUT:
                    console.error("La solicitud para obtener la ubicación ha caducado.");
                    break;
                case error.UNKNOWN_ERROR:
                    console.error("Se produjo un error desconocido.");
                    break;
            }
        }
    );
} else {
    console.error("La geolocalización no está soportada por este navegador.");
}



localizacion.onmessage = function(e){
    let djangoDataLocalizacion = JSON.parse(e.data);

    canLocLat = parseFloat(djangoDataLocalizacion.lat);
    canLocLng = parseFloat(djangoDataLocalizacion.long);
   
}


// Mapa

// Calcular distancia
function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = R * c; // Distancia en km
    const distanciaMts = distancia * 1000 // Distancia en Metros
    return distanciaMts.toFixed(2); // Redondea la distancia a 2 decimales
}



function initMap() {

    // Configuración inicial del mapa
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 20.0766704, lng: -98.3506614},
        zoom: 18
    });

    const markerDestino = new google.maps.Marker({
        position: { lat: 20.0766704, lng: -98.3506614 },
        map: map,
        label: "D",
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "red",
            fillOpacity: 1,
            strokeWeight: 1,
        }
    });

    const markerOrigen = new google.maps.Marker({
        position: { lat: 20.133534, lng: -98.383157 },
        map: map,
        label: "U",
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "green",
            fillOpacity: 1,
            strokeWeight: 1,
        }
    });

    const distancia = calcularDistancia(20.0766704, -98.3506614, 20.133534, -98.383157);
    // Mostrar distancia en el mapa
    const infowindow = new google.maps.InfoWindow({
        content: `Distancia al destino: ${distancia} mts`,
    });

    // Crear una línea entre los dos marcadores
    const lineCoordinates = [
        { lat: 20.0766704, lng: -98.3506614 },
        { lat: 20.133534, lng: -98.383157 }
    ];

    const linea = new google.maps.Polyline({
        path: lineCoordinates,
        geodesic: true,
        strokeColor: "#FF0000", // Color de la línea
        strokeOpacity: 1.0,
        strokeWeight: 2 // Grosor de la línea
    });

    linea.setMap(map);

    infowindow.open(map, markerOrigen);
}