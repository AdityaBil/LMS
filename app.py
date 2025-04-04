from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from lms2 import LibraryManagementSystem
import os
import mysql.connector

app = Flask(__name__, static_folder='.')
CORS(app)

lms = LibraryManagementSystem()

@app.route('/')
def serve_frontend():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/add_book', methods=['POST'])
def add_book():
    data = request.json
    try:
        lms.add_book(data['title'], data['author'])
        return jsonify({'message': 'Book added successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/add_user', methods=['POST'])
def add_user():
    data = request.json
    if not data or 'name' not in data:
        return jsonify({'error': 'Name is required'}), 400
    
    try:
        name = data['name'].strip()
        if not name:
            return jsonify({'error': 'Name cannot be empty'}), 400
            
        lms.add_user(name)
        return jsonify({'message': 'User added successfully'}), 200
    except mysql.connector.Error as e:
        if e.errno == 1062:  # Duplicate entry error
            return jsonify({'error': 'A user with this name already exists'}), 400
        else:
            app.logger.error(f"Database error: {str(e)}")
            return jsonify({'error': 'Database error occurred'}), 500
    except Exception as e:
        app.logger.error(f"Unexpected error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/issue_book', methods=['POST'])
def issue_book():
    data = request.json
    try:
        lms.issue_book(data['book_id'], data['user_name'])
        return jsonify({'message': 'Book issued successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/return_book', methods=['POST'])
def return_book():
    data = request.json
    try:
        lms.return_book(data['book_id'])
        return jsonify({'message': 'Book returned successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/list_books', methods=['GET'])
def list_books():
    try:
        books = []
        lms.cursor.execute("SELECT * FROM books")
        for book in lms.cursor.fetchall():
            books.append({
                'id': book[0],
                'title': book[1],
                'author': book[2],
                'available': book[3]
            })
        return jsonify(books), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/list_users', methods=['GET'])
def list_users():
    try:
        users = []
        lms.cursor.execute("SELECT * FROM users")
        for user in lms.cursor.fetchall():
            users.append({
                'id': user[0],
                'name': user[1]
            })
        return jsonify(users), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/issued_books', methods=['GET'])
def issued_books():
    try:
        issued_books = []
        lms.cursor.execute("SELECT * FROM issued_books")
        for book in lms.cursor.fetchall():
            issued_books.append({
                'book_id': book[0],
                'user_name': book[1]
            })
        return jsonify(issued_books), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True) 