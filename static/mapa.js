// Comunicación con el servidor
let localizacion = new WebSocket("ws://localhost:8000/ws/graph/");

let canLocLat = 0;
let canLocLng = 0;
let miLocLat = 0; // Latitud inicial
let miLocLng = 0; // Longitud inicial
let map, markerDestino, markerOrigen, linea, infowindow; // Declaración de variables globales

function convertToDecimal(coordinate, isLongitude = false) {
    let degrees, minutes;
    if (typeof coordinate === 'number') {
        coordinate = coordinate.toString();
    }
    if (isLongitude) {
        degrees = parseInt(coordinate.slice(0, 3), 10);
        minutes = parseFloat(coordinate.slice(3));
    } else {
        degrees = parseInt(coordinate.slice(0, 2), 10);
        minutes = parseFloat(coordinate.slice(2));
    }
    const decimal = degrees + (minutes / 60);
    return decimal;
}

if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
        position => {
            miLocLat = position.coords.latitude;
            miLocLng = position.coords.longitude;
            initMap();
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

localizacion.onmessage = function(e) {
    let djangoDataLocalizacion = JSON.parse(e.data);

    const locLat = djangoDataLocalizacion.lat;
    const locLng = djangoDataLocalizacion.long;
    
    canLocLat = convertToDecimal(locLat);
    canLocLng = convertToDecimal(locLng, true);

    console.log("Latitud asignada a canLocLat:", canLocLat);
    console.log("Longitud asignada a canLocLng:", canLocLng);

    // Si quieres actualizar el mapa con las nuevas coordenadas:
    actualizarMapa();
}

// Calcular distancia
function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = R * c; // Distancia en km
    const distanciaMts = distancia * 1000; // Distancia en Metros
    return distanciaMts.toFixed(2); // Redondea la distancia a 2 decimales
}

function initMap() {
    // Configuración inicial del mapa
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: miLocLat, lng: miLocLng},
        zoom: 18
    });

    markerDestino = new google.maps.Marker({
        position: { lat: canLocLat, lng: canLocLng },
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

    markerOrigen = new google.maps.Marker({
        position: { lat: miLocLat, lng: miLocLng },
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

    const distancia = calcularDistancia(canLocLat, canLocLng, miLocLat, miLocLng);
    // Mostrar distancia en el mapa
    infowindow = new google.maps.InfoWindow({
        content: `Distancia al destino: ${distancia} mts`,
    });

    // Crear una línea entre los dos marcadores
    const lineCoordinates = [
        { lat: canLocLat, lng: canLocLng },
        { lat: miLocLat, lng: miLocLng }
    ];

    linea = new google.maps.Polyline({
        path: lineCoordinates,
        geodesic: true,
        strokeColor: "#FF0000", // Color de la línea
        strokeOpacity: 1.0,
        strokeWeight: 2 // Grosor de la línea
    });

    linea.setMap(map);

    infowindow.open(map, markerOrigen);
}

function actualizarMapa() {
    // Esta función se puede utilizar para actualizar el mapa si las coordenadas cambian.
    if (typeof map !== 'undefined') {
        map.setCenter(new google.maps.LatLng(miLocLat, miLocLng));

        // Actualiza el marcador de destino
        markerDestino.setPosition(new google.maps.LatLng(canLocLat, canLocLng));
        
        // Actualiza el marcador de origen
        markerOrigen.setPosition(new google.maps.LatLng(miLocLat, miLocLng));

        // Actualiza la línea entre los puntos
        const lineCoordinates = [
            { lat: canLocLat, lng: canLocLng },
            { lat: miLocLat, lng: miLocLng }
        ];
        linea.setPath(lineCoordinates);

        // Actualiza la información de la distancia
        const distancia = calcularDistancia(canLocLat, canLocLng, miLocLat, miLocLng);
        infowindow.setContent(`Distancia al destino: ${distancia} mts`);
        infowindow.open(map, markerOrigen);
    }
}
