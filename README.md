# Simulador de Interes Compuesto Diario Chile

Una aplicacion web simple para calcular el crecimiento real de capital dia a dia en las principales cuentas digitales y fintechs de Chile.

A diferencia de las calculadoras tradicionales que aplican un interes mensual o anual plano, este script simula el impacto financiero de la capitalización diaria. Los intereses ganados cada dia se suman de forma automatica al saldo base para generar un nuevo monto de calculo al dia siguiente.

## Tasas de referencia actuales

El archivo de configuración mantiene los datos de rendimiento anual (TEA) de las opciones más utilizadas en el mercado local:

| Banco / Plataforma | Interés Anual (TEA) |
| :--- | :--- |
| Mercado Pago | 5.0% |
| MACH (Cuenta Futuro) | 4.6% |

## Logica del calculo exponencial

Cuando una plataforma ofrece pago diario de intereses, el algoritmo replica el comportamiento real de la siguiente manera:

1. Divide la tasa anual ingresada por 365 para establecer el factor de interes diario.
2. Un ciclo procesa el periodo de dias seleccionado de forma cronologica.
3. Cada dia calcula la ganancia correspondiente, la muestra y la acumula al capital inicial.
4. El dia posterior calcula el interes sobre el pozo actualizado, capturando con precision el incremento de la ganancia diaria.

## Uso local

El proyecto esta construido de forma nativa y no requiere dependencias externas o entornos de ejecucion complejos.

1. Clonar el repositorio:

2. Ejecutar el archivo index.html en cualquier navegador web.

## Contribuciones

Para actualizar valores de tasas vigentes o incorporar nuevas instituciones financieras al selector, se pueden enviar modificaciones a traves de un Pull Request o reportar los cambios en la seccion de Issues.
