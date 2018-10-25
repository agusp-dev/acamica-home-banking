//Declaración de variables
var nombreUsuario = "Erika Moreno";
var saldoCuenta = 20000;
var limiteExtraccion = 3000;
var cuentasAmigas = new Map();
var ultMovimientos = [];

const COD_AGUA = 1;
const COD_LUZ = 2;
const COD_INTERNET = 3;
const COD_TELEFONO = 4;

const SERVICIOS_NOMBRES = new Map([[COD_AGUA, "Agua"], [COD_LUZ, "Luz"], [COD_INTERNET, "Internet"], [COD_TELEFONO, "Teléfono"]]); 
const SERVICIOS_MONTOS = new Map([[COD_AGUA, 350], [COD_LUZ, 425], [COD_INTERNET, 210], [COD_TELEFONO, 570]]);

// const MOVIMIENTO_EXTRACCION = 1;
// const MOVIMIENTO_DEPOSITO = 2;
// const MOVIMIENTO_PAGO_SERVICIO = 3;
// const MOVIMIENTO_TRANSFERENCIA = 4;

//Ejecución de las funciones que actualizan los valores de las variables en el HTML.
window.onload = function() {
    cargarNombreEnPantalla();
    actualizarSaldoEnPantalla();
    actualizarLimiteEnPantalla();
}


//Funciones que tenes que completar
function cambiarLimiteDeExtraccion() {

    var alertResultado = prompt("Por favor, ingrese su nuevo límite de extracción:", limiteExtraccion);
    if (alertResultado == null) {
        return;
    }

    var limite = parseInt(alertResultado);
    if (isNaN(limite)) {
        mostrarMensajeErrorMontoIngresado();
        return;
    }

    limiteExtraccion = limite;
    mostrarMensajeLimiteExtraccionModificado();
    actualizarLimiteEnPantalla();
}

function extraerDinero() {

    var alertResultado = prompt("Por favor, ingrese la cantidad de dinero a extraer:");
    if (alertResultado == null) {
        return;
    }

    var cantExtraccion = parseInt(alertResultado);
    console.log(cantExtraccion);
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

    if (!entregaEnBilletesDeCien(cantExtraccion)) {
        mostrarMensajeMontoNoPuedeEntregarseEnBilletesDeCien();
        return;
    }

    var saldoAnterior = saldoCuenta;
    restarDineroAlSaldo(cantExtraccion);

    mostrarMensajeExtraccionRealizada(cantExtraccion, saldoAnterior);
    actualizarSaldoEnPantalla();
    agregarMovimiento("Extracción ($" + cantExtraccion + ")");
}

function depositarDinero() {
    var alertResultado = prompt("Por favor, ingrese la cantidad de dinero a depositar:");
    if (alertResultado == null) {
        return;
    }

    var cantDeposito = parseInt(alertResultado);
    if (isNaN(cantDeposito)) {
        mostrarMensajeErrorMontoIngresado();
        return;
    }
    var saldoAnterior = saldoCuenta;
    sumarDineroAlSaldo(cantDeposito);
    mostrarMensajeDepositoRealizado(cantDeposito, saldoAnterior);
    actualizarSaldoEnPantalla();
    agregarMovimiento("Depósito ($" + cantDeposito + ")");
}

function pagarServicio() {
    var msg = "ATENCIÓN"
        .concat("\n\nPor favor, ingrese el número que corresponda con el servicio que desea pagar: \n")
        .concat(obtenerListaDeServiciosString());

    var alertResultado = prompt(msg);
    if (alertResultado == null) {
        return;
    }

    var codigoServicio = parseInt(alertResultado);
    if (isNaN(codigoServicio)) {
        mostrarMensajeErrorCodigoServicio();
        return;
    }

    var nombreServicio = obtenerNombreServicio(codigoServicio);
    var precioServicio = obtenerPrecioServicio(codigoServicio);
    if (nombreServicio == undefined || precioServicio == undefined) {
        mostrarMensajeServicioSeleccionadoIncorrecto(codigoServicio);
        return;
    }

    if (saldoSuperado(precioServicio)) {
        mostrarMensajeErrorPagoServicioSaldoSuperado(nombreServicio);
        return;
    }

    var saldoAnterior = saldoCuenta;
    restarDineroAlSaldo(precioServicio);
    mostrarMensajePagoServicioRealizado(nombreServicio, precioServicio, saldoAnterior);
    actualizarSaldoEnPantalla();
    agregarMovimiento("Servicio ($" + precioServicio + ")");
}

