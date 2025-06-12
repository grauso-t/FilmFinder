from flask import Blueprint
from controllers.user_controller import UserController

def create_user_routes():
    user_bp = Blueprint('users', __name__, url_prefix='/api/users')
    user_controller = UserController()

    user_bp.add_url_rule('/', 'create_user', user_controller.create_user, methods=['POST'])
    user_bp.add_url_rule('/', 'get_all_users', user_controller.get_all_users, methods=['GET'])
    user_bp.add_url_rule('/login', 'login_user', user_controller.login_user, methods=['POST'])
    user_bp.add_url_rule('/<user_id>', 'get_user', user_controller.get_user, methods=['GET'])
    user_bp.add_url_rule('/<user_id>', 'delete_user', user_controller.delete_user, methods=['DELETE'])
    user_bp.add_url_rule('/<user_id>', 'update_user', user_controller.update_user, methods=['PUT'])

    user_bp.add_url_rule('/<user_id>/favorites', 'add_favorite_movie', user_controller.add_favorite_movie, methods=['POST'])
    user_bp.add_url_rule('/<user_id>/favorites', 'get_favorite_movies', user_controller.get_favorite_movies, methods=['GET'])
    user_bp.add_url_rule('/<user_id>/favorites/<movie_id>', 'remove_favorite_movie', user_controller.remove_favorite_movie, methods=['DELETE'])
    user_bp.add_url_rule('/<user_id>/favorites/<movie_id>', 'check_favorite_movie', user_controller.check_favorite_movie, methods=['GET'])

    return user_bp