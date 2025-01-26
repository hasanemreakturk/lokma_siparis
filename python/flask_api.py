from flask import Flask, request, jsonify
import pandas as pd
from joblib import load

app = Flask(__name__)

# Modelleri yükleme
pasta_model = load('pastalar_makine_model.pkl')
tatli_model = load('şerbetli_model.pkl')
cesit_model = load('cesit_model.pkl')

@app.route('/predict-pasta', methods=['POST'])
def predict_pasta():
    data = request.json  # JSON verisi al
    df = pd.DataFrame(data)
    predictions = pasta_model.predict(df)
    return jsonify({'predictions': predictions.tolist()})

@app.route('/predict-tatli', methods=['POST'])
def predict_tatli():
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # JSON verisini konsola yazdır
        print("Received JSON Data:", data)

        # JSON verisini DataFrame'e dönüştür
        df = pd.DataFrame(data)
        print("Received DataFrame:", df.head())

        # Modelin beklediği özellikler
        expected_columns = ['Branch', 'Product', 'Category', 'DayOfWeek', 'IsWeekend', 'Month', 'Quarter', 'Year']
        
        # Giriş verilerinden fazla sütunları kaldır
        df = df[expected_columns]
        print("Filtered DataFrame for Model:", df.head())

        # Model tahminini yap
        predictions = tatli_model.predict(df)
        print("Predictions:", predictions)

        return jsonify({'predictions': predictions.tolist()})
    except Exception as e:
        print("Error during prediction:", str(e))
        return jsonify({'error': str(e)}), 500


@app.route('/predict-cesit', methods=['POST'])
def predict_cesit():
    data = request.json
    df = pd.DataFrame(data)
    predictions = cesit_model.predict(df)
    return jsonify({'predictions': predictions.tolist()})


if __name__ == '__main__':
    app.run(port=5000, debug=True)
