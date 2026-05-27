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

//------------------------------ Funcion principal para inicializar y reiniciar ------------------------------
function cargarNuevaPalabra() {
    posActual = Math.floor(Math.random() * palabras.length); //elegir palabras random del arreglo por su indice
    //console.log(posActual);

    //si ya se jugaron las palabras, reiniciar el arreglo
    cantPalabras++;
    if (cantPalabras > palabras.length) {
        palabras = ["JAVASCRIPT", "ALGORITMO", "SERVIDOR", "FRONTEND", "BACKEND", "VARIABLE", "PIXEL", "CILSA"];
        ayudas = [
            "Lenguaje de programación usado para hacer páginas web interactivas",
            "Conjunto de pasos para resolver un problema",
            "Computadora o sistema que proporciona servicios en internet",
            "Parte visual de una página web con la que interactúa el usuario",
            "Parte interna de una aplicación que maneja datos y lógica",
            "Espacio donde se almacena información en programación",
            "Unidad mínima de una imagen digital",
            "Organización No Gubernamental creada en 1966 que promueve la inclusión"
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
        document.getElementById("palabra").appendChild(cajaLetras);
    }

    cajitasPalabraActual = document.getElementsByClassName("letra");

    //reiniciar variables y valores
    intRestantes = 5;
    document.getElementById("intentos").innerHTML = intRestantes;
    document.getElementById("imagen-ahorcado").src = "img/step_1.png";
    document.getElementById("pista").innerHTML = ayudas[posActual];

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

    //recorrer la palabra para chequear si la letra ingresada coincide con alguna
    for (let i = 0; i < palabraActual.length; i++) {
        //validar letra ingresada, si es correcta, se muestra en la cajita correspondiente
        if (palabraActual[i] === letra) {
            cajitasPalabraActual[i].value = letra; 
            acerto = true;
            cantAciertos++; 
        }
    }

    //si acerto la palabra, se chequea si gano, en caso de que si, se pinta de verde
    if (acerto === true) {
        if (cantAcertar === cantAciertos) {
            juegoTerminado = true;
            for (let i = 0; i < palabraActual.length; i++) {
                cajitasPalabraActual[i].className = "letra pintar";
            }
        }
    }         
    else { 
        intRestantes--;  
        let errores = 5 - intRestantes; //calcular el paso de la imagen  

        document.getElementById("intentos").innerHTML = intRestantes;
        document.getElementById("imagen-ahorcado").src = "img/step_" + errores + ".png";

        //revisamos si perdio, en caso de que si, pintar cajas de rojo
        if (intRestantes <= 0) { 
            juegoTerminado = true;
            for (let i = 0; i < palabraActual.length; i++) {
                cajitasPalabraActual[i].className = "letra pintar-error";
            }
        }
    }
}

//------------------------------ Lógica de acertar o error ------------------------------
document.addEventListener('keydown', event => {
    if (!juegoTerminado && esLetra(event.key)) {
        //alert(event.key);
        let letra = event.key.toUpperCase(); //normalizamos entradas de mayusculas

        //buscar el botón del teclado virtual por id, si el boton existe y no esta desahabilitado, se desahabilita
        let botonVirtual = document.getElementById("btn-" + letra);
        if(botonVirtual && !botonVirtual.disabled){
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