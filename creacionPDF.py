import pandas as pd
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
import matplotlib.pyplot as plt
import tempfile

def create_pdf_and_plots_from_csv(csv_file, pdf_file):
    # Leer el archivo CSV
    df = pd.read_csv(csv_file)

    # Crear un lienzo para el PDF
    c = canvas.Canvas(pdf_file, pagesize=letter)
    
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

                # Añadir la imagen al PDF
                c.showPage()  # Crear una nueva página para cada gráfico
                c.drawImage(ImageReader(temp_img.name), 50, 400, width=500, height=300)
                c.drawString(50, 750, f"{col} vs Tiempo")

                # Eliminar el archivo temporal
                temp_img.close()

    # Guardar el PDF
    c.save()
    print(f"PDF creado exitosamente: {pdf_file}")

# Llamar a la función con el nombre del archivo CSV y el nombre del archivo PDF de salida
create_pdf_and_plots_from_csv("C:/Users/jairo/Desktop/comunicacion/data_Sat.csv", "datos.pdf")