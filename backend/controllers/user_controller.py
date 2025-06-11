from flask import request, jsonify
from marshmallow import ValidationError
from services.user_service import UserService

class UserController:
    def __init__(self):
        self.user_service = UserService()
    
    def create_user(self):
        """POST /users - Crea un nuovo utente"""
        try:
            data = request.get_json()            
            if not data:
                return jsonify({'error': 'Dati JSON richiesti'}), 400

            result = self.user_service.create_user(data)

            if result['success']:
                return jsonify(result['data']), 201
            else:
                return jsonify({'error': result['error']}), 400
        except ValidationError as ve:
            return jsonify({'error': str(ve)}), 400
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    def get_user(self, user_id):
        """GET /users/<id> - Recupera un utente per ID"""
        try:
            result = self.user_service.get_user_by_id(user_id)
            
            if result['success']:
                return jsonify(result['data']), 200
            else:
                return jsonify({'error': result['error']}), 404
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    def login_user(self):
        """POST /users/login - Login utente con email e password"""
        try:
            data = request.get_json()
            if not data:
                return jsonify({'error': 'Dati JSON richiesti'}), 400
            
            email = data.get('email')
            password = data.get('password')
            
            if not email or not password:
                return jsonify({'error': 'Email e password sono richiesti'}), 400

            result = self.user_service.get_user_by_credentials(email, password)
            
            if result['success']:
                return jsonify(result['data']), 200
            else:
                return jsonify({'error': result['error']}), 401
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    def get_all_users(self):
        """GET /users - Recupera tutti gli utenti"""
        try:
            result = self.user_service.get_all_users()
            
            if result['success']:
                return jsonify(result['data']), 200
            else:
                return jsonify({'error': result['error']}), 400
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    def delete_user(self, user_id):
        """DELETE /users/<id> - Elimina un utente"""
        try:
            result = self.user_service.delete_user(user_id)
            
            if result['success']:
                return jsonify({'message': result['message']}), 200
            else:
                return jsonify({'error': result['error']}), 404
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    def update_user(self, user_id):
        """PUT /users/<id> - Aggiorna un utente"""
        try:
            data = request.get_json()
            if not data:
                return jsonify({'error': 'Dati JSON richiesti'}), 400

            result = self.user_service.update_user(user_id, data)

            if result['success']:
                return jsonify(result['data']), 200
            else:
                return jsonify({'error': result['error']}), 404
        except ValidationError as ve:
            return jsonify({'error': str(ve)}), 400
        except Exception as e:
            return jsonify({'error': str(e)}), 500