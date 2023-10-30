// General o Paso
const tipoEleccion = 1; 
const tipoRecuento = 1; 

const periodoSelect = document.getElementById("periodoSelect");
const cargoSelect = document.getElementById("cargoSelect");
const distritoSelect = document.getElementById("distritoSelect");
const seccionSelect = document.getElementById("seccionSelect");
const hdSeccionProvincial = document.getElementById("hdSeccionProvincial");

// Cambio Combo Año
fetch("https://resultados.mininterior.gob.ar/api/menu/periodos")
  .then(response => response.json())
  .then(data => {
    data.forEach(periodo => {
      const opcion = document.createElement("option");
      opcion.value = periodo;
      opcion.text = periodo;
      periodoSelect.appendChild(opcion);
    });
  })
  .catch(error => console.error("Error al cargar los años:", error));

// Cambio en el Combo Cargo
periodoSelect.addEventListener("change", () => {
  const añoSeleccionado = periodoSelect.value;
  if (añoSeleccionado) {
    fetch(`https://resultados.mininterior.gob.ar/api/menu?año=${añoSeleccionado}`)
      .then(response => response.json())
      .then(data => {
        cargoSelect.innerHTML = '<option value="">Selecciona un cargo</option>';
        data.forEach(eleccion => {
          if (eleccion.IdEleccion == tipoEleccion) {
            eleccion.Cargos.forEach(cargo => {
              const opcion = document.createElement("option");
              opcion.value = cargo.IdCargo;
              opcion.text = cargo.Cargo;
              cargoSelect.appendChild(opcion);
            });
          }
        });
      })
      .catch(error => console.error("Error al cargar los cargos:", error));
  }
});


cargoSelect.addEventListener("change", () => {
  const añoSeleccionado = periodoSelect.value;
  const cargoSeleccionado = cargoSelect.value;
  if (añoSeleccionado && cargoSeleccionado) {

 // Cambio Combo Distrito
    fetch(`https://resultados.mininterior.gob.ar/api/menu?año=${añoSeleccionado}`)
      .then(response => response.json())
      .then(data => {
        distritoSelect.innerHTML = '<option value="">Selecciona un distrito</option>';
        data.forEach(eleccion => {
          if (eleccion.IdEleccion == tipoEleccion) {
            eleccion.Cargos.forEach(cargo => {
              if (cargo.IdCargo == cargoSeleccionado) {
                cargo.Distritos.forEach(distrito => {
                  const opcion = document.createElement("option");
                  opcion.value = distrito.IdDistrito;
                  opcion.text = distrito.Distrito;
                  distritoSelect.appendChild(opcion);
                });
              }
            });
          }
        });
      })
      .catch(error => console.error("Error al cargar los distritos:", error));
  }
});


distritoSelect.addEventListener("change", () => {
  const añoSeleccionado = periodoSelect.value;
  const cargoSeleccionado = cargoSelect.value;
  const distritoSeleccionado = distritoSelect.value;
  if (añoSeleccionado && cargoSeleccionado && distritoSeleccionado) {
    // Nuevo Combo Seleccion
    fetch(`https://resultados.mininterior.gob.ar/api/menu?año=${añoSeleccionado}`)
      .then(response => response.json())
      .then(data => {
        seccionSelect.innerHTML = '<option value="">Selecciona una sección</option>';
        data.forEach(eleccion => {
          if (eleccion.IdEleccion == tipoEleccion) {
            eleccion.Cargos.forEach(cargo => {
              if (cargo.IdCargo == cargoSeleccionado) {
                cargo.Distritos.forEach(distrito => {
                  if (distrito.IdDistrito == distritoSeleccionado) {
                    hdSeccionProvincial.value = distrito.IdSecccionProvincial;
                    distrito.SeccionesProvinciales.forEach(seccionProv => {
                      seccionProv.Secciones.forEach(seccion => {
                        const opcion = document.createElement("option");
                        opcion.value = seccion.IdSeccion;
                        opcion.text = seccion.Seccion;
                        seccionSelect.appendChild(opcion);
                      });
                    });
                  }
                });
              }
            });
          }
        });
      })
      .catch(error => console.error("Error al cargar las secciones:", error));
  }
});
