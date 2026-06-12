// ====================
// ELEMENTOS
// ====================
const botao = document.getElementById("btnConverter");
const numero = document.getElementById("numero");
const origem = document.getElementById("baseOrigem");
const destino = document.getElementById("baseDestino");

const resultadoFinal = document.getElementById("resultadoFinal");
const conteudoPassos = document.getElementById("conteudoPassos");
const listaHistorico = document.getElementById("listaHistorico");
const btnHistorico = document.getElementById("btnHistorico");
const contadorCaracteres = document.getElementById("contadorCaracteres");

const telaConversor = document.getElementById("telaConversor");
const telaResultado = document.getElementById("telaResultado");

const areaPassos = document.getElementById("areaPassos");

const btnMenu = document.getElementById("btnMenu");
const menuOpcoes = document.getElementById("menuOpcoes");

let historico = [];

const LIMITE_HISTORICO = 20;
const LIMITE_PASSOS = 30;


// ====================
// INPUT
// ====================
numero.addEventListener("input", () => {

    numero.value = numero.value.toUpperCase().replace(/\s/g, "");

    contadorCaracteres.textContent = numero.value.length + " / 10000";
});


// ====================
// MENU
// ====================
btnMenu.addEventListener("click", () => {
    menuOpcoes.classList.toggle("hidden");
});


// ====================
// RESET
// ====================
document.getElementById("btnReset").addEventListener("click", () => {

    historico = [];

    listaHistorico.innerHTML = "";
    numero.value = "";
    resultadoFinal.textContent = "";
    conteudoPassos.innerHTML = "";
    contadorCaracteres.textContent = "0 / 10000";
});


// ====================
// VOLTAR
// ====================
document.getElementById("btnVoltar").addEventListener("click", () => {

    telaResultado.classList.add("hidden");
    telaConversor.classList.remove("hidden");
});


// ====================
// AUXILIARES
// ====================
function valorDoDigito(caractere) {

    return "0123456789ABCDEF"
        .indexOf(caractere);
}


function validarEntrada(numero, base) {

    let permitidos = "";

    if (base == 2) permitidos = "01";
    else if (base == 5) permitidos = "01234";
    else if (base == 8) permitidos = "01234567";
    else if (base == 10) permitidos = "0123456789";
    else if (base == 16) permitidos = "0123456789ABCDEF";

    else
        return false;

    if (numero.length === 0)
        return false;

    for (let i = 0; i < numero.length; i++) {

        if (!permitidos.includes(numero[i])) {

            return false;
        }
    }

    return true;
}


// ====================
// PARA DECIMAL (BigInt)
// ====================
function converterParaDecimal(numero, base) {

    let decimal = 0n;
    let potencia = 0n;
    let passos = "";

    for (let i = numero.length - 1; i >= 0; i--) {

        const digito =BigInt(valorDoDigito(numero[i]));
        const valor = digito * (BigInt(base)**potencia);

        passos +=
            digito +
            " × " +
            base +
            "^" +
            potencia +
            " = " +
            valor +
            "<br>";

        decimal += valor;

        potencia++;
    }

    return {
        decimal,
        passos
    };
}


// ====================
// DE DECIMAL (BigInt)
// ====================
function converterDeDecimal(decimal, baseDestino) {

    let resultado = "";
    let passos = "";

    const baseBigInt = BigInt(baseDestino);

    if (decimal === 0n) {

        return {
            resultado: "0",
            passos: "Número já é 0.<br>"
        };
    }

    while (decimal > 0n) {

        const resto = decimal % baseBigInt;
        const simbolo = "0123456789ABCDEF" [Number(resto)];

      passos +=
    decimal +
    " ÷ " +
    baseDestino +
    " = " +
    (decimal / baseBigInt) +
    " → <strong>resto " +
    resto +
    "</strong><br>";

        resultado = simbolo + resultado;
        decimal = decimal / baseBigInt;
    }

    return {
        resultado,
        passos
    };
}


// ====================
// CONVERSÃO COMPLETA
// ====================
function converter(numero, origem, destino) {

    const resultadoDecimal = converterParaDecimal(numero, origem);

    if (destino == 10) {

        return {
            resultado:resultadoDecimal.decimal.toString(),
            passos:resultadoDecimal.passos
        };
    }

    const resultadoFinalConversao = converterDeDecimal(resultadoDecimal.decimal, destino);

    return {
        resultado:resultadoFinalConversao.resultado,
        passos:resultadoFinalConversao.passos
    };
}


// ====================
// HISTÓRICO
// ====================
function adicionarHistorico(numero, origem, destino, resultado) {

    historico.push(

        numero +
        " (Base " +
        origem +
        " → Base " +
        destino +
        ") = " +
        resultado
    );

    if (historico.length > LIMITE_HISTORICO) {

        historico.shift();
    }

    listaHistorico.innerHTML = "";

    historico.forEach(item => {
        listaHistorico.innerHTML += item + "<br>";
    });
}


// ====================
// CONVERTER
// ====================
botao.addEventListener("click",() => {

        const num = numero.value;
        const valido = validarEntrada(num, origem.value);

        if (!valido) {

            resultadoFinal.textContent = "Entrada inválida";
            conteudoPassos.innerHTML = "";

            return;
        }

        const resultado = converter(num, origem.value, destino.value);
        resultadoFinal.textContent = resultado.resultado;
        const quantidadePassos = resultado.passos.split("<br>").length - 1;

        if (quantidadePassos > LIMITE_PASSOS) {

            conteudoPassos.innerHTML = "";
            areaPassos.classList.add("hidden");
            telaResultado.classList.add("resultadoSimples");

        } else {

            conteudoPassos.innerHTML = resultado.passos;
            areaPassos.classList.remove("hidden");
            telaResultado.classList.remove("resultadoSimples");
        }

        adicionarHistorico(
            num,
            origem.value,
            destino.value,
            resultado.resultado
        );

        telaConversor.classList.add("hidden");
        telaResultado.classList.remove("hidden");
    }
);

btnHistorico.addEventListener("click", () => {

        if (historico.length === 0) {

            listaHistorico.innerHTML = "Nenhuma conversão realizada.";

        } else {

            listaHistorico.innerHTML = historico.join("<br>");
        }

            listaHistorico.classList.remove("hidden");
            menuOpcoes.classList.add("hidden");
            clearTimeout(listaHistorico.timer);

            listaHistorico.timer = setTimeout(() => {
            listaHistorico.classList.add("hidden");

            }, 5000);
    }
);

document.getElementById("btnReset")
.addEventListener("click", () => {

    historico = [];

            listaHistorico.innerHTML = "";
            numero.value = "";

            resultadoFinal.textContent = "";
            conteudoPassos.innerHTML = "";
            contadorCaracteres.textContent = "0 / 10000";

            telaResultado.classList.add("hidden");
            telaConversor.classList.remove("hidden");
});
