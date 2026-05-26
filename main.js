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

let cantPalabras = 0;
let intRestantes = 0;
let posActual;
let palabraActual = [];
let cantAciertos = 0;
let cajitasPalabraActual = [];
let cantAcertar;
let juegoTerminado = false;

function cargarNuevaPalabra() {
    posActual = Math.floor(Math.random() * palabras.length); //elegir palabras random del arreglo 
    //console.log(posActual);

    // reinicio
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
    palabraActual = palabra.split('');
    //console.log(palabraActual);
    juegoTerminado = false;

    document.getElementById("palabra").innerHTML = ""; //vaciar divs

    for (let i = 0; i < palabra.length; i++) {
        var cajaLetras = document.createElement("input");

        cajaLetras.type = "text";
        cajaLetras.readOnly = true;
        cajaLetras.className = "letra";

        document.getElementById("palabra").appendChild(cajaLetras);
    }

    cajitasPalabraActual = document.getElementsByClassName("letra");
    intRestantes = 5;
    document.getElementById("intentos").innerHTML = intRestantes;

    document.getElementById("imagen-ahorcado").src = "img/step_1.png";

    document.getElementById("pista").innerHTML = ayudas[posActual];

    palabras.splice(posActual, 1);
    ayudas.splice(posActual, 1);
    generarTeclado();
}

function generarTeclado() {
    const contenedorTeclado = document.getElementById("teclado")
    contenedorTeclado.innerHTML = "";

    const alfabeto = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");
    for (let i = 0; i < alfabeto.length; i++) {
        let letra = alfabeto[i];
        let boton = document.createElement("button");
        boton.className = "tecla";
        boton.innerText = letra;
        boton.id = "btn-" + letra; //dar id

        boton.addEventListener("click", () => {
            if (!juegoTerminado) {
                procesarLetra(letra);
                boton.disabled = true; //deshabilitamos la letra 
            }
        });

        contenedorTeclado.appendChild(boton);
    }
}

//lógica de perder o ganar
function procesarLetra(letra) {
    let acerto = false;

    for (let i = 0; i < palabraActual.length; i++) {
        if (palabraActual[i] === letra) {
            cajitasPalabraActual[i].value = letra;
            acerto = true;
            cantAciertos++;
        }
    }

    //si acerto, se pinta de verde
    if (acerto === true) {
        if (cantAcertar === cantAciertos) {
            juegoTerminado = true;
            for (let i = 0; i < palabraActual.length; i++) {
                cajitasPalabraActual[i].className = "letra pintar";
            }
        }
    }         
    else { //si erra, se pinta de rojo
        intRestantes--;
        let errores = 5 - intRestantes; 

        document.getElementById("intentos").innerHTML = intRestantes;
        document.getElementById("imagen-ahorcado").src = "img/step_" + errores + ".png";

        if (intRestantes <= 0) {
            juegoTerminado = true;
            for (let i = 0; i < palabraActual.length; i++) {
                cajitasPalabraActual[i].className = "letra pintar-error";
            }
        }
    }
}

//evento del teclado fisico
document.addEventListener('keydown', event => {
    if (!juegoTerminado && esLetra(event.key)) {
        //alert(event.key);
        let letra = event.key.toUpperCase();

        let botonVirtual = document.getElementById("btn-" + letra);
        if(botonVirtual && !botonVirtual.disabled){
            botonVirtual.disabled = true;
            procesarLetra(letra);
        }
    }
});

//funcion para corroborar que es una letra
function esLetra(str) {
    return str.length === 1 && str.match(/[a-zñ]/i);
}

cargarNuevaPalabra(); 