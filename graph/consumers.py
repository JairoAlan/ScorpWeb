import  pandas as pd
import json
from asyncio import sleep
from channels.generic.websocket import AsyncWebsocketConsumer

df = pd.read_csv('data_Sat.csv')

class GraphConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        await self.send_data(df['Altitud'],df['Temperatura'],df['Velocidad'],df['Aceleracion'],df['Presion'])
            
    async def send_data(self, altitudes, temperatures, velocidad, aceleracion,presion):
        for altitude, temperature, velocidad, aceleracion,presion in zip(altitudes, temperatures,velocidad,aceleracion,presion):
            await self.send(json.dumps({"value": altitude, "temperature": temperature, "velocidad": velocidad,"aceleracion":aceleracion, "presion":presion}))
            await sleep(1)
        
   