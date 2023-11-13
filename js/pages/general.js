import { obtenerProvinciaPorDistrito, mapasProvinciales, nombresProvinciales } from '../mapas.js';

import { almacenarInforme, obtenerInformesAlmacenados } from '../keyInformes.js';

import { coloresAgrupaciones } from '../colorAgrupaciones.js'

const tipoEleccion = 2; //1 PASO, 2 GENERALES
const tipoRecuento = 1; // Recuento definitivo

const periodoSelect = document.getElementById("periodoSelect");
const cargoSelect = document.getElementById("cargoSelect");
const distritoSelect = document.getElementById("distritoSelect");
const seccionSelect = document.getElementById("seccionSelect");
const hdSeccionProvincial = document.getElementById("hdSeccionProvincial");
let error;


// Llenado del combo Año
fetch("https://resultados.mininterior.gob.ar/api/menu/periodos")
  .then(respuesta => respuesta.json())
  .then(data => {
    data.forEach(periodo => {
      const option = document.createElement("option");
      option.value = periodo;
      option.text = periodo;
      periodoSelect.appendChild(option);
    });
  })
  .catch(error => console.error("Error al cargar los años:", error));

// Event listener para el cambio en el combo Año
periodoSelect.addEventListener("change", () => {
  const selectedAño = periodoSelect.value;
  if (selectedAño) {
    // Llenado del combo Cargo
    fetch(`https://resultados.mininterior.gob.ar/api/menu?año=${selectedAño}`)
      .then(respuesta => respuesta.json())
      .then(data => {
        cargoSelect.innerHTML = '<option value="">Selecciona un cargo</option>';
        data.forEach(eleccion => {
          if (eleccion.IdEleccion == tipoEleccion) {
            eleccion.Cargos.forEach(cargo => {
              const option = document.createElement("option");
              option.value = cargo.IdCargo;
              option.text = cargo.Cargo;
              cargoSelect.appendChild(option);
            });
          }
        });
      })
      .catch(error => console.error("Error al cargar los cargos:", error));
  }
});

// Event listener para el cambio en el combo Cargo
cargoSelect.addEventListener("change", () => {
  const selectedAño = periodoSelect.value;
  const selectedCargo = cargoSelect.value;
  if (selectedAño && selectedCargo) {
    // Llenado del combo Distrito
    fetch(`https://resultados.mininterior.gob.ar/api/menu?año=${selectedAño}`)
      .then(respuesta => respuesta.json())
      .then(data => {
        distritoSelect.innerHTML = '<option value="">Selecciona un distrito</option>';
        data.forEach(eleccion => {
          if (eleccion.IdEleccion == tipoEleccion) {
            eleccion.Cargos.forEach(cargo => {
              if (cargo.IdCargo == selectedCargo) {
                cargo.Distritos.forEach(distrito => {
                  const option = document.createElement("option");
                  option.value = distrito.IdDistrito;
                  option.text = distrito.Distrito;
                  distritoSelect.appendChild(option);
                });
              }
            });
          }
        });
      })
      .catch(error => console.error(error));
  }
});


function mostrarMapa(provincia) {
  const svgCode = mapasProvinciales[provincia];
  const mapaElement = document.getElementById("mapaElement");
  const nombreMapa = document.getElementById("nombreMapa")
  const svgNombre = nombresProvinciales[provincia]

  if (svgCode) {
    nombreMapa.innerHTML = svgNombre;
    mapaElement.innerHTML = svgCode;
  } else {
    console.error(provincia);
  }
}

// Event listener para el cambio en el combo Distrito
distritoSelect.addEventListener("change", () => {
  const selectedAño = periodoSelect.value;
  const selectedCargo = cargoSelect.value;
  const selectedDistrito = distritoSelect.value;

  if (selectedAño && selectedCargo && selectedDistrito) {
    const provincia = obtenerProvinciaPorDistrito(selectedDistrito);
    if (provincia) {
      mostrarMapa(provincia);
    }
    // Llenado del combo Sección
    fetch(`https://resultados.mininterior.gob.ar/api/menu?año=${selectedAño}`)
      .then(respuesta => respuesta.json())
      .then(data => {
        seccionSelect.innerHTML = '<option value="">Selecciona una sección</option>';
        data.forEach(eleccion => {
          if (eleccion.IdEleccion == tipoEleccion) {
            eleccion.Cargos.forEach(cargo => {
              if (cargo.IdCargo == selectedCargo) {
                cargo.Distritos.forEach(distrito => {
                  if (distrito.IdDistrito == selectedDistrito) {
                    hdSeccionProvincial.value = distrito.IdSecccionProvincial;
                    distrito.SeccionesProvinciales.forEach(seccionProv => {
                      seccionProv.Secciones.forEach(seccion => {
                        const option = document.createElement("option");
                        option.value = seccion.IdSeccion;
                        option.text = seccion.Seccion;
                        seccionSelect.appendChild(option);
                      });
                    });
                  }
                });
              }
            });
          }
        });
      })
      .catch(error => console.error(error));
  }
});

