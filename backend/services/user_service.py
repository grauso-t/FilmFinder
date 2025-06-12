from database import Database
from models.user import User, UserSchema
from bson import ObjectId
from pymongo.errors import DuplicateKeyError

class UserService:
    def __init__(self):
        self.db = Database()
        self.collection = self.db.get_collection("user")
        self.collectionReviews = self.db.get_collection("reviews")
        self.schema = UserSchema()
        self._create_indexes()
    
    def _create_indexes(self):
        try:
            self.collection.create_index([("email", 1)], unique=True)
            self.collection.create_index([("username", 1)], unique=True)
        except Exception as e:
            print(f"Errore nella creazione degli indici utenti: {e}")
    
    def create_user(self, user_data: dict) -> dict:
        """Crea un nuovo utente"""
        try:
            user_obj = self.schema.load(user_data)
            user_dict = user_obj.__dict__.copy()
            
            user_dict.pop('id', None)

            result = self.collection.insert_one(user_dict)
            
            response_data = {
                'id': str(result.inserted_id),
                'username': user_dict['username'],
                'email': user_dict['email'],
                'favorite_movies': user_dict.get('favorite_movies', [])
            }

            return {'success': True, 'data': response_data}
        except DuplicateKeyError as dke:
            return {'success': False, 'error': 'Email o username già esistenti'}
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def get_user_by_id(self, user_id: str) -> dict:
        """Recupera un utente per ID"""
        try:
            if not ObjectId.is_valid(user_id):
                return {'success': False, 'error': 'ID non valido'}

            user = self.collection.find_one({'_id': ObjectId(user_id)})
            if not user:
                return {'success': False, 'error': 'Utente non trovato'}

            user['id'] = str(user['_id'])
            del user['_id']
            del user['password']

            return {'success': True, 'data': user}
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def get_user_by_credentials(self, email: str, password: str) -> dict:
        """Recupera un utente tramite email e password (login)"""
        try:
            user = self.collection.find_one({'email': email})
            if not user:
                return {'success': False, 'error': 'Credenziali non valide'}

            temp_user = User(
                id=str(user['_id']),
                username=user['username'],
                email=user['email'],
                password=None
            )
            temp_user.password = user['password']

            if not temp_user.check_password(password):
                return {'success': False, 'error': 'Credenziali non valide'}

            user_data = {
                'id': str(user['_id']),
                'username': user['username'],
                'email': user['email'],
                'favorite_movies': user.get('favorite_movies', [])
            }

            return {'success': True, 'data': user_data}
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def get_all_users(self) -> dict:
        """Recupera tutti gli utenti"""
        try:
            users = list(self.collection.find().sort('username', 1))
            for user in users:
                user['id'] = str(user['_id'])
                del user['_id']
                del user['password']

            return {'success': True, 'data': users}
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def delete_user(self, user_id: str) -> dict:
        """Elimina un utente"""
        try:
            if not ObjectId.is_valid(user_id):
                return {'success': False, 'error': 'ID non valido'}

            result = self.collection.delete_one({'_id': ObjectId(user_id)})

            if result.deleted_count:
                return {'success': True, 'message': 'Utente eliminato con successo'}
            else:
                return {'success': False, 'error': 'Utente non trovato'}
        except Exception as e:
            return {'success': False, 'error': str(e)}

    def update_user(self, user_id: str, user_data: dict) -> dict:
        """Aggiorna un utente esistente"""
        try:
            if not ObjectId.is_valid(user_id):
                return {'success': False, 'error': 'ID non valido'}

            user_obj = self.schema.load(user_data, partial=True)
            user_dict = user_obj.__dict__.copy()
            
            user_dict.pop('id', None)

            result = self.collection.update_one(
                {'_id': ObjectId(user_id)},
                {'$set': user_dict}
            )

            if result.matched_count:
                updated_user = self.get_user_by_id(user_id)
                return {'success': True, 'data': updated_user['data']}
            else:
                return {'success': False, 'error': 'Utente non trovato'}
        except DuplicateKeyError as dke:
            return {'success': False, 'error': 'Email o username già esistenti'}
        except Exception as e:
            return {'success': False, 'error': str(e)}

    def add_favorite_movie(self, user_id: str, movie_id: str) -> dict:
        """Aggiunge un film ai preferiti dell'utente"""
        try:
            if not ObjectId.is_valid(user_id):
                return {'success': False, 'error': 'ID utente non valido'}

            # Verifica se l'utente esiste
            user = self.collection.find_one({'_id': ObjectId(user_id)})
            if not user:
                return {'success': False, 'error': 'Utente non trovato'}

            # Verifica se il film è già nei preferiti
            favorite_movies = user.get('favorite_movies', [])
            if movie_id in favorite_movies:
                return {'success': False, 'error': 'Film già nei preferiti'}

            # Aggiunge il film ai preferiti
            result = self.collection.update_one(
                {'_id': ObjectId(user_id)},
                {'$push': {'favorite_movies': movie_id}}
            )

            if result.modified_count:
                return {'success': True, 'message': 'Film aggiunto ai preferiti'}
            else:
                return {'success': False, 'error': 'Errore nell\'aggiunta del film'}
        except Exception as e:
            return {'success': False, 'error': str(e)}

    def remove_favorite_movie(self, user_id: str, movie_id: str) -> dict:
        """Rimuove un film dai preferiti dell'utente"""
        try:
            if not ObjectId.is_valid(user_id):
                return {'success': False, 'error': 'ID utente non valido'}

            # Verifica se l'utente esiste
            user = self.collection.find_one({'_id': ObjectId(user_id)})
            if not user:
                return {'success': False, 'error': 'Utente non trovato'}

            # Verifica se il film è nei preferiti
            favorite_movies = user.get('favorite_movies', [])
            if movie_id not in favorite_movies:
                return {'success': False, 'error': 'Film non presente nei preferiti'}

            # Rimuove il film dai preferiti
            result = self.collection.update_one(
                {'_id': ObjectId(user_id)},
                {'$pull': {'favorite_movies': movie_id}}
            )

            if result.modified_count:
                return {'success': True, 'message': 'Film rimosso dai preferiti'}
            else:
                return {'success': False, 'error': 'Errore nella rimozione del film'}
        except Exception as e:
            return {'success': False, 'error': str(e)}

    def get_favorite_movies(self, user_id: str) -> dict:
        """Recupera la lista dei film preferiti dell'utente"""
        try:
            if not ObjectId.is_valid(user_id):
                return {'success': False, 'error': 'ID utente non valido'}

            user = self.collection.find_one({'_id': ObjectId(user_id)})
            if not user:
                return {'success': False, 'error': 'Utente non trovato'}

            favorite_movies = user.get('favorite_movies', [])
            return {'success': True, 'data': favorite_movies}
        except Exception as e:
            return {'success': False, 'error': str(e)}

    def is_favorite_movie(self, user_id: str, movie_id: str) -> dict:
        """Controlla se un film è nei preferiti dell'utente"""
        try:
            if not ObjectId.is_valid(user_id):
                return {'success': False, 'error': 'ID utente non valido'}

            user = self.collection.find_one({'_id': ObjectId(user_id)})
            if not user:
                return {'success': False, 'error': 'Utente non trovato'}

            favorite_movies = user.get('favorite_movies', [])
            is_favorite = movie_id in favorite_movies
            
            return {'success': True, 'data': {'is_favorite': is_favorite}}
        except Exception as e:
            return {'success': False, 'error': str(e)}