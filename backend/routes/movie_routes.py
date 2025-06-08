# routes/movie_routes.py
from flask import Blueprint
from controllers.movie_controller import MovieController

def create_movie_routes():
    movie_bp = Blueprint('movies', __name__, url_prefix='/api/movies')
    movie_controller = MovieController()
    
    # Definizione delle rotte
    movie_bp.add_url_rule('/', 'create_movie', movie_controller.create_movie, methods=['POST'])
    movie_bp.add_url_rule('/', 'get_all_movies', movie_controller.get_all_movies, methods=['GET'])
    movie_bp.add_url_rule('/<movie_id>', 'get_movie', movie_controller.get_movie, methods=['GET'])
    movie_bp.add_url_rule('/<movie_id>', 'update_movie', movie_controller.update_movie, methods=['PUT'])
    movie_bp.add_url_rule('/<movie_id>', 'delete_movie', movie_controller.delete_movie, methods=['DELETE'])
    movie_bp.add_url_rule('/statistics', 'get_statistics', movie_controller.get_statistics, methods=['GET'])
    movie_bp.add_url_rule('/search', 'search_movies', movie_controller.search_movies, methods=['GET'])

    return movie_bp