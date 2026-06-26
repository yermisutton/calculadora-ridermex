interface Step {
  title: string;
  description: string;
}

interface TeachingContent {
  [key: string]: {
    title: string;
    steps: Step[];
  };
}

export const teachingContent: TeachingContent = {
  home: {
    title: 'Bienvenido a la Calculadora de Inversión',
    steps: [
      {
        title: 'Explora las Vistas de Calculadora',
        description: 'Aquí puedes seleccionar diferentes calculadoras para analizar tu inversión: Vista Tradicional, Vista con Reinversión, Análisis Comparativo, Comparación de Inversión Propia y Vista de Metas. Cada una ofrece un enfoque distinto para tus necesidades.'
      },
      {
        title: 'Configuración Rápida',
        description: 'Utiliza la sección de "Configuración Rápida" para ajustar parámetros clave como el número de ticket de inversións, el horizonte de inversión, la utilidad anual, la plusvalía, el incremento del precio del limón y los impuestos. Los cambios se reflejan en tiempo real.'
      },
      {
        title: 'Información Complementaria',
        description: 'Explora las secciones de "Producción y Mercado", "Sostenibilidad e Impacto", "Educación Financiera", "Noticias del Sector" e "Impacto Comunitario" para obtener una visión completa de RiderMex y el sector agrícola.'
      },
      {
        title: 'Selecciona tu Calculadora',
        description: 'Haz clic en cualquiera de las tarjetas de calculadora para iniciar tu análisis detallado. ¡Comienza a planificar tu futuro financiero hoy mismo!'
      }
    ]
  },
  traditional: {
    title: 'Tutorial: Vista Tradicional',
    steps: [
      {
        title: 'Configura tu Inversión Inicial',
        description: 'Ajusta el "Número de Tickets de Inversión" y el "Precio del Ticket de Inversión" para definir tu inversión inicial. Observa cómo el "Resumen de Pagos" se actualiza automáticamente.'
      },
      {
        title: 'Define tu Plan de Pagos',
        description: 'Utiliza el "Enganche" y el "Plazo de Pago" para simular diferentes escenarios de financiamiento. Si eliges 100% de enganche, se considera un pago de contado.'
      },
      {
        title: 'Proyecta el Crecimiento',
        description: 'Ajusta el "Incremento Precio Limón" y el "Año Final" para ver cómo evoluciona el valor de tus tickets de inversión y los rendimientos mensuales a lo largo del tiempo.'
      },
      {
        title: 'Compara con Alternativas',
        description: 'Explora los gráficos de "Evolución del Patrimonio", "Rendimientos Anuales" y "Flujo de Efectivo" para comparar RiderMex con inversiones tradicionales como CETES, Ahorro y Bienes Raíces.'
      },
      {
        title: 'Ajusta las Tasas de Comparación',
        description: 'En la sección "Rendimientos de Inversiones", puedes modificar las tasas de CETES, Ahorro Tradicional y Bienes Raíces para una comparación más precisa según tus expectativas.'
      }
    ]
  },
  reinvestment: {
    title: 'Tutorial: Vista con Reinversión',
    steps: [
      {
        title: 'Configura tus Tickets de Inversión Iniciales',
        description: 'Define cuántos "Tickets de Inversión Iniciales" deseas adquirir. Este es el punto de partida para el crecimiento exponencial de tu inversión.'
      },
      {
        title: 'Establece tu Horizonte de Inversión',
        description: 'Selecciona el "Horizonte de Inversión" en años. Cuanto más largo sea el plazo, mayor será el efecto del interés compuesto y la reinversión.'
      },
      {
        title: 'Impacto del Precio del Limón',
        description: 'Ajusta el "Incremento Precio Limón" para ver cómo un aumento anual en el precio del producto final puede potenciar aún más tus rendimientos y la adquisición de nuevos tickets de inversión.'
      },
      {
        title: 'Analiza los Resultados Finales',
        description: 'Observa el "Resumen de Resultados" para ver cuántos ticket de inversións adicionales has adquirido por reinversión, tu patrimonio final y el ingreso mensual proyectado.'
      },
      {
        title: 'Explora los Gráficos Detallados',
        description: 'Utiliza los gráficos de "Evolución del Patrimonio", "Evolución de Tickets de Inversión" y "Flujo de Efectivo" para visualizar el impacto de la reinversión a lo largo del tiempo. Puedes cambiar el tipo de gráfico (línea, barra, área).'
      },
      {
        title: 'Ver Tabla de Evolución',
        description: 'Haz clic en "Ver Tabla Excel de Tickets de Inversión" para obtener un desglose detallado año por año de la adquisición de ticket de inversións, utilidades y fondos de reinversión.'
      }
    ]
  },
  comparative: {
    title: 'Tutorial: Análisis Comparativo',
    steps: [
      {
        title: 'Define Parámetros Globales',
        description: 'Ajusta el "Monto Inicial" y el "Horizonte Temporal" para establecer la base de tu comparación. Puedes ver los valores en términos reales (ajustados por inflación) activando la opción "Valores Reales".'
      },
      {
        title: 'Configura los Rendimientos de Inversión',
        description: 'Modifica las tasas de rendimiento para "RiderMex", "CETES", "Ahorro Tradicional" y "Bienes Raíces". Esto te permite personalizar la comparación según tus propias expectativas o datos de mercado.'
      },
      {
        title: 'Visualiza la Evolución Patrimonial',
        description: 'El gráfico principal muestra cómo evolucionaría tu patrimonio con cada opción de inversión a lo largo del tiempo. Identifica cuál ofrece el mayor crecimiento.'
      },
      {
        title: 'Analiza las Métricas de Rendimiento',
        description: 'Revisa las tarjetas de "Performance Metrics" para ver el valor final y la ganancia porcentual de cada inversión. El "Factor de Superioridad" destaca la ventaja de RiderMex sobre la segunda mejor opción.'
      },
      {
        title: 'Exporta tu Análisis',
        description: 'Haz clic en el botón "Exportar" para guardar un reporte HTML de tu análisis comparativo. Esto es útil para compartir o revisar tus proyecciones.'
      },
      {
        title: 'Descubre las Ventajas de RiderMex',
        description: 'La sección "¿Por qué elegir RiderMex?" resume los beneficios clave de esta inversión, como activo real, ingresos dolarizados y doble beneficio.'
      }
    ]
  },
  customComparison: {
    title: 'Tutorial: Comparación de Inversión Propia',
    steps: [
      {
        title: 'Configura tu Inversión Personalizada',
        description: 'En el panel izquierdo, ingresa los detalles de tu propia inversión: "Nombre", "Monto Inicial", "Rendimiento Anual", "Horizonte Temporal", "Nivel de Riesgo" y "Categoría".'
      },
      {
        title: 'Ajusta la Utilidad Anual de RiderMex',
        description: 'Puedes modificar el "Rendimiento Anual" de RiderMex para ver cómo se compara con tu inversión personalizada bajo diferentes escenarios de rentabilidad.'
      },
      {
        title: 'Compara los Resultados Clave',
        description: 'Las tarjetas de resumen muestran el "Patrimonio Final", "Ingreso Anual", "CAGR" y "Multiplicador" tanto para RiderMex como para tu inversión personalizada. La sección "Comparison Highlights" te da una visión rápida de las diferencias.'
      },
      {
        title: 'Explora los Gráficos Dinámicos',
        description: 'Utiliza el "Dynamic Chart System" para visualizar la "Evolución Patrimonial", la "Generación de Ingresos" y las "Métricas de Rendimiento" de ambas inversiones. Puedes cambiar el tipo de gráfico (línea, barra, donut).'
      },
      {
        title: 'Guarda tu Comparación',
        description: 'Haz clic en el botón "Guardar Comparación" para exportar un reporte HTML detallado de tu análisis. Esto te permite documentar y compartir tus hallazgos.'
      },
      {
        title: 'Revisa las Ventajas de RiderMex',
        description: 'La sección final destaca los beneficios únicos de invertir en RiderMex, como su respaldo en activos reales y la gestión profesional.'
      }
    ]
  },
  scenariosV2: {
    title: 'Tutorial: Vista de Metas (Escenarios V2)',
    steps: [
      {
        title: 'Selecciona un Escenario de Vida',
        description: 'Elige uno de los escenarios predefinidos (Educación, Retiro, Casa Propia, etc.) para ver cómo RiderMex puede ayudarte a alcanzar tus objetivos específicos.'
      },
      {
        title: 'Personaliza tu Meta Mensual',
        description: 'Ajusta la "Meta Mensual" deseada. Puedes usar los botones de valores preestablecidos o ingresar un monto personalizado. El sistema recalculará automáticamente los ticket de inversións necesarios.'
      },
      {
        title: 'Define tu Plazo de Inversión',
        description: 'Establece el "Plazo (años)" en el que deseas alcanzar tu meta. Al igual que la meta mensual, puedes usar preajustes o un valor personalizado.'
      },
      {
        title: 'Ajusta la Utilidad Anual',
        description: 'Modifica la "Utilidad Anual" de RiderMex para ver cómo diferentes tasas de rendimiento impactan la cantidad de ticket de inversións necesarios y el progreso hacia tu meta.'
      },
      {
        title: 'Revisa los Resultados Proyectados',
        description: 'Observa el "Ingreso Mensual Proyectado", el "Progreso hacia Meta" y la "Inversión Total Requerida". La barra de progreso te muestra qué tan cerca estás de tu objetivo.'
      },
      {
        title: 'Comprende el Plan de Pagos',
        description: 'La sección "Plan de Pagos" te muestra el anticipo y las mensualidades estimadas para adquirir los ticket de inversións necesarios para tu meta.'
      },
      {
        title: 'Explora los Gráficos Dinámicos',
        description: 'Utiliza el "Dynamic Chart System" para visualizar la "Evolución Patrimonial", la "Evolución de Ingresos" y los "Tickets de Inversión Adquiridos" a lo largo del tiempo para tu escenario seleccionado.'
      },
      {
        title: 'Ver la Tabla de Evolución Detallada',
        description: 'Haz clic en "Ver Tabla de Evolución" para obtener un desglose año por año de cómo tus tickets de inversión crecen y generan ingresos.'
      }
    ]
  },
  scenariosV3: {
    title: 'Tutorial: Vista de Metas (Escenarios V3)',
    steps: [
      {
        title: 'Selecciona un Escenario de Vida',
        description: 'Elige uno de los escenarios predefinidos (Educación, Retiro, Casa Propia, etc.) para ver cómo RiderMex puede ayudarte a alcanzar tus objetivos específicos.'
      },
      {
        title: 'Personaliza tu Meta Mensual',
        description: 'Ajusta la "Meta Mensual" deseada. Puedes usar los botones de valores preestablecidos o ingresar un monto personalizado. El sistema recalculará automáticamente los ticket de inversións necesarios.'
      },
      {
        title: 'Define tu Plazo de Inversión',
        description: 'Establece el "Plazo (años)" en el que deseas alcanzar tu meta. Al igual que la meta mensual, puedes usar preajustes o un valor personalizado.'
      },
      {
        title: 'Ajusta la Utilidad Anual',
        description: 'Modifica la "Utilidad Anual" de RiderMex para ver cómo diferentes tasas de rendimiento impactan la cantidad de ticket de inversións necesarios y el progreso hacia tu meta.'
      },
      {
        title: 'Revisa los Resultados Proyectados',
        description: 'Observa el "Ingreso Mensual Proyectado", el "Progreso hacia Meta" y la "Inversión Total Requerida". La barra de progreso te muestra qué tan cerca estás de tu objetivo.'
      },
      {
        title: 'Comprende el Plan de Pagos',
        description: 'La sección "Plan de Pagos" te muestra el anticipo y las mensualidades estimadas para adquirir los ticket de inversións necesarios para tu meta.'
      },
      {
        title: 'Explora los Gráficos Dinámicos',
        description: 'Utiliza el "Dynamic Chart System" para visualizar la "Evolución Patrimonial", la "Evolución de Ingresos" y los "Tickets de Inversión Adquiridos" a lo largo del tiempo para tu escenario seleccionado.'
      },
      {
        title: 'Ver la Tabla de Evolución Detallada',
        description: 'Haz clic en "Ver Tabla de Evolución" para obtener un desglose año por año de cómo tus tickets de inversión crecen y generan ingresos.'
      }
    ]
  },
  certificates: {
    title: 'Tutorial: Comparativa de Tickets de Inversión',
    steps: [
      {
        title: 'Analiza Múltiples Escenarios',
        description: 'Esta vista te permite comparar el rendimiento de diferentes cantidades de ticket de inversións (1, 3, 5, 10, 15, 20) y cómo impactan en tu patrimonio final e ingreso anual.'
      },
      {
        title: 'Visualiza los Datos en Gráficos',
        description: 'Utiliza los gráficos de "Patrimonio Final" e "Ingreso Anual" para ver la relación entre el número de ticket de inversións y los resultados proyectados. Puedes cambiar entre gráficos de línea, barra y área.'
      },
      {
        title: 'Revisa la Tabla Detallada',
        description: 'La tabla inferior proporciona un desglose numérico de la inversión inicial, patrimonio final, ingreso mensual, ingreso por ticket de inversión, multiplicador y CAGR para cada escenario.'
      },
      {
        title: 'Identifica tu Escenario Actual',
        description: 'La fila resaltada en verde en la tabla indica el escenario actual configurado en la calculadora principal, permitiéndote ver su rendimiento en comparación con otras opciones.'
      },
      {
        title: 'Guarda tu Comparación',
        description: 'Haz clic en el botón "Guardar" para exportar un reporte HTML de esta comparativa. Esto es útil para tus registros o para compartir con otros.'
      }
    ]
  },
  excel3: {
    title: 'Tutorial: Tabla Excel de Tickets de Inversión Detallada',
    steps: [
      {
        title: 'Comprende la Evolución Anual',
        description: 'Esta tabla muestra un desglose detallado año por año de la evolución de tus tickets de inversión, incluyendo el precio del ticket de inversión, la utilidad generada, el fondo de reinversión y el saldo disponible.'
      },
      {
        title: 'Sigue el Estado de tus Tickets de Inversión',
        description: 'La columna "Tickets de Inversión" utiliza íconos de colores para indicar el estado de cada ticket de inversión: "En proceso de pago" (cian), "En maduración" (gris), "Iniciando producción" (amarillo) y "Generando utilidades" (verde).'
      },
      {
        title: 'Identifica Eventos Clave',
        description: 'La columna "Eventos" te notifica cuando un ticket de inversión es liquidado completamente o cuando se apartan nuevos tickets de inversión por reinversión.'
      },
      {
        title: 'Analiza los Pagos y Reinversiones',
        description: 'La columna "Pagos" detalla los montos pagados por cada ticket de inversión, mientras que "Fondo Total" y "Disponible" te muestran la acumulación y el saldo para futuras reinversiones.'
      },
      {
        title: 'Consulta la Leyenda y Notas',
        description: 'Al final de la tabla, encontrarás una leyenda que explica el significado de cada estado de ticket de inversión y notas importantes sobre los cálculos y supuestos.'
      },
      {
        title: 'Exporta la Tabla',
        description: 'Haz clic en el botón "Guardar" para exportar esta tabla detallada como un archivo HTML, lo que te permite analizarla fuera de la aplicación.'
      }
    ]
  },
  patrimony: {
    title: 'Tutorial: Gráfico de Evolución del Patrimonio',
    steps: [
      {
        title: 'Visualiza el Crecimiento Patrimonial',
        description: 'Este gráfico muestra cómo tu patrimonio crecería con RiderMex en comparación con otras inversiones tradicionales (CETES, Ahorro, Bienes Raíces) a lo largo del tiempo.'
      },
      {
        title: 'Ajusta las Opciones de Visualización',
        description: 'Utiliza los checkboxes en la sección "Opciones de Visualización" para incluir o excluir las comparaciones con CETES, Ahorro Tradicional y Bienes Raíces. También puedes ver los "Valores Reales" (ajustados por inflación).'
      },
      {
        title: 'Cambia el Tipo de Gráfico',
        description: 'Usa el selector en la esquina superior derecha para cambiar entre gráficos de Línea, Barra, Área o Donut, según tu preferencia para visualizar los datos.'
      },
      {
        title: 'Interpreta los Datos',
        description: 'Pasa el cursor sobre el gráfico para ver los valores exactos de patrimonio para cada año y cada tipo de inversión. La leyenda te ayuda a identificar cada línea o barra.'
      },
      {
        title: 'Guarda tu Visualización',
        description: 'Haz clic en el botón "Guardar" para exportar un reporte HTML de este gráfico y la tabla de datos subyacente. Esto es útil para tus registros o para compartir.'
      }
    ]
  },
  income: {
    title: 'Tutorial: Gráfico de Evolución del Ingreso Anual',
    steps: [
      {
        title: 'Analiza la Generación de Ingresos',
        description: 'Este gráfico ilustra cómo los ingresos anuales de tu inversión en RiderMex evolucionan y se comparan con los ingresos de CETES, Ahorro y Bienes Raíces.'
      },
      {
        title: 'Personaliza la Comparación',
        description: 'En la sección "Opciones de Visualización", puedes activar o desactivar las líneas de CETES, Ahorro y Bienes Raíces. También puedes elegir ver los "Valores Reales" (ajustados por inflación) y "Mostrar Impuestos" aplicados a las inversiones tradicionales.'
      },
      {
        title: 'Cambia el Formato del Gráfico',
        description: 'Usa el selector en la esquina superior derecha para alternar entre gráficos de Línea, Barra, Área o Donut, para encontrar la representación que mejor se adapte a tu análisis.'
      },
      {
        title: 'Detalla los Ingresos por Año',
        description: 'Al pasar el cursor sobre el gráfico, podrás ver los montos exactos de ingresos generados por cada tipo de inversión en un año específico. La leyenda te ayudará a diferenciar cada serie de datos.'
      },
      {
        title: 'Exporta tu Análisis de Ingresos',
        description: 'Haz clic en el botón "Guardar" para descargar un reporte HTML que incluye este gráfico y la tabla de datos correspondiente, ideal para un análisis más profundo o para compartir.'
      }
    ]
  },
  cashflow: {
    title: 'Tutorial: Gráfico de Flujo de Efectivo',
    steps: [
      {
        title: 'Comprende el Flujo de Efectivo Anual',
        description: 'Este gráfico muestra el flujo de efectivo disponible de tu inversión en RiderMex año por año. Los valores negativos representan la inversión inicial y los positivos, las ganancias.'
      },
      {
        title: 'Identifica el Año de Recuperación',
        description: 'La sección debajo del gráfico te indicará el "Año de Recuperación Estimado", que es el punto en el que tu inversión comienza a generar ganancias netas acumuladas.'
      },
      {
        title: 'Cambia la Visualización del Gráfico',
        description: 'Utiliza el selector en la esquina superior derecha para elegir entre gráficos de Línea, Barra, Área o Donut, para ver el flujo de efectivo desde diferentes perspectivas.'
      },
      {
        title: 'Analiza los Detalles del Flujo',
        description: 'Al pasar el cursor sobre el gráfico, podrás ver el flujo de efectivo exacto para cada año. En el gráfico de Donut, verás la proporción de flujos positivos versus la inversión inicial.'
      },
      {
        title: 'Guarda tu Reporte de Flujo',
        description: 'Haz clic en el botón "Guardar" para descargar un reporte HTML de este análisis de flujo de efectivo, incluyendo la tabla de datos, para tu referencia o para compartir.'
      }
    ]
  },
  comparison: {
    title: 'Tutorial: Gráfico de Comparación de Inversiones',
    steps: [
      {
        title: 'Compara el Patrimonio Final',
        description: 'Este gráfico te permite visualizar la proporción de tu patrimonio final que provendría de RiderMex en comparación con CETES, Ahorro Tradicional y Bienes Raíces, asumiendo la misma inversión inicial.'
      },
      {
        title: 'Cambia el Tipo de Gráfico',
        description: 'Usa el selector en la esquina superior derecha para alternar entre un gráfico de Donut (para ver la composición porcentual) y un gráfico de Barras (para una comparación directa de los montos finales).'
      },
      {
        title: 'Interpreta los Resultados',
        description: 'El gráfico de Donut muestra claramente la distribución del patrimonio final entre las diferentes opciones. El gráfico de Barras te permite comparar los montos absolutos.'
      },
      {
        title: 'Revisa el Resumen de Rendimientos',
        description: 'La sección debajo del gráfico proporciona un resumen numérico de los patrimonios finales de cada inversión, así como su porcentaje en relación con RiderMex.'
      },
      {
        title: 'Exporta tu Comparación',
        description: 'Haz clic en el botón "Guardar" para descargar un reporte HTML de esta visualización, lo que te permite tener un registro de tu análisis comparativo.'
      }
    ]
  }
};