function transferirDinero() {
    if (cuentasAmigas.size > 0) {

        var alertResultado = prompt("Por favor, ingrese la cantidad de dinero a transferir:");
        if (alertResultado == null) {
            return;
        }

        var montoTransferencia = parseInt(alertResultado);
        if (isNaN(montoTransferencia)) {
            mostrarMensajeErrorMontoIngresado();
            return;
        }

        if (saldoSuperado(montoTransferencia)) {
            mostrarMensajeSaldoSuperado();
            return;
        }

        alertResultado = prompt("Por favor, ingrese el código de la cuenta a la cual quiere realizar la transferencia: \n\n"
            + obtenerListaDeCuentasAmigasString() + "\n");
        if (alertResultado == null) {
            return;
        }

        var codigoCuenta = parseInt(alertResultado);
        if (isNaN(codigoCuenta)) {
            mostrarMensajeErrorCodigoCuenta();
            return;
        }

        var titularCuenta = obtenerNombreCuentaAmiga(codigoCuenta);
        if (titularCuenta == undefined) {
            mostrarMensajeErrorCuentaInexistente();
            return;
        }

        restarDineroAlSaldo(montoTransferencia);
        var cuentaDestino = codigoCuenta + " - " + titularCuenta;
        mostrarMensajeTransferenciaRealizada(montoTransferencia, cuentaDestino)
        actualizarSaldoEnPantalla();
        agregarMovimiento("Transferencia ($" + montoTransferencia + ")");

    } else {
        mostrarMensajeListaCuentasAmigasVacia();
    }
}

function agregarCuentaAmiga() {

    var alertResultado = prompt("Por favor, ingrese el código de la cuenta:");
    if (alertResultado == null) {
        return;
    }

    var codigoCuenta = parseInt(alertResultado);
    if (isNaN(codigoCuenta)) {
        mostrarMensajeErrorCodigoCuenta();
        return;
    }

    alertResultado = prompt("Por favor, ingrese el nombre y apellido del titular de la cuenta:");
    if (alertResultado == null) {
        return;
    }

    if (alertResultado.length == 0) {
        mostrarMensajeErrorTitularCuenta();
        return;
    }

    var nombreTitularCuenta = alertResultado;
    
    agregarCuentaAmigaAlaLista(codigoCuenta, nombreTitularCuenta);
    mostrarMensajeCuentaAmigaAgregada();
}

