from flask import Flask, request, jsonify
import sqlite3
import hashlib

app = Flask(__name__)

# Database setup (create table if it doesn't exist)
def init_db():
    conn = sqlite3.connect('users.db')  # SQLite database
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT NOT NULL,
            password TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

# Home route (optional)
@app.route('/')
def home():
    return "Welcome to the Sign-Up API!"

# Sign Up route
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()  # Get JSON data from frontend
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # Validate the input
    if not username or not email or not password:
        return jsonify({'error': 'All fields are required!'}), 400

    # Hash the password for security
    hashed_password = hashlib.sha256(password.encode()).hexdigest()

    # Insert the user data into the database
    try:
        conn = sqlite3.connect('users.db')
        cursor = conn.cursor()
        cursor.execute('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                       (username, email, hashed_password))
        conn.commit()
        conn.close()
        return jsonify({'message': 'User registered successfully!'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Initialize database when the script runs
if __name__ == '__main__':
    init_db()
    app.run(debug=True)
