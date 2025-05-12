from flask import Flask, jsonify

app = Flask(__name__)

# Sample product data
products = [
    {"id": 1, "name": "Google Pixel 7", "price": 500, "rating": 4.5},
    {"id": 2, "name": "Tommy Hilfiger Jacket", "price": 100, "rating": 4.8},
    {"id": 3, "name": "Drawing Tools Set", "price": 20, "rating": 4.6},
]

@app.route('/best-product', methods=['GET'])
def get_best_product():
    # Logic to determine the best product based on rating
    best_product = max(products, key=lambda x: x['rating'])
    return jsonify(best_product)

if __name__ == '__main__':
    app.run(debug=True)
