import pandas as pd
import os
import json
# Importamos la ruta base de Flask para calcular rutas relativas de forma segura
from flask import current_app 

def load_and_process_csv():
    """
    Carga el archivo CSV, realiza el análisis de datos (Pandas)
    y lo retorna en un formato listo para la API (JSON/Dict).
    """
    # Se recomienda usar os.path.join para construir rutas de forma segura en cualquier SO.
    # El archivo 'data/music_data.csv' está dos niveles arriba de 'analysis.py'
    data_path = os.path.join(
        current_app.root_path, '..', 'data', 'music_data.csv'
    )
    
    try:
        # 1. Cargar los datos
        df = pd.read_csv(data_path)
        
        # 2. **Lógica de Análisis aquí** (Ejemplo de agregación)
        # Aquí puedes agregar, filtrar o calcular métricas de tu música.
        
        # Ejemplo: Contar cuántas canciones hay por género (asumiendo una columna 'genre')
        if 'genre' in df.columns:
            summary_df = df.groupby('genre').size().reset_index(name='count')
        else:
            # Si no hay columna 'genre', solo retorna un resumen simple.
            summary_df = df.head(5) 
            
        
        # 3. Convertir a un formato que Flask/JSON entienda
        # 'records' lo convierte en una lista de diccionarios, ideal para APIs.
        return summary_df.to_dict('records') 

    except FileNotFoundError:
        print(f"ERROR: No se encontró el archivo CSV en la ruta: {data_path}")
        return {"error": "Data file not found"}
    except Exception as e:
        print(f"Ocurrió un error al procesar el CSV: {e}")
        return {"error": str(e)}