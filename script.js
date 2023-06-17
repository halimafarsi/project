// Dimensiones del mapa
const width = 800;
const height = 600;

// Crear el mapa con Leaflet
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

// Función para dibujar las líneas con D3.js
function dibujarLineas(data) {
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
        asunto: d.Asunto,
        fecha: d.Fecha,
        remitente: d.Remitente,
        receptor: d.Receptor
      }
    };

    lineLayer.addData(lineFeature);
  });

  lineLayer.setStyle({
    color: "blue",
    weight: 2
  });

  lineLayer.eachLayer(function(layer) {
    layer.bindPopup(`
      <h4>${layer.feature.properties.asunto}</h4>
      <p>Remitente: ${layer.feature.properties.remitente}</p>
      <p>Receptor: ${layer.feature.properties.receptor}</p>
    `);
  });
}

// Cargar los datos del CSV y dibujar las líneas
d3.csv("test.csv").then(function(data) {
  dibujarLineas(data);
});

// Función para filtrar los datos y actualizar las líneas
function filtrarDatos(asunto) {
  d3.csv("test.csv").then(function(data) {
    const datosFiltrados = data.filter(d => asunto === "" || d.Asunto === asunto);
    dibujarLineas(datosFiltrados);
  });
}

const asuntoSelect = document.getElementById("asuntoSelect");

asuntoSelect.addEventListener("change", function() {
  const asuntoSeleccionado = asuntoSelect.value;
  filtrarDatos(asuntoSeleccionado);
});
