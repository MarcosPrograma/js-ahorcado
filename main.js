// ------------------------------ Variables ------------------------------
let palabras = ["CILSA", "JAVASCRIPT", "ALGORITMO", "SERVIDOR", "FRONTEND", "BACKEND", "VARIABLE", "PIXEL"];

let ayudas = [
    "Organización No Gubernamental creada en 1966 que promueve la inclusión",
    "Lenguaje de programación usado para hacer páginas web interactivas",
    "Conjunto de pasos para resolver un problema",
    "Computadora o sistema que proporciona servicios en internet",
    "Parte visual de una página web con la que interactúa el usuario",
    "Parte interna de una aplicación que maneja datos y lógica",
    "Espacio donde se almacena información en programación",
    "Unidad mínima de una imagen digital"
];

let cantPalabras = 0; //contador de palabras jugadas para saber cuando reiniciar el arreglo
let intRestantes = 0; //contador de intentos permitidos antes de perder
let posActual; //indice de la palabra seleccionada en la ronda
let palabraActual = []; //areglos con letras separadas de la palabra seleccionadas
let cantAciertos = 0; //contador de letras acertadas
let cajitasPalabraActual = []; //cajitas donde se muestras las letras
let cantAcertar; //cantidad total de letras de la palabra para saber cuantos aciertos se necesitan para ganar
let juegoTerminado = false; //saber cuando se termina (para lógica de ganar o perder)
let imgAhorcado = document.getElementById("imagen-ahorcado");

//------------------------------ Funcion principal para inicializar y reiniciar ------------------------------
function cargarNuevaPalabra() {
    posActual = Math.floor(Math.random() * palabras.length); //elegir palabras random del arreglo por su indice
    //console.log(posActual);

    //si ya se jugaron las palabras, reiniciar el arreglo
    cantPalabras++;
    if (cantPalabras > palabras.length) {
        palabras = ["CILSA", "JAVASCRIPT", "ALGORITMO", "SERVIDOR", "FRONTEND", "BACKEND", "VARIABLE", "PIXEL"];
        ayudas = [
            "Organización No Gubernamental creada en 1966 que promueve la inclusión",
            "Lenguaje de programación usado para hacer páginas web interactivas",
            "Conjunto de pasos para resolver un problema",
            "Computadora o sistema que proporciona servicios en internet",
            "Parte visual de una página web con la que interactúa el usuario",
            "Parte interna de una aplicación que maneja datos y lógica",
            "Espacio donde se almacena información en programación",
            "Unidad mínima de una imagen digital"
        ];
    }

    let palabra = palabras[posActual];
    cantAcertar = palabra.length;
    cantAciertos = 0;
    palabraActual = palabra.split(''); //convertir string en array de letras
    //console.log(palabraActual);
    juegoTerminado = false;

    document.getElementById("palabra").innerHTML = ""; //vaciar los inputs

    //crear inputs para cada letra de la palabra que salga
    for (let i = 0; i < palabra.length; i++) {
        var cajaLetras = document.createElement("input");
        cajaLetras.type = "text";
        cajaLetras.readOnly = true; //no puede escribir sobre el input
        cajaLetras.className = "letra";
        cajaLetras.setAttribute("aria-label", `Letra ${i + 1} de ${palabra.length}: oculta`); //añade un aria-label a cada casillero para indicar su posición
        document.getElementById("palabra").appendChild(cajaLetras);
    }

    cajitasPalabraActual = document.getElementsByClassName("letra");

    //reiniciar variables y valores
    intRestantes = 5;
    document.getElementById("intentos").innerHTML = intRestantes;
    document.getElementById("pista").innerHTML = ayudas[posActual];

    //texto alternativo dinámico para la imagen
    imgAhorcado.src = "img/step_1.png";
    imgAhorcado.alt = "Progreso del ahorcado: 0 de 5 errores. Horca vacía"

    //anunciar en voz alta que empezo una nueva partida
    document.getElementById("anuncio-lector").innerText = `Nueva ronda. La palabra tiene ${palabra.length} letras. La pista es: ${ayudas[posActual]}`;

    //eliminar palabra ya jugada de la ronda
    palabras.splice(posActual, 1);
    ayudas.splice(posActual, 1);

    generarTeclado();
}

