from flask import request, jsonify
from marshmallow import ValidationError
from services.user_service import UserService
from services.movie_service import MovieService

class UserController:
    def __init__(self):
        self.user_service = UserService()
        self.movie_service = MovieService()
    
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

    def add_favorite_movie(self, user_id):
        """POST /users/<id>/favorites - Aggiunge un film ai preferiti"""
        try:
            data = request.get_json()
            if not data:
                return jsonify({'error': 'Dati JSON richiesti'}), 400
            
            movie_id = data.get('movie_id')
            if not movie_id:
                return jsonify({'error': 'movie_id è richiesto'}), 400

            result = self.user_service.add_favorite_movie(user_id, movie_id)
            
            if result['success']:
                return jsonify({'message': result['message']}), 200
            else:
                return jsonify({'error': result['error']}), 400
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    def remove_favorite_movie(self, user_id, movie_id):
        """DELETE /users/<id>/favorites/<movie_id> - Rimuove un film dai preferiti"""
        try:
            result = self.user_service.remove_favorite_movie(user_id, movie_id)
            
            if result['success']:
                return jsonify({'message': result['message']}), 200
            else:
                return jsonify({'error': result['error']}), 400
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def get_favorite_movies(self, user_id):
        """GET /users/<id>/favorites - Recupera la lista dei film preferiti con dettagli completi"""
        try:
            favorite_ids_result = self.user_service.get_favorite_movies(user_id)
            
            if not favorite_ids_result.get('success'):
                return jsonify({'error': favorite_ids_result.get('error', 'Utente non trovato')}), 404

            detailed_favorite_movies = []
            movie_ids = favorite_ids_result.get('data', [])

            for movie_id in movie_ids:
                movie_details_result = self.movie_service.get_movie_by_id(movie_id)

                if movie_details_result.get('success'):
                    detailed_favorite_movies.append(movie_details_result['data'])
                else:
                    print(f"Attenzione: il film con ID {movie_id} non è stato trovato.")

            return jsonify({'favorite_movies': detailed_favorite_movies}), 200
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    def check_favorite_movie(self, user_id, movie_id):
        """GET /users/<id>/favorites/<movie_id> - Controlla se un film è nei preferiti"""
        try:
            result = self.user_service.is_favorite_movie(user_id, movie_id)
            
            if result['success']:
                return jsonify(result['data']), 200
            else:
                return jsonify({'error': result['error']}), 404
        except Exception as e:
            return jsonify({'error': str(e)}), 500