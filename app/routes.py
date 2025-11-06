from flask import Blueprint, jsonify
from .analysis import load_and_process_csv 

main = Blueprint('main', __name__)

@main.route('/api/status', methods=['GET'])
def status():
    # ... (El mismo código que antes)
    return jsonify({"status": "Backend running successfully", "service": "Music Analytics API"})

@main.route('/api/data/summary', methods=['GET'])
def get_data_summary():
    """
    Endpoint para obtener el resumen de datos analizados del CSV.
    """
    summary_data = load_and_process_csv() 
    return jsonify(summary_data)