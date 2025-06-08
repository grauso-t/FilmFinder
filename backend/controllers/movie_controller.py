# controllers/movie_controller.py
from flask import request, jsonify
from services.movie_service import MovieService
from marshmallow import ValidationError

class MovieController:
    def __init__(self):
        self.movie_service = MovieService()
    
    def create_movie(self):
        """POST /movies - Crea un nuovo film"""
        try:
            data = request.get_json()
            if not data:
                return jsonify({'error': 'Dati JSON richiesti'}), 400
            
            result = self.movie_service.create_movie(data)
            
            if result['success']:
                return jsonify(result['data']), 201
            else:
                return jsonify({'error': result['error']}), 400
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def get_movie(self, movie_id):
        """GET /movies/<id> - Recupera un film per ID"""
        try:
            result = self.movie_service.get_movie_by_id(movie_id)
            
            if result['success']:
                return jsonify(result['data']), 200
            else:
                return jsonify({'error': result['error']}), 404
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def get_all_movies(self):
        """GET /movies - Recupera tutti i film con filtri e paginazione"""
        try:
            # Parametri di query
            page = int(request.args.get('page', 1))
            per_page = min(int(request.args.get('per_page', 500)), 1000)  # Max 100
            
            # Filtri
            filters = {}
            if request.args.get('type'):
                filters['type'] = request.args.get('type')
            if request.args.get('genre'):
                filters['genre'] = request.args.get('genre')
            if request.args.get('year'):
                filters['year'] = int(request.args.get('year'))
            if request.args.get('min_score'):
                filters['min_score'] = float(request.args.get('min_score'))
            if request.args.get('search'):
                filters['search'] = request.args.get('search')
            
            result = self.movie_service.get_all_movies(page, per_page, filters)
            
            if result['success']:
                return jsonify(result), 200
            else:
                return jsonify({'error': result['error']}), 400
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def update_movie(self, movie_id):
        """PUT /movies/<id> - Aggiorna un film"""
        try:
            data = request.get_json()
            if not data:
                return jsonify({'error': 'Dati JSON richiesti'}), 400
            
            result = self.movie_service.update_movie(movie_id, data)
            
            if result['success']:
                return jsonify(result['data']), 200
            else:
                return jsonify({'error': result['error']}), 400
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def delete_movie(self, movie_id):
        """DELETE /movies/<id> - Elimina un film"""
        try:
            result = self.movie_service.delete_movie(movie_id)
            
            if result['success']:
                return jsonify({'message': result['message']}), 200
            else:
                return jsonify({'error': result['error']}), 404
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    def get_statistics(self):
        """GET /movies/statistics - Ottiene statistiche sui film"""
        try:
            result = self.movie_service.get_statistics()
            
            if result['success']:
                return jsonify(result['data']), 200
            else:
                return jsonify({'error': result['error']}), 400
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        
    def search_movies(self):
        """GET /movies/search - Cerca film per titolo o descrizione"""
        try:
            query = request.args.get('query', '')
            if not query:
                return jsonify({'error': 'Query di ricerca richiesta'}), 400
            
            result = self.movie_service.search_movies(query)
            
            if result['success']:
                return jsonify(result['data']), 200
            else:
                return jsonify({'error': result['error']}), 400
        except ValidationError as ve:
            return jsonify({'error': str(ve)}), 400
        except Exception as e:
            return jsonify({'error': str(e)}), 500