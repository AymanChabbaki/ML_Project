import joblib
import traceback
import sys

print("Python version:", sys.version)

try:
    data = joblib.load('tox21_production_models/pipeline_NR-AR-LBD.pkl')
    print("Loaded successfully")
except Exception as e:
    print("Error type:", type(e))
    print("Error string:", str(e))
    traceback.print_exc()
