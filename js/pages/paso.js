import { obtenerProvinciaPorDistrito, mapasProvinciales, nombresProvinciales } from '../mapas.js';

import { almacenarInforme, obtenerInformesAlmacenados } from '../keyInformes.js';


const tipoEleccion = 1; //1 PASO, 2 GENERALES
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


const messageContainer = document.getElementById("messageContainer");
const mensaje_amarillo = document.createElement("div");
mensaje_amarillo.innerText = "Debe seleccionar los valores a filtrar y hacer clic en el botón FILTRAR";
mensaje_amarillo.style.backgroundColor = "yellow";
messageContainer.appendChild(mensaje_amarillo);

const filtrarButton = document.getElementById("filtrarButton");

filtrarButton.addEventListener("click", async () => {

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
  const categoriaId = 2;
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

    document.getElementById("sec-mensaje").style.display = "none";
    document.getElementById("sec-titulo").style.display = "block";
    document.getElementById("sec-contenido").style.display = "flex";
    document.getElementById("sec-cuadros").style.display = "flex"

    const selectedAño = periodoSelect.value;
    const selectedCargo = cargoSelect.options[cargoSelect.selectedIndex].text;
    const selectedDistrito = distritoSelect.options[distritoSelect.selectedIndex].text;
    const selectedSeccion = seccionSelect.options[seccionSelect.selectedIndex].text;

    const eleccionesPaso = document.getElementById("eleccionesPaso")
    eleccionesPaso.innerHTML = `Elecciones ${selectedAño} | Paso`;

    const pathPaso = document.getElementById("path-Paso")
    pathPaso.innerHTML = `${selectedAño} > Paso > ${selectedCargo} > ${selectedDistrito} > ${selectedSeccion}`;

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

      }
    } catch (error) {
      console.error(error);
    }

  } else {
    
    messageContainer.innerHTML = ""; 
    const mensaje_amarillo = document.createElement("div");
    mensaje_amarillo.innerText = "No se encontró información para la consulta realizada";
    mensaje_amarillo.style.color = "yellow";
    messageContainer.appendChild(mensaje_amarillo);
  }

  messageContainer.innerHTML = "";
  almacenarInforme(periodoSelect, cargoSelect, distritoSelect, seccionSelect, tipoRecuento, tipoEleccion, categoriaId, seccionProvincialId);
});



