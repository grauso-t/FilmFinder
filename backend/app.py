from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from database import Database
from routes.movie_routes import create_movie_routes
from routes.user_routes import create_user_routes

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    CORS(app)
    
    db = Database()
    db.connect()
    
    movie_routes = create_movie_routes()
    user_routes = create_user_routes()
    
    app.register_blueprint(movie_routes)
    app.register_blueprint(user_routes)
    
    @app.route('/api/health')
    def health_check():
        return jsonify({
            'status': 'healthy',
            'message': 'Movie API Server is running'
        }), 200
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Endpoint non trovato'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Errore interno del server'}), 500
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=Config.DEBUG, host='0.0.0.0', port=5000)