const formulario = document.getElementById("formulario_alojamiento");
const contenedorTarjetas = document.getElementById("contenedor_tarjetas");
const contadorAlojamientos = document.getElementById("contador_alojamientos");

let alojamientos = JSON.parse(localStorage.getItem("alojamientos")) || [
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

function guardarAlojamientos() {
    localStorage.setItem("alojamientos", JSON.stringify(alojamientos));
}

function mostrarAlojamientos() {
    contenedorTarjetas.innerHTML = "";

    alojamientos.forEach(function(alojamiento) {
        const tarjeta = document.createElement("article");

        tarjeta.classList.add("tarjeta_alojamiento");

        tarjeta.innerHTML = `
            <img 
                class="imagen_alojamiento"
                src="${alojamiento.imagen}"
                alt="${alojamiento.nombre}"
            >

            <div class="contenido_tarjeta">
                <h3>${alojamiento.nombre}</h3>

                <p class="ubicacion_alojamiento">
                    📍 ${alojamiento.ubicacion}
                </p>

                <p class="precio_alojamiento">
                    $${Number(alojamiento.precio).toLocaleString("es-CO")} por noche
                </p>

                <button 
                    class="boton_eliminar"
                    data-id="${alojamiento.id}">
                    Eliminar
                </button>
            </div>
        `;

        contenedorTarjetas.appendChild(tarjeta);
    });

    actualizarContador();
}

function actualizarContador() {
    const cantidad = alojamientos.length;

    contadorAlojamientos.textContent =
        `${cantidad} alojamiento${cantidad !== 1 ? "s" : ""}`;
}

formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const nombre = document.getElementById("nombre_alojamiento").value.trim();
    const ubicacion = document.getElementById("ubicacion_alojamiento").value.trim();
    const precio = document.getElementById("precio_alojamiento").value;
    const imagen = document.getElementById("imagen_alojamiento").value.trim();

    if (!nombre || !ubicacion || !precio || !imagen) {
        alert("Completa todos los campos.");
        return;
    }

    const nuevoAlojamiento = {
        id: Date.now(),
        nombre: nombre,
        ubicacion: ubicacion,
        precio: Number(precio),
        imagen: imagen
    };

    alojamientos.push(nuevoAlojamiento);

    guardarAlojamientos();

    mostrarAlojamientos();

    formulario.reset();
});

contenedorTarjetas.addEventListener("click", function(evento) {
    if (!evento.target.classList.contains("boton_eliminar")) {
        return;
    }

    const id = Number(evento.target.dataset.id);

    alojamientos = alojamientos.filter(function(alojamiento) {
        return alojamiento.id !== id;
    });

    guardarAlojamientos();

    mostrarAlojamientos();
});

mostrarAlojamientos();