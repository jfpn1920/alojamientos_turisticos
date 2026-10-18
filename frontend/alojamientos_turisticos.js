//-------------------------------------------//
//--|funcionalidad_alojamientos_turisticos|--//
//-------------------------------------------//
const formulario = document.getElementById("formulario_alojamiento");
const contenedorTarjetas = document.getElementById("contenedor_tarjetas");
const contadorAlojamientos = document.getElementById("contador_alojamientos");
const alojamientosIniciales = [
    {
        id: 1,
        nombre: "Hotel Playa Azul",
        ubicacion: "Cartagena, Colombia",
        precio: 180000,
        imagen: "https://images.unsplash.com/photo-1566073771259-6a8506099945"
    },
    {
        id: 2,
        nombre: "Cabaña Montaña Verde",
        ubicacion: "Medellín, Colombia",
        precio: 150000,
        imagen: "https://images.unsplash.com/photo-1510798831971-661eb04b3739"
    },
    {
        id: 3,
        nombre: "Villa Tropical",
        ubicacion: "Santa Marta, Colombia",
        precio: 220000,
        imagen: "https://images.unsplash.com/photo-1564501049412-61c2a3083791"
    }
];
//-------------------------//
//--|cargar_alojamientos|--//
//-------------------------//
function cargarAlojamientos() {
    const datosGuardados = localStorage.getItem("alojamientos");
    if (datosGuardados === null) {
        return alojamientosIniciales.map(function(alojamiento) {
            return { ...alojamiento };
        });
    }
    try {
        const datos = JSON.parse(datosGuardados);
        if (!Array.isArray(datos)) {
            throw new Error("Los alojamientos guardados no son válidos.");
        }
        const alojamientosValidos = datos.filter(function(alojamiento) {
            return alojamiento !== null &&
                typeof alojamiento === "object" &&
                Number.isSafeInteger(alojamiento.id) &&
                typeof alojamiento.nombre === "string" &&
                alojamiento.nombre.trim() !== "" &&
                typeof alojamiento.ubicacion === "string" &&
                alojamiento.ubicacion.trim() !== "" &&
                Number.isFinite(Number(alojamiento.precio)) &&
                Number(alojamiento.precio) > 0 &&
                typeof alojamiento.imagen === "string" &&
                alojamiento.imagen.trim() !== "";
        });
        return alojamientosValidos.map(function(alojamiento) {
            return {
                id: alojamiento.id,
                nombre: alojamiento.nombre,
                ubicacion: alojamiento.ubicacion,
                precio: Number(alojamiento.precio),
                imagen: alojamiento.imagen
            };
        });
    } catch (error) {
        localStorage.removeItem("alojamientos");
        return alojamientosIniciales.map(function(alojamiento) {
            return { ...alojamiento };
        });
    }
}
let alojamientos = cargarAlojamientos();
function guardarAlojamientos() {
    try {
        localStorage.setItem("alojamientos", JSON.stringify(alojamientos));
        return true;
    } catch (error) {
        alert("No se pudieron guardar los alojamientos en el navegador.");
        return false;
    }
}
//--------------------------//
//--|mostrar_alojamientos|--//
//--------------------------//
function mostrarAlojamientos() {
    contenedorTarjetas.replaceChildren();
    alojamientos.forEach(function(alojamiento) {
        const tarjeta = document.createElement("article");
        tarjeta.classList.add("tarjeta_alojamiento");
        const imagen = document.createElement("img");
        imagen.classList.add("imagen_alojamiento");
        imagen.src = alojamiento.imagen;
        imagen.alt = alojamiento.nombre;
        imagen.loading = "lazy";
        imagen.addEventListener("error", function() {
            imagen.removeAttribute("src");
            imagen.alt = "Imagen no disponible para " + alojamiento.nombre;
        });
        const contenido = document.createElement("div");
        contenido.classList.add("contenido_tarjeta");
        const nombre = document.createElement("h3");
        nombre.textContent = alojamiento.nombre;
        const ubicacion = document.createElement("p");
        ubicacion.classList.add("ubicacion_alojamiento");
        ubicacion.textContent = "📍 " + alojamiento.ubicacion;
        const precio = document.createElement("p");
        precio.classList.add("precio_alojamiento");
        precio.textContent = "$" + alojamiento.precio.toLocaleString("es-CO") + " por noche";
        const botonEliminar = document.createElement("button");
        botonEliminar.type = "button";
        botonEliminar.classList.add("boton_eliminar");
        botonEliminar.dataset.id = String(alojamiento.id);
        botonEliminar.textContent = "Eliminar";
        contenido.append(nombre, ubicacion, precio, botonEliminar);
        tarjeta.append(imagen, contenido);
        contenedorTarjetas.appendChild(tarjeta);
    });
    actualizarContador();
}
//-------------------------//
//--|actualizar_contador|--//
//-------------------------//
function actualizarContador() {
    const cantidad = alojamientos.length;
    contadorAlojamientos.textContent =
        cantidad + " alojamiento" + (cantidad !== 1 ? "s" : "");
}
//-------------------------//
//--|agregar_alojamiento|--//
//-------------------------//
formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();
    const nombre = document.getElementById("nombre_alojamiento").value.trim();
    const ubicacion = document.getElementById("ubicacion_alojamiento").value.trim();
    const precioTexto = document.getElementById("precio_alojamiento").value.trim();
    const imagen = document.getElementById("imagen_alojamiento").value.trim();
    const precio = Number(precioTexto);
    if (!nombre || !ubicacion || !precioTexto || !imagen) {
        alert("Completa todos los campos.");
        return;
    }
    if (!Number.isFinite(precio) || precio <= 0) {
        alert("Ingresa un precio válido mayor que cero.");
        return;
    }
    let urlImagen;
    try {
        urlImagen = new URL(imagen);
    } catch (error) {
        alert("Ingresa una URL de imagen válida.");
        return;
    }
    if (urlImagen.protocol !== "https:" && urlImagen.protocol !== "http:") {
        alert("La URL de la imagen debe comenzar con HTTP o HTTPS.");
        return;
    }
    const nuevoAlojamiento = {
        id: Date.now(),
        nombre: nombre,
        ubicacion: ubicacion,
        precio: precio,
        imagen: urlImagen.href
    };
    alojamientos.push(nuevoAlojamiento);
    if (!guardarAlojamientos()) {
        alojamientos.pop();
        return;
    }
    mostrarAlojamientos();
    formulario.reset();
});
//--------------------------//
//--|eliminar_alojamiento|--//
//--------------------------//
contenedorTarjetas.addEventListener("click", function(evento) {
    const boton = evento.target.closest(".boton_eliminar");
    if (!boton || !contenedorTarjetas.contains(boton)) {
        return;
    }
    const id = Number(boton.dataset.id);
    const indice = alojamientos.findIndex(function(alojamiento) {
        return alojamiento.id === id;
    });
    if (indice === -1) {
        return;
    }
    const alojamientoEliminado = alojamientos.splice(indice, 1)[0];
    if (!guardarAlojamientos()) {
        alojamientos.splice(indice, 0, alojamientoEliminado);
        return;
    }
    mostrarAlojamientos();
});
mostrarAlojamientos();