const filtrarButton = document.getElementById("filtrarButton");
const overlay = document.getElementById("overlay");

function ocultarIcono() {
  overlay.style.display = "none";
}

function mostrarIcono() {
    overlay.style.display = "block";
    setTimeout(function () {
      ocultarIcono();
    }, 2000);
}


filtrarButton.addEventListener("click", async () => {
  mostrarIcono();
  const selectedAño = periodoSelect.value;
  const selectedCargo = cargoSelect.value;
  const selectedDistrito = distritoSelect.value;
  const selectedSeccion = seccionSelect.value;
  let data;

  if (!selectedAño || !selectedCargo || !selectedDistrito || !selectedSeccion) {
    alert("Por favor, complete todos los campos de selección.");
    return;
  }

  const anioEleccion = selectedAño;
  const categoriaId = selectedCargo;
  const distritoId = selectedDistrito;
  const seccionProvincialId = 0;
  const seccionId = selectedSeccion;
  const circuitoId = "";
  const mesaId = "";

  try {
    const url = `https:resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=${anioEleccion}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${categoriaId}&distritoId=${distritoId}&seccionProvincialId=${seccionProvincialId}&seccionId=${seccionId}&circuitoId=${circuitoId}&mesaId=${mesaId}`;
    const respuesta = await fetch(url);
    if (respuesta.ok) {
      data = await respuesta.json();
      console.log(data);
    }
  } catch (error) {
    console.error("Error en la consulta:", error);

  }

  const messageContainer = document.getElementById("messageContainer");

  if (data) {
    const messageContainer = document.getElementById("messageContainer");
    messageContainer.innerHTML = "";
    messageContainer.style.display = "none";

    document.getElementById("sec-mensaje").style.display = "none";
    document.getElementById("sec-titulo").style.display = "block";
    document.getElementById("sec-contenido").style.display = "flex";
    document.getElementById("sec-cuadros").style.display = "flex";

    const selectedAño = periodoSelect.value;
    const selectedCargo = cargoSelect.options[cargoSelect.selectedIndex].text;
    const selectedDistrito = distritoSelect.options[distritoSelect.selectedIndex].text;
    const selectedSeccion = seccionSelect.options[seccionSelect.selectedIndex].text;

    const eleccionesPaso = document.getElementById("eleccionesPaso")
    eleccionesPaso.innerHTML = `Elecciones ${selectedAño} | General`;

    const pathPaso = document.getElementById("path-Paso")
    pathPaso.innerHTML = `${selectedAño} > General > ${selectedCargo} > ${selectedDistrito} > ${selectedSeccion}`;

    try {
      const url = `https:resultados.mininterior.gob.ar/api/resultados/getResultados?anioEleccion=${anioEleccion}&tipoRecuento=${tipoRecuento}&tipoEleccion=${tipoEleccion}&categoriaId=${categoriaId}&distritoId=${distritoId}&seccionProvincialId=${seccionProvincialId}&seccionId=${seccionId}&circuitoId=${circuitoId}&mesaId=${mesaId}`;
      const respuesta = await fetch(url);
      console.log("Response:", respuesta);
      if (respuesta.ok) {
        data = await respuesta.json();
        console.log(data);

        const estadoRecuento = data.estadoRecuento;

        const mesasTotalizadas = estadoRecuento.mesasTotalizadas;
        const cantidadElectores = estadoRecuento.cantidadElectores;
        const participacionPorcentaje = estadoRecuento.participacionPorcentaje;

        const mesasComputadas = document.getElementById("mesasComputadas");
        const electores = document.getElementById("electores");
        const participacion = document.getElementById("participacion");

        mesasComputadas.innerHTML = `${mesasTotalizadas}`;
        electores.innerHTML = `${cantidadElectores}`;
        participacion.innerHTML = `${participacionPorcentaje}%`;

        const valoresTotalizadosPositivos = data.valoresTotalizadosPositivos

        const contenedorGrafico = document.getElementById("graficoAgrupacionPolitica");
        contenedorGrafico.innerHTML = "";

        const agrupacionPolitica = document.createElement("div");
        agrupacionPolitica.classList.add("agrupacionPolitica");

        valoresTotalizadosPositivos.forEach(valor => {
          const idAgrupacion = valor.idAgrupacion;
          let colorPleno, colorLiviano;


          if (coloresAgrupaciones[idAgrupacion]) {
            colorPleno = coloresAgrupaciones[idAgrupacion].colorPleno;
            colorLiviano = coloresAgrupaciones[idAgrupacion].colorLiviano;
          } else {

            colorPleno = coloresAgrupaciones.defaultColor.colorPleno;
            colorLiviano = coloresAgrupaciones.defaultColor.colorLiviano;
          }

          const nombreAgrupacion = valor.nombreAgrupacion;
          const votosPorcentaje = valor.votosPorcentaje;

          const nombreAgrupacionElement = document.createElement("p");
          nombreAgrupacionElement.classList.add("title", "tituloAgrupacion");
          nombreAgrupacionElement.textContent = nombreAgrupacion;

          const progress = document.createElement("div");
          progress.classList.add("progress");
          progress.style.background = colorLiviano;

          const progressBar = document.createElement("div");
          progressBar.classList.add("progress-bar");
          progressBar.style.width = `${votosPorcentaje}%`;
          progressBar.style.background = colorPleno;

          const progressBarText = document.createElement("span");
          progressBarText.classList.add("progress-bar-text");
          progressBarText.textContent = `${votosPorcentaje}%`;

          agrupacionPolitica.appendChild(nombreAgrupacionElement);
       

          progressBar.appendChild(progressBarText);
          progress.appendChild(progressBar);

          agrupacionPolitica.appendChild(progress);

          contenedorGrafico.appendChild(agrupacionPolitica);
        });

        const contenedorBarras = document.getElementById("resumenVotos");
        contenedorBarras.innerHTML = "";
        const max = 7;

        valoresTotalizadosPositivos.slice(0, max).forEach(valor => {
          // ... (código existente para obtener datos de la agrupación política)
          const idAgrupacion = valor.idAgrupacion;
          let colorPleno, colorLiviano;


          if (coloresAgrupaciones[idAgrupacion]) {
            colorPleno = coloresAgrupaciones[idAgrupacion].colorPleno;
            colorLiviano = coloresAgrupaciones[idAgrupacion].colorLiviano;
          } else {

            colorPleno = coloresAgrupaciones.defaultColor.colorPleno;
            colorLiviano = coloresAgrupaciones.defaultColor.colorLiviano;
          }
          const nombreAgrupacion = valor.nombreAgrupacion;
          const votosPorcentaje = valor.votosPorcentaje;
          
          const barra = document.createElement("div");
          const votosPorcentajeNombre = parseFloat(votosPorcentaje);
          const tituloBarra = nombreAgrupacion + " " + votosPorcentajeNombre + "%";
          barra.title = tituloBarra;

          barra.classList.add("bar");
          barra.style.setProperty("--bar-value", `${ votosPorcentaje }%`);
          barra.style.setProperty("--bar-color", colorPleno);
          barra.dataset.name = nombreAgrupacion;
          
          contenedorBarras.appendChild(barra);
        });
      }

    } catch (error) {
      console.error(error);
    }

  } else {

    messageContainer.innerHTML = "";
    const mensaje_amarillo = document.createElement("div");
    mensaje_amarillo.innerText = "No se encontró información para la consulta realizada";
    messageContainer.appendChild(mensaje_amarillo);
  }

  messageContainer.innerHTML = "";
  
});

const agregarInforme = document.getElementById("agregarInforme");


agregarInforme.addEventListener("click", async () => {
  const anioEleccion = periodoSelect.value;
  const categoriaId = cargoSelect.value;
  const distritoId = distritoSelect.value;
  const seccionProvincialId = 0;
  const seccionId = seccionSelect.value;
  const circuitoId = "";
  const mesaId = "";
  const selectedCargo = cargoSelect.options[cargoSelect.selectedIndex].text;
  const selectedDistrito = distritoSelect.options[distritoSelect.selectedIndex].text;
  const selectedSeccion = seccionSelect.options[seccionSelect.selectedIndex].text;

  almacenarInforme(anioEleccion, tipoRecuento, tipoEleccion, categoriaId, distritoId, seccionProvincialId, seccionId, circuitoId, mesaId, selectedCargo, selectedDistrito, selectedSeccion);

})
