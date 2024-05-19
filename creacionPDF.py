import pandas as pd
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Image
from reportlab.lib import colors
import matplotlib.pyplot as plt
import tempfile

def create_pdf_and_plots_from_csv(csv_file, pdf_file):
    # Leer el archivo CSV
    df = pd.read_csv(csv_file)

    # Crear un lienzo para el PDF
    doc = SimpleDocTemplate(pdf_file, pagesize=letter)
    elements = []

    # Convertir el DataFrame en una lista de listas
    data = [df.columns.tolist()] + df.values.tolist()

    # Especificar el ancho de las columnas y el alto de las filas
    col_widths = [40] * len(df.columns)  # Ajusta este valor según tus necesidades
    row_heights = [20] * (len(df) + 1) 
    
    # Crear la tabla
    table = Table(data, colWidths=col_widths, rowHeights=row_heights)

    # Aplicar estilo a la tabla
    style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTSIZE', (0, 0), (-1, 0), 7), # Tamaño de los encabezados
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 1), (-1, -1), 7), # Tamaño de las letras dentro de la tabla
        ('BOTTOMPADDING', (0, 0), (-1, 0), 5),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ])
    table.setStyle(style)

    # Añade la tabla a los elementos del PDF
    elements.append(table)

    # Crear gráficos para cada columna con respecto al tiempo
    if 'Tiempo' in df.columns:
        df['Tiempo'] = pd.to_datetime(df['Tiempo'])  # Asegurarse de que 'Tiempo' esté en formato datetime

        for col in df.columns:
            if col != 'Tiempo':
                plt.figure(figsize=(8, 6))
                plt.plot(df['Tiempo'], df[col])
                plt.title(f"{col} vs Tiempo")
                plt.xlabel("Tiempo")
                plt.ylabel(col)
                plt.grid(True)
                plt.tight_layout()

                # Guardar el gráfico en un archivo temporal
                temp_img = tempfile.NamedTemporaryFile(suffix=".png", delete=False)
                plt.savefig(temp_img.name)
                plt.close()  # Cerrar la figura para liberar memoria

                # Añadir la imagen al PDF con tamaño ajustado
                img = Image(temp_img.name, width=400, height=300)  # Ajusta el tamaño aquí
                elements.append(img)

                # Eliminar el archivo temporal
                temp_img.close()

    # Construir el PDF
    doc.build(elements)
    print(f"PDF creado exitosamente: {pdf_file}")

# Llamar a la función con el nombre del archivo CSV y el nombre del archivo PDF de salida
create_pdf_and_plots_from_csv("C:/Users/jairo/Desktop/comunicacion/data_Sat.csv", "datos.pdf")
