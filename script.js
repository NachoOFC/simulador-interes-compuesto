// Formateador de moneda para Chile (CLP)
const formatter = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
});

function actualizarTasa() {
    const select = document.getElementById('institucion');
    const grupoManual = document.getElementById('grupo-tasa-manual');
    if (select.value === 'personalizado') {
        grupoManual.style.display = 'block';
    } else {
        grupoManual.style.display = 'none';
    }
}

function formatearMonto() {
    const input = document.getElementById('monto');
    let valor = input.value.replace(/\./g, '').replace(/[^\d]/g, '');
    input.value = valor ? Number(valor).toLocaleString('es-CL') : '';
}

function dibujarGrafico(evolucion, montoInicial) {
    const svg = document.getElementById('grafico-svg');
    const W = 600, H = 300;
    const margen = { top: 20, right: 20, bottom: 35, left: 60 };
    const ancho = W - margen.left - margen.right;
    const alto = H - margen.top - margen.bottom;

    const dias = evolucion.length;
    const maxSaldo = evolucion[dias - 1].saldo;
    const minSaldo = montoInicial;

    const x = i => margen.left + (i / dias) * ancho;
    const rango = (maxSaldo - minSaldo) || 1;
    const y = valor => margen.top + alto - ((valor - minSaldo) / rango) * alto;

    let html = '';
    html += '<line x1="' + margen.left + '" y1="' + margen.top + '" x2="' + margen.left + '" y2="' + (margen.top + alto) + '" stroke="#ccc" />';
    html += '<line x1="' + margen.left + '" y1="' + (margen.top + alto) + '" x2="' + (margen.left + ancho) + '" y2="' + (margen.top + alto) + '" stroke="#ccc" />';

    // Etiquetas de saldo (ejes)
    const pasos = 5;
    for (let i = 0; i <= pasos; i++) {
        const valor = minSaldo + ((maxSaldo - minSaldo) * i / pasos);
        const yy = y(valor);
        html += '<text x="' + (margen.left - 8) + '" y="' + (yy + 4) + '" font-size="11" fill="#666" text-anchor="end">' +
            compacto(valor) + '</text>';
        html += '<line x1="' + margen.left + '" y1="' + yy + '" x2="' + (margen.left + ancho) + '" y2="' + yy + '" stroke="#eee" stroke-dasharray="3,3" />';
    }

    // Etiquetas de días
    for (let i = 0; i <= pasos; i++) {
        const dia = Math.round(i * dias / pasos);
        const xx = x(dia);
        html += '<text x="' + xx + '" y="' + (margen.top + alto + 18) + '" font-size="11" fill="#666" text-anchor="middle">Día ' + dia + '</text>';
    }

    // Línea de crecimiento
    let puntos = '';
    evolucion.forEach((d, i) => {
        puntos += (i === 0 ? 'M' : 'L') + x(i).toFixed(2) + ',' + y(d.saldo).toFixed(2) + ' ';
    });
    html += '<path d="' + puntos + '" fill="none" stroke="#28a745" stroke-width="2.5" />';

    // Área bajo la curva
    let area = 'M' + x(0).toFixed(2) + ',' + (margen.top + alto) + ' ';
    evolucion.forEach((d, i) => {
        area += 'L' + x(i).toFixed(2) + ',' + y(d.saldo).toFixed(2) + ' ';
    });
    area += 'L' + x(dias).toFixed(2) + ',' + (margen.top + alto) + ' Z';
    html += '<path d="' + area + '" fill="#28a745" opacity="0.15" />';

    // Punto inicial y final
    html += '<circle cx="' + x(0).toFixed(2) + '" cy="' + y(minSaldo).toFixed(2) + '" r="4" fill="#007bff" />';
    html += '<circle cx="' + x(dias).toFixed(2) + '" cy="' + y(maxSaldo).toFixed(2) + '" r="4" fill="#28a745" />';

    svg.innerHTML = html;
    document.getElementById('grafico').style.display = 'block';
}

function compacto(valor) {
    if (valor >= 1000000) return (valor / 1000000).toFixed(1) + 'M';
    if (valor >= 1000) return (valor / 1000).toFixed(0) + 'K';
    return Math.round(valor).toString();
}

function calcularInteres() {
    const montoInicial = parseFloat(document.getElementById('monto').value.replace(/\./g, '').replace(/,/g, '.'));
    const dias = parseInt(document.getElementById('dias').value);

    let tasaAnualInput = document.getElementById('institucion').value;
    if (tasaAnualInput === 'personalizado') {
        tasaAnualInput = document.getElementById('tasa').value;
    }

    const tasaAnual = parseFloat(tasaAnualInput) / 100;
    const tasaDiaria = tasaAnual / 365;

    if (isNaN(montoInicial) || isNaN(dias) || isNaN(tasaAnual)) {
        alert("Por favor, llena todos los campos correctamente.");
        return;
    }

    if (montoInicial <= 0) {
        alert("El monto inicial debe ser un valor mayor a cero.");
        return;
    }

    if (dias <= 0) {
        alert("El plazo en días debe ser un valor mayor a cero.");
        return;
    }

    // Lógica del crecimiento exponencial día por día
    let montoActual = montoInicial;
    let gananciaUltimoDia = 0;
    const evolucionDiaria = [];

    for (let i = 1; i <= dias; i++) {
        let interesDelDia = montoActual * tasaDiaria;
        montoActual += interesDelDia;

        evolucionDiaria.push({
            dia: i,
            interes: interesDelDia,
            saldo: montoActual
        });

        if (i === dias) {
            gananciaUltimoDia = interesDelDia;
        }
    }

    const totalGanado = montoActual - montoInicial;

    // Mostrar resultados formateados en pesos chilenos
    document.getElementById('monto-final').innerText = formatter.format(montoActual);
    document.getElementById('total-ganado').innerText = formatter.format(totalGanado);
    document.getElementById('ultimo-dia').innerText = formatter.format(gananciaUltimoDia);
    document.getElementById('resultado').style.display = 'grid';

    // Gráfico de crecimiento exponencial
    dibujarGrafico(evolucionDiaria, montoInicial);

    // Tabla de evolución diaria
    const cuerpo = document.getElementById('cuerpo-tabla');
    cuerpo.innerHTML = '';
    evolucionDiaria.forEach(d => {
        const fila = document.createElement('tr');
        fila.innerHTML =
            '<td>' + d.dia + '</td>' +
            '<td>' + formatter.format(d.interes) + '</td>' +
            '<td>' + formatter.format(d.saldo) + '</td>';
        cuerpo.appendChild(fila);
    });
    document.getElementById('tabla-dias').style.display = 'block';
}