//------------------------------ Teclado virtual ------------------------------
function generarTeclado() {
    const contenedorTeclado = document.getElementById("teclado")
    contenedorTeclado.innerHTML = ""; //limpiar teclado de la anterior palabra

    const alfabeto = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split(""); //crear arreglo del abecedario
    //crear un boton html por cada letra
    for (let i = 0; i < alfabeto.length; i++) {
        let letra = alfabeto[i];
        let boton = document.createElement("button");
        boton.className = "tecla";
        boton.innerText = letra;
        boton.id = "btn-" + letra; //dar id (btn-a, btn-b, btn-c, etc)

        //propiedad/evento para que se pueda cliquear 
        boton.addEventListener("click", () => {
            if (!juegoTerminado) {
                procesarLetra(letra);
                boton.disabled = true; //deshabilitamos la letra 
            }
        });

        contenedorTeclado.appendChild(boton);
    }
}

//------------------------------ Lógica de acertar o error ------------------------------
function procesarLetra(letra) {
    let acerto = false;
    let letrasAcertadasEnLaRonda = 0;
    let mensajeAnuncio = "";

    //recorrer la palabra para chequear si la letra ingresada coincide con alguna
    for (let i = 0; i < palabraActual.length; i++) {
        //validar letra ingresada, si es correcta, se muestra en la cajita correspondiente
        if (palabraActual[i] === letra) {
            cajitasPalabraActual[i].value = letra;
            //Actualizamos el label para que el usuario sepa qué letra se reveló 
            cajitasPalabraActual[i].setAttribute("aria-label", `Letra ${i + 1} de ${palabraActual.length}: ${letra}`);
            acerto = true;
            cantAciertos++;
            letrasAcertadasEnLaRonda++;
        }
    }

    //si acerto la palabra, se chequea si gano, en caso de que si, se pinta de verde
    if (acerto === true) {
        mensajeAnuncio = `¡Acertaste! La letra ${letra} se repite ${letrasAcertadasEnLaRonda} ${letrasAcertadasEnLaRonda === 1 ? 'vez' : 'veces'}.`;
        if (cantAcertar === cantAciertos) {
            juegoTerminado = true;
            for (let i = 0; i < palabraActual.length; i++) {
                cajitasPalabraActual[i].className = "letra pintar";
            }
            mensajeAnuncio += ` ¡Ganaste el juego! La palabra completa era ${palabraActual.join('')}.`;
        }
    }
    else {
        intRestantes--;
        let errores = 5 - intRestantes; //calcular el paso de la imagen  
        document.getElementById("intentos").innerHTML = intRestantes;

        imgAhorcado.src = "img/step_" + errores + ".png";
        imgAhorcado.alt = `Progreso del ahorcado: ${errores} de 5 errores.`;
        mensajeAnuncio = `Fallo. La letra ${letra} no está en la palabra. Te quedan ${intRestantes} intentos.`;

        //revisamos si perdio, en caso de que si, pintar cajas de rojo
        if (intRestantes <= 0) {
            juegoTerminado = true;
            for (let i = 0; i < palabraActual.length; i++) {
                cajitasPalabraActual[i].className = "letra pintar-error";
            }
            mensajeAnuncio += ` Juego terminado. Perdiste. La palabra correcta era ${palabraActual.join('')}.`;
        }
    }
    //enviar el resultado del turno al lector de pantalla
    document.getElementById("anuncio-lector").innerText = mensajeAnuncio;
}

//------------------------------ Lógica de acertar o error ------------------------------
document.addEventListener('keydown', event => {
    if (!juegoTerminado && esLetra(event.key)) {
        //alert(event.key);
        let letra = event.key.toUpperCase(); //normalizamos entradas de mayusculas

        //buscar el botón del teclado virtual por id, si el boton existe y no esta desahabilitado, se desahabilita
        let botonVirtual = document.getElementById("btn-" + letra);
        if (botonVirtual && !botonVirtual.disabled) {
            botonVirtual.disabled = true;
            procesarLetra(letra);
        }
    }
});

//------------------------------ Funcion para validar si es letra ------------------------------
function esLetra(str) {
    return str.length === 1 && str.match(/[a-zñ]/i);
}

//===============================================================================================
cargarNuevaPalabra(); 