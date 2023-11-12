const informesKey = "INFORMES";

export function almacenarInforme(anioEleccion, tipoRecuento, tipoEleccion, categoriaId, distritoId, seccionProvincialId, seccionId, circuitoId, mesaId) {

    const botonRojo = document.getElementById("botonRojo");
    const botonAmarillo = document.getElementById("botonAmarillo");
    const botonVerde = document.getElementById("botonVerde");

    const nuevoRegistro = `${anioEleccion}|${tipoRecuento}|${tipoEleccion}|${categoriaId}|${distritoId}|${seccionProvincialId}|${seccionId}|${circuitoId}|${mesaId}`;

    // Obtener la lista actual de informes almacenados
    const informesAlmacenados = obtenerInformesAlmacenados();
    
    botonVerde.style.display = "block";
    botonAmarillo.style.display = "block";
    botonRojo.style.display = "block";

    // Validar si el nuevo registro ya existe
    if (informesAlmacenados.includes(nuevoRegistro)) {
        document.getElementById("sec-mensaje").style.display = "block";
        botonVerde.style.display = "none";
        botonRojo.style.display = "none";
        return;
    } else {
        informesAlmacenados.push(nuevoRegistro);

        localStorage.setItem(informesKey, JSON.stringify(informesAlmacenados));

        document.getElementById("sec-mensaje").style.display = "block";
        botonAmarillo.style.display = "none";
        botonRojo.style.display = "none";

    }
}

export function obtenerInformesAlmacenados() {
    // Obtener la lista actual de informes almacenados desde localStorage
    const informesString = localStorage.getItem(informesKey);
    return informesString ? JSON.parse(informesString) : [];
}
