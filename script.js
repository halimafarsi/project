// Dimensiones del mapa
const width = 800;
const height = 600;

// Crear el lienzo SVG
const svg = d3.select("#map")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Proyección del mapa
const projection = d3.geoMercator()
  .center([2.5, 46.5])
  .scale(1000)
  .translate([width / 2, height / 2]);

// Ruta del mapa
const path = d3.geoPath().projection(projection);

// Cargar los datos del mapa
d3.json("datavisualiz-\docs\script.js").then(function(mapData) {
  svg.selectAll("path")
    .data(mapData.features)
    .enter()
    .append("path")
    .attr("d", path)
    .style("fill", "lightgray")
    .style("stroke", "white");
});

// Obtener referencia al botón y al select
const mostrarViajeBtn = document.getElementById("mostrarViajeBtn");
const asuntoSelect = document.getElementById("asuntoSelect");

// Agregar evento click al botón
mostrarViajeBtn.addEventListener("click", mostrarViaje);
