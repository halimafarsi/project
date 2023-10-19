// Dimensiones del mapa
const width = 800;
const height = 600;

// Visualización con Leaflet
const map = L.map("map").setView([46.5, 2.5], 5);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
}).addTo(map);

// Crear el lienzo SVG con D3.js
const svg = d3.select(map.getPanes().overlayPane)
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Obtener la capa SVG del mapa de Leaflet
const svgLayer = L.svgOverlay(svg.node(), map);

// Capa de líneas
const lineLayer = L.geoJSON().addTo(map);

// Función para dibujar las líneas con D3.js + Parsear los datos geográficos + linelayer con la info
function dibujarLineas(data, añoSeleccionado) {
  lineLayer.clearLayers();

  data.forEach(function(d) {
    const origen = [parseFloat(d.LongOrigen), parseFloat(d.LatOrigen)];
    const destino = [parseFloat(d.LongDestino), parseFloat(d.LatDestino)];

    const lineData = {
      type: "LineString",
      coordinates: [origen, destino]
    };

    const lineFeature = {
      type: "Feature",
      geometry: lineData,
      properties: {
        remitente: d.remitente,
        fecha: d.Fecha,
        Origen: d.Origen,
        Destino: d.Destino,
        remitente: d.Remitente,
        receptor: d.Receptor,
        IDCarta: d.IDCarta
      }
    };

    if (parseInt(d.Fecha) <= parseInt(añoSeleccionado)) {
      lineLayer.addData(lineFeature);
    }
  });

  lineLayer.setStyle({
    color: "green",
    weight: 5
  
  });

  lineLayer.eachLayer(function(layer) {
    layer.bindPopup(`
      <h4>${layer.feature.properties.remitente}</h4>
      <p>Remitente: ${layer.feature.properties.remitente}</p>
      <p>Receptor: ${layer.feature.properties.receptor}</p>
      <p>Fecha: ${layer.feature.properties.fecha}</p>      
      <p> Origen: ${layer.feature.properties.Origen}</p>
      <p> Destino: ${layer.feature.properties.Destino}</p>
      <p>Id de la carta: ${layer.feature.properties.IDCarta}</p>
    `);
  });
}

// Cargar los datos del CSV y dibujar las líneas
d3.csv("DATA.CSV")
  .then(function(data) {
    // Configuración por defecto
  })
  .catch(function(error) {
    console.error("Error al cargar el archivo CSV:", error);
  });

// Función para filtrar los datos y actualizar las líneas
function filtrarDatos(remitente, añoSeleccionado) {
  d3.csv("DATA.CSV")
    .then(function(data) {
      const datosFiltrados = data.filter(d => (remitente === "" || d.Remitente === remitente));
      dibujarLineas(datosFiltrados, añoSeleccionado);
    })
    .catch(function(error) {
      console.error("Error al cargar el archivo CSV:", error);
    });
}
function filtrarDatos(remitente, añoSeleccionado) {
  d3.csv("DATA.CSV")
    .then(function(data) {
      let datosFiltrados;

      if (remitente === "Todos") {
        // Si se selecciona "todos", no aplicamos ningún filtro de remitente
        datosFiltrados = data;
      } else {
        datosFiltrados = data.filter(d => d.Remitente === remitente);
      }

      dibujarLineas(datosFiltrados, añoSeleccionado);
    })
    .catch(function(error) {
      console.error("Error al cargar TODAS las líneas", error);
    });
}


const remitenteSelect = document.getElementById("remitenteSelect");
const slider = document.getElementById("slider");

document.getElementById("mostrarBtn").addEventListener("click", function() {
  const remitenteSeleccionado = remitenteSelect.value;
  const añoSeleccionado = slider.value;
  filtrarDatos(remitenteSeleccionado, añoSeleccionado);
});

//Función para datos sin lugar de origen o de destino ¿?