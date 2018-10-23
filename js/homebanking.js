//Declaración de variables
var nombreUsuario = "Erika Moreno";
var saldoCuenta = 20000;
var limiteExtraccion = 3000;

//Ejecución de las funciones que actualizan los valores de las variables en el HTML.
window.onload = function() {
    cargarNombreEnPantalla();
    actualizarSaldoEnPantalla();
    actualizarLimiteEnPantalla();
}


//Funciones que tenes que completar
function cambiarLimiteDeExtraccion() {
    var limite = parseInt(prompt("Por favor, ingrese su nuevo límite de extracción:"));
    if (isNaN(limite)) {
        mostrarMensajeErrorMontoIngresado();
        return;
    }

    limiteExtraccion = limite;
    mostrarMensajeLimiteExtraccionModificado();
    actualizarLimiteEnPantalla();
}

function extraerDinero() {
    var cantExtraccion = parseInt(prompt("Por favor, ingrese la cantidad de dinero a extraer:"));
    if (isNaN(cantExtraccion)) {
        mostrarMensajeErrorMontoIngresado();
        return;
    }

    if (limiteExtraccionSuperado(cantExtraccion)) {
        mostrarMensajeLimiteExtraccionSuperado();
        return;
    }

    if (saldoSuperado(cantExtraccion)) {
        mostrarMensajeSaldoSuperado();
        return;
    }

    var saldoAnterior = saldoCuenta;
    restarDineroAlSaldo(cantExtraccion);

    mostrarMensajeExtraccionRealizada(cantExtraccion, saldoAnterior);
    actualizarSaldoEnPantalla();
}

function depositarDinero() {
    var cantDeposito = parseInt(prompt("Por favor, ingrese la cantidad de dinero a depositar:"));
    if (isNaN(cantDeposito)) {
        mostrarMensajeErrorMontoIngresado();
        return;
    }
    var saldoAnterior = saldoCuenta;
    sumarDineroAlSaldo(cantDeposito);
    mostrarMensajeDepositoRealizado(cantDeposito, saldoAnterior);
    actualizarSaldoEnPantalla();
}

function pagarServicio() {

}

function transferirDinero() {

}

function iniciarSesion() {

}



//Funciones que actualizan el valor de las variables en el HTML
function cargarNombreEnPantalla() {
    document.getElementById("nombre").innerHTML = "Bienvenido/a " + nombreUsuario;
}

function actualizarSaldoEnPantalla() {
    document.getElementById("saldo-cuenta").innerHTML = "$" + saldoCuenta;
}

function actualizarLimiteEnPantalla() {
    document.getElementById("limite-extraccion").innerHTML = "Tu límite de extracción es: $" + limiteExtraccion;
}


//Funciones personales
/** 
* Suma dinero al saldo actual en cuenta.
* @param {Number} dinero
*/
function sumarDineroAlSaldo(dinero) {
    console.log("Se suma $" + dinero + " al saldo de la cuenta.");
    saldoCuenta += dinero;
}

/**
* Resta dinero al saldo actual en cuenta.
* @param {Number} dinero
*/
function restarDineroAlSaldo(dinero) {
    console.log("Se resta $" + dinero + " al saldo de la cuenta.");
    saldoCuenta -= dinero;
}




//Alertas
/**
 * Muestra un alert indicando que el deposito ha sido realizado correctamente.
 * @param {Number} deposito 
 * @param {Number} saldoAnterior 
 */
function mostrarMensajeDepositoRealizado(deposito, saldoAnterior) {
    var msg = "ÉXITO"
        .concat("\n\nHas depositado: $" + deposito)
        .concat("\nSaldo anterior: $" + saldoAnterior)
        .concat("\nSaldo actual: $" + saldoCuenta);
    alert(msg);
}

/**
 * Muestra un alert indicando que la extraccion ha sido realizada correctamente.
 * @param {Number} extraccion 
 * @param {Number} saldoAnterior 
 */
function mostrarMensajeExtraccionRealizada(extraccion, saldoAnterior) {
    var msg = "ÉXITO"
        .concat("\n\nHas retirado: $" + extraccion)
        .concat("\nSaldo anterior: $" + saldoAnterior)
        .concat("\nSaldo actual: $" + saldoCuenta);
    alert(msg);
}

function mostrarMensajeLimiteExtraccionModificado() {
    var msg = "ÉXITO"
        .concat("\n\nSu límite de extracción a sido modificado")
        .concat("\nLímite actual: $" + limiteExtraccion);
    alert(msg);
}

/**
 * Muestra un alert indicando que el monto ingresado es incorrecto.
 */
function mostrarMensajeErrorMontoIngresado() {
    var msg = "ATENCIÓN"
        .concat("\n\nEl monto ingresado no es correcto.")
        .concat("\nLa operación no pudo ser ejecutada.");
    alert(msg);
}

/**
 * Muestra un alert indicando que el monto ingresado supera el saldo actual de la cuenta.
 */
function mostrarMensajeSaldoSuperado() {
    var msg = "ATENCIÓN"
        .concat("\n\nEl monto ingresado supera el saldo actual de su cuenta.")
        .concat("\nLa operación no pudo ser ejecutada.");
    alert(msg);
}

/**
 * Muestra un alert indicando que el monto ingresado supera el limite de extraccion.
 */
function mostrarMensajeLimiteExtraccionSuperado() {
    var msg = "ATENCIÓN"
        .concat("\n\nEl monto ingresado supera su límite de extracción.")
        .concat("\nLa operación no pudo ser ejecutada.");
    alert(msg);
}


//Validaciones
/**
 * Verifica si el monto ingresado supera el saldo actual de la cuenta.
 * @param {Number} monto 
 */
function saldoSuperado(monto) {
    return (monto > saldoCuenta);
}

/**
 * Verifica si el monto ingresado supera el limite de extraccion.
 * @param {Number} monto 
 */
function limiteExtraccionSuperado(monto) {
    return (monto > limiteExtraccion);
}


















