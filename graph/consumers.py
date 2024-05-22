import  pandas as pd
import json
# import serial_asyncio
from asyncio import sleep
from channels.generic.websocket import AsyncWebsocketConsumer
import time
import random

class GraphConsumer(AsyncWebsocketConsumer):
    
    async def connect(self):
        await self.accept()
        self.keep_sending_data = True  # Para controlar el envío de datos
        await self.send_realtime_data()

    async def disconnect(self, close_code):
        self.keep_sending_data = False  # Detener el envío de datos al desconectar

    async def receive(self, text_data):
        # Puedes procesar los mensajes entrantes aquí si es necesario
        pass

    async def send_realtime_data(self):
        previous_data_length = 0
        while self.keep_sending_data:
            try:
                df = pd.read_csv('C:/Users/jairo/Desktop/comunicacion/data_Sat.csv')
                current_data_length = len(df)

                # Enviar sólo los datos nuevos
                if current_data_length > previous_data_length:
                    new_data = df.iloc[previous_data_length:]
                    await self.send_new_data(new_data)
                    previous_data_length = current_data_length
                
                await sleep(1)
            except Exception as e:
                await self.send(json.dumps({"error": str(e)}))
                break

    async def send_new_data(self, data):
        for _, row in data.iterrows():
            await self.send(json.dumps({
                "value": row['Altitud'],
                "temperature": row['Temperatura'],
                "velocidad": row['Velocidad'],
                "aceleracion": row['Aceleracion'],
                "presion": row['Presion'],
                "tiempo": row['Tiempo'],
                "acX": row['AclX'],
                "acY": row['AclY'],
                "acZ": row['AclZ'],
                "gyX": row['GiroX'],
                "gyY": row['GiroY'],
                "gyZ": row['GiroZ'],
                "lat": row['Lat'],
                "long": row['Long'],
                "AltGps": row['Altgps'],
                "Altmax": row['AltMAX']
            }))
            await sleep(1)


# class GraphConsumer(AsyncWebsocketConsumer):
    
#     async def connect(self):
#         await self.accept()
#         df = pd.read_csv('C:/Users/jairo/Desktop/comunicacion/data_Sat.csv')
#         await self.send_data(df['Altitud'],df['Temperatura'],df['Velocidad'],df['Aceleracion'],df['Presion'])
            
#     async def send_data(self, altitudes, temperatures, velocidad, aceleracion,presion):
#         for altitude, temperature, velocidad, aceleracion,presion in zip(altitudes, temperatures,velocidad,aceleracion,presion):
#             await self.send(json.dumps({"value": altitude, "temperature": temperature, "velocidad": velocidad,"aceleracion":aceleracion, "presion":presion}))
#             await sleep(1)
    
