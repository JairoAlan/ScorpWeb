from django.shortcuts import render
import  pandas as pd


# Create your views here.
df = pd.read_csv('data_Sat.csv')
def index(request):
    return render(request, 'base.html', context={'text': ""})

# def cargar_mapa(mi_latitud, mi_longitud, destino_latitud, destino_longitud, zoom, tamaño):
#     return render(request, 'base.html', {
#         'mi_latitud': mi_latitud,
#         'mi_longitud': mi_longitud,
#         'destino_latitud': destino_latitud,
#         'destino_longitud': destino_longitud,
#         'zoom': zoom,
#         'tamaño': tamaño,
#         'api_key': "TU_CLAVE_DE_API",
#     })