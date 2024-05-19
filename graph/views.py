from django.shortcuts import render
import  pandas as pd

# Create your views here.
df = pd.read_csv('data_Sat.csv')

def index(request):
    return render(request, 'base.html')

