from database import Database
from models.movie import Movie, MovieSchema
from bson import ObjectId
from pymongo.errors import DuplicateKeyError
from typing import List, Dict, Optional, Any
from datetime import datetime

class MovieService:
    def __init__(self):
        self.db = Database()
        self.collection = self.db.get_collection("movie")
        self.schema = MovieSchema()
        self._create_indexes()
    
    def _create_indexes(self):
        """Crea indici per ottimizzare le query"""
        try:
            self.collection.create_index([("title", 1)])
            self.collection.create_index([("type", 1)])
            self.collection.create_index([("release_year", -1)])
            self.collection.create_index([("imdb_score", -1)])
            self.collection.create_index([("tmdb_score", -1)])
            self.collection.create_index([("genres", 1)])
            self.collection.create_index([("imdb_id", 1)], unique=True, sparse=True)
        except Exception as e:
            print(f"Errore nella creazione degli indici: {e}")
    
    def create_movie(self, movie_data: Dict) -> Dict:
        """Crea un nuovo film"""
        try:
            movie_obj = self.schema.load(movie_data)
            movie_dict = movie_obj.to_dict()
            
            result = self.collection.insert_one(movie_dict)
            movie_dict['id'] = str(result.inserted_id)
            
            return {'success': True, 'data': movie_dict}
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def get_movie_by_id(self, movie_id: str) -> Dict:
        try:
            pipeline = [
                {
                    '$match': {'_id': movie_id}
                },
                {
                    '$lookup': {
                        'from': 'credits',
                        'localField': '_id',
                        'foreignField': 'film_id',
                        'as': 'credits'
                    }
                }
            ]
            
            print(f"movie_id: {movie_id}")
            result = list(self.collection.aggregate(pipeline))
            
            if not result:
                return {'success': False, 'error': 'Film non trovato'}
            
            movie = result[0]
            movie['id'] = str(movie['_id'])
            del movie['_id']
            
            movie['actors'] = []
            movie['directors'] = []
            
            for credit in movie['credits']:
                credit_data = {
                    'id': str(credit['_id']),
                    'name': credit['name'],
                    'character': credit.get('character', ''),
                    'role': credit['role']
                }
                if credit['role'] == 'ACTOR':
                    movie['actors'].append(credit_data)
                elif credit['role'] == 'DIRECTOR':
                    movie['directors'].append(credit_data)
            
            del movie['credits']
            
            return {'success': True, 'data': movie}
            
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def get_all_movies(self, page: int = 1, per_page: int = 20, 
                      filters: Dict = None) -> Dict:
        """Recupera tutti i film con paginazione e filtri"""
        try:
            skip = (page - 1) * per_page
            query = {}

            if filters:
                if 'type' in filters:
                    query['type'] = filters['type']
                if 'genre' in filters:
                    query['genres'] = {'$in': [filters['genre']]}
                if 'year' in filters:
                    query['release_year'] = filters['year']
                if 'min_score' in filters:
                    query['imdb_score'] = {'$gte': float(filters['min_score'])}
                if 'search' in filters:
                    query['$or'] = [
                        {'title': {'$regex': filters['search'], '$options': 'i'}},
                        {'description': {'$regex': filters['search'], '$options': 'i'}}
                    ]
            
            total = self.collection.count_documents(query)
            
            movies = list(self.collection.find(query)
                         .skip(skip)
                         .limit(per_page)
                         .sort('created_at', -1))
            
            for movie in movies:
                movie['id'] = str(movie['_id'])
                del movie['_id']
            
            return {
                'success': True,
                'data': movies,
                'pagination': {
                    'page': page,
                    'per_page': per_page,
                    'total': total,
                    'pages': (total + per_page - 1) // per_page
                }
            }
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def update_movie(self, movie_id: str, update_data: Dict) -> Dict:
        """Aggiorna un film"""
        try:
            if not ObjectId.is_valid(movie_id):
                return {'success': False, 'error': 'ID non valido'}
            
            movie_obj = self.schema.load(update_data, partial=True)
            update_dict = movie_obj.to_dict()
            update_dict['updated_at'] = datetime.utcnow()
            
            result = self.collection.update_one(
                {'_id': ObjectId(movie_id)},
                {'$set': update_dict}
            )
            
            if result.matched_count:
                return self.get_movie_by_id(movie_id)
            else:
                return {'success': False, 'error': 'Film non trovato'}
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def delete_movie(self, movie_id: str) -> Dict:
        """Elimina un film"""
        try:
            if not ObjectId.is_valid(movie_id):
                return {'success': False, 'error': 'ID non valido'}
            
            result = self.collection.delete_one({'_id': ObjectId(movie_id)})
            
            if result.deleted_count:
                return {'success': True, 'message': 'Film eliminato con successo'}
            else:
                return {'success': False, 'error': 'Film non trovato'}
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def get_statistics(self) -> Dict:
        """Ottiene statistiche sui film"""
        try:
            pipeline = [
                {
                    '$group': {
                        '_id': None,
                        'total_movies': {'$sum': 1},
                        'avg_imdb_score': {'$avg': '$imdb_score'},
                        'avg_runtime': {'$avg': '$runtime'},
                        'total_shows': {
                            '$sum': {'$cond': [{'$eq': ['$type', 'show']}, 1, 0]}
                        },
                        'total_movies_only': {
                            '$sum': {'$cond': [{'$eq': ['$type', 'movie']}, 1, 0]}
                        }
                    }
                }
            ]
            
            stats = list(self.collection.aggregate(pipeline))
            if stats:
                del stats[0]['_id']
                return {'success': True, 'data': stats[0]}
            else:
                return {'success': True, 'data': {}}
        except Exception as e:
            return {'success': False, 'error': str(e)}
        
    def search_movies(self, query: str) -> Dict:
        """Cerca film per titolo o descrizione"""
        try:
            if not query:
                return {'success': False, 'error': 'Query di ricerca richiesta'}
            
            regex_query = {'$regex': query, '$options': 'i'}
            movies = list(self.collection.find({
                '$or': [
                    {'title': regex_query},
                    {'description': regex_query}
                ]
            }).sort('created_at', -1))
            
            for movie in movies:
                movie['id'] = str(movie['_id'])
                del movie['_id']
            
            return {'success': True, 'data': movies}
        except Exception as e:
            return {'success': False, 'error': str(e)}