function ultimosMovimientos() {
    if (ultMovimientos.length > 0) {

        var movimientos = obtenerListaDeUltimosMovimientosString();
        mostrarMensajeUltimosMovimientos(movimientos);

    } else {
        mostrarMensajeSinMovimientos();
    }
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





//General
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

/**
 * Recorre lista de Servicios y devuelve string con un servicio debajo de otro.
 */
function obtenerListaDeServiciosString() {
    var listaString = "";
    for (var servicio of SERVICIOS_NOMBRES.entries()) {
        listaString += servicio[0] + " - " + servicio[1] + "\n";
    }
    return listaString;
}

/**
 * Recorre lista de cuentas amigas y devuelve string con una cuenta debajo de la otra.
 */
function obtenerListaDeCuentasAmigasString() {
    var listaString = "";
    for (var cuenta of cuentasAmigas.entries()) {
        listaString += cuenta[0] + " - " + cuenta[1] + "\n";
    }
    return listaString;
}

/**
 * Obtiene nombre de servicio a partir del codigo.
 * @param {Number} codigo 
 */
function obtenerNombreServicio(codigo) {
    return SERVICIOS_NOMBRES.get(codigo);
}

/**
 * Obtiene precio de servicio a partir del codigo.
 * @param {Number} codigo 
 */
function obtenerPrecioServicio(codigo) {
    return SERVICIOS_MONTOS.get(codigo);
}

/**
 * Agrega una cuenta a la lista de cuentas amigas.
 * @param {Number} cuentaCodigo 
 * @param {String} cuentaNombre 
 */
function agregarCuentaAmigaAlaLista(cuentaCodigo, cuentaNombre) {
    cuentasAmigas.set(cuentaCodigo, cuentaNombre);
}

/**
 * Obtiene nombre de titular de la cuenta, pasando el codigo de cuenta.
 * @param {Number} cuentaCodigo 
 */
function obtenerNombreCuentaAmiga(cuentaCodigo) {
    return cuentasAmigas.get(cuentaCodigo);
}

/**
 * Agrega movimiento a la lista.
 * @param {String} nombreMovimiento 
 */
function agregarMovimiento(movimiento) {
    ultMovimientos.push(movimiento + " - " + obtenerHoraActual());
}

/**
 * Obtiene fecha y hora actual.
 */
function obtenerHoraActual() {
    return new Date().toLocaleString();

    // var d = new Date();
    // var hora = "";
    // var minutos = "";
    
    
    // hora = d.getHours() + ":" + d.getMinutes();
    // return hora;
}

/**
 * Recorre lista de ultimos movimientos y los ordena uno debajo de otro.
 */
function obtenerListaDeUltimosMovimientosString() {
    var listaString = "";
    for (var m = 0; m < ultMovimientos.length; m++) {
        listaString += (m+1) + " - " + ultMovimientos[m] + "\n";
    }
    return listaString;
}



/**
 * Obtiene nombre de movimiento a partir del codigo.
 * @param {Number} codigoMovimiento 
 */
// function obtenerNombreMovimiento(codigoMovimiento) {
//     var nombreMovimiento;
//     switch (codigoMovimiento) {
//         case MOVIMIENTO_EXTRACCION:
//             nombreMovimiento = "Extracción";
//             break;
//         case MOVIMIENTO_DEPOSITO:
//             nombreMovimiento = "Depósito";
//             break;
//         case MOVIMIENTO_PAGO_SERVICIO:  
//             nombreMovimiento = "Servicio";
//             break;
//         case MOVIMIENTO_TRANSFERENCIA:
//             nombreMovimiento = "Transferencia";
//             break;
//         default:
//             nombreMovimiento = undefined;
//     }
//     return nombreMovimiento;
// }




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

/**
 * Verifica si el monto ingresado puede ser entregado en billetes de $100.
 * @param {Number} monto 
 */
function entregaEnBilletesDeCien(monto) {
    if ((monto % 100) === 0) {
        return true;
    }
    return false;
}




//Alertas - Exito
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
 * Muestra un alert indicando que el servicio fue pagado correctamente.
 * @param {String} nombreServicio 
 * @param {Number} montoPagado 
 * @param {Number} saldoAnterior 
 */
function mostrarMensajePagoServicioRealizado(nombreServicio, montoPagado, saldoAnterior) {
    var msg = "ÉXITO"
        .concat("\n\nHas pagado el servicio: " + nombreServicio)
        .concat("\nSaldo anterior: $" + saldoAnterior)
        .concat("\nDinero descontado: $" + montoPagado)
        .concat("\nSaldo actual: $" + saldoCuenta);
    alert(msg);
}

/**
 * Muestra un alert indicando que una cuenta ha sido agregada a la lista de cuentas amigas.
 */
function mostrarMensajeCuentaAmigaAgregada() {
    var msg = "ÉXITO"
        .concat("\n\nLa cuenta ha sido agregada correctamente.");
    alert(msg);
}

/**
 * Muestra un alert indicando que la transferencia ha sido realizada con exito.
 * @param {Number} montoTransferido 
 * @param {String} cuentaDestino 
 */
function mostrarMensajeTransferenciaRealizada(montoTransferido, cuentaDestino) {
    var msg = "ÉXITO"
        .concat("\n\nLa transferencia se ha realizado correctamente.")
        .concat("\n\nMonto transferido: $" + montoTransferido)
        .concat("\nCuenta destino: " + cuentaDestino);
    alert(msg);
}

function mostrarMensajeUltimosMovimientos(movimientos) {
    var msg = "ATENCIÓN"
        .concat("\n\nA continuación se listan los 5 últimos movimientos de su cuenta")
        .concat("\n\n" + movimientos);
    alert(msg);
}






//Alertas - Error

/**
 * Muestra un alert indicando que el monto ingresado es incorrecto.
 */
function mostrarMensajeErrorMontoIngresado() {
    var msg = "ERROR"
        .concat("\n\nEl monto ingresado no es correcto.")
        .concat("\nLa operación no pudo ser ejecutada.");
    alert(msg);
}

/**
 * Muestra un alert indicando que el monto ingresado supera el saldo actual de la cuenta.
 */
function mostrarMensajeSaldoSuperado() {
    var msg = "ERROR"
        .concat("\n\nEl monto ingresado supera el saldo actual de su cuenta.")
        .concat("\nLa operación no pudo ser ejecutada.");
    alert(msg);
}

/**
 * Muestra un alert indicando que el monto ingresado supera el limite de extraccion.
 */
function mostrarMensajeLimiteExtraccionSuperado() {
    var msg = "ERROR"
        .concat("\n\nEl monto ingresado supera su límite de extracción.")
        .concat("\nLa operación no pudo ser ejecutada.");
    alert(msg);
}

/**
 * Muestra un alert indicando que el monto ingresado no puede entregarse en billetes de $100.
 */
function mostrarMensajeMontoNoPuedeEntregarseEnBilletesDeCien() {
    var msg = "ERROR"
        .concat("\n\nEl monto ingresado no puede extraerse en billetes de $100.")
        .concat("\nLa operación no pudo ser ejecutada.");
    alert(msg);
}

/**
 * Muestra un alert indicando que el codigo de servicio ingresado, es incorrecto.
 * @param {Number} codigo 
 */
function mostrarMensajeServicioSeleccionadoIncorrecto(codigo) {
    var msg = "ERROR"
        .concat("\n\nEl código ingresado (" + codigo + ") no pertenece a ningún servicio.")
        .concat("\nLa operación no pudo ser ejecutada.");
    alert(msg);
}

/**
 * Muestra un alert indicando que el monto del servicio supera el saldo actual de la cuenta.
 * @param {String} nombreServicio 
 */
function mostrarMensajeErrorPagoServicioSaldoSuperado(nombreServicio) {
    var msg = "ERROR"
        .concat("\n\nEl monto del servicio (" + nombreServicio + ") supera el saldo actual de su cuenta.")
        .concat("\nLa operación no pudo ser ejecutada.");
    alert(msg);
}

/**
 * Muestra un alert indicando que la lista de cuentas amigas esta vacia.
 */
function mostrarMensajeListaCuentasAmigasVacia() {
    var msg = "ERROR"
        .concat("\n\nNo dispone de cuentas amigas para registrar una transferencia.")
        .concat("\nLa operación no pudo ser ejecutada.");
    alert(msg);
}

/**
 * Muestra un alert indicando que el codigo de cuenta ingresado, tiene formato incorrecto.
 */
function mostrarMensajeErrorCodigoCuenta() {
    var msg = "ERROR"
        .concat("\n\nEl código ingresado no tiene el formato correcto.")
        .concat("\nLa operación no pudo ser ejecutada.");
    alert(msg);
}

/**
 * Muestra un alert indicando que el nombre y apellido del titular de la cuenta,
 * tiene formato incorrecto. 
 */
function mostrarMensajeErrorTitularCuenta() {
    var msg = "ERROR"
        .concat("\n\nEl nombre y apellido ingresado no tiene el formato correcto.")
        .concat("\nLa operación no pudo ser ejecutada.");
    alert(msg);
}

/**
 * Muestra un alert indicando que el codigo ingresado no pertenece a ninguna cuenta asociada.
 */
function mostrarMensajeErrorCuentaInexistente() {
    var msg = "ERROR"
        .concat("\n\nEl código ingresado no pertenece a ninguna cuenta amiga.")
        .concat("\nLa operación no pudo ser ejecutada.");
    alert(msg);
}


//Alertas - Neutrales
function mostrarMensajeSinMovimientos() {
    var msg = "ATENCIÓN"
        .concat("\n\nSu cuenta aún no dispone de movimientos.");
    alert(msg);
}
































