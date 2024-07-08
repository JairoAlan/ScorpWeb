import pandas as pd
import numpy as np
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Image, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
import matplotlib.pyplot as plt
import tempfile

def clean_data(df):
    # Convertir todas las columnas posibles a tipo numérico
    df = df.apply(pd.to_numeric, errors='coerce')
    
    # Reemplazar ceros por numpy.nan
    df.replace(0, np.nan, inplace=True)
    
    # Interpolar valores faltantes
    df.interpolate(method='linear', inplace=True)
    
    # Eliminar filas que aún contienen valores NaN
    df.dropna(inplace=True)
    
    return df

def smooth_data(series, window_size=5):
    return series.rolling(window=window_size, min_periods=1, center=True).mean()

def create_pdf_and_plots_from_csv(csv_file, pdf_file, window_size=5, title="Reporte de Datos"):
    # Leer el archivo CSV
    df = pd.read_csv(csv_file)
    
    # Limpiar los datos
    df = clean_data(df)
    
    # Crear un lienzo para el PDF
    doc = SimpleDocTemplate(pdf_file, pagesize=letter)
    elements = []

    # Crear estilos para el título
    styles = getSampleStyleSheet()
    title_style = styles['Title']
    title_paragraph = Paragraph(title, title_style)
    elements.append(title_paragraph)
    elements.append(Spacer(1, 12))  # Agrega un espacio después del título

    # Convertir el DataFrame en una lista de listas
    data = [df.columns.tolist()] + df.values.tolist()

    # Especificar el ancho de las columnas y el alto de las filas
    col_widths = [35] * len(df.columns)  # Ajusta este valor según tus necesidades
    row_heights = [20] * (len(df) + 1) 
    
    # Crear la tabla
    table = Table(data, colWidths=col_widths, rowHeights=row_heights)

    # Aplicar estilo a la tabla
    style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTSIZE', (0, 0), (-1, 0), 5), # Tamaño de los encabezados
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 1), (-1, -1), 5), # Tamaño de las letras dentro de la tabla
        ('BOTTOMPADDING', (0, 0), (-1, 0), 5),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ])
    table.setStyle(style)

    # Añade la tabla a los elementos del PDF
    elements.append(table)
    
    elements.append(Spacer(1, 12))

    # Crear gráficos para cada columna con respecto al tiempo
    if 'Tiempo' in df.columns:
        df['Tiempo'] = pd.to_datetime(df['Tiempo'])  # Asegurarse de que 'Tiempo' esté en formato datetime

        for col in df.columns:
            if col != 'Tiempo':
                # Suavizar los datos
                smooth_series = smooth_data(df[col], window_size)

                plt.figure(figsize=(8, 6))
                plt.plot(df['Tiempo'], smooth_series)
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

if __name__ == "__main__":
    create_pdf_and_plots_from_csv(
        csv_file="C:/Users/jairo/Desktop/comunicacion/data_Sat.csv",
        pdf_file="datosScorpio.pdf",
        window_size=5,
        title="Reporte de Datos Satelitales Scorpio"
    )
