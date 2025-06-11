from database import Database
from models.user import User, UserSchema
from bson import ObjectId
from pymongo.errors import DuplicateKeyError

class UserService:
    def __init__(self):
        self.db = Database()
        self.collection = self.db.get_collection("user")
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
            user_dict = user_obj.__dict__.copy()  # Crea una copia per evitare modifiche all'oggetto originale
            
            # Rimuovi l'id se presente (non dovrebbe esserci, ma per sicurezza)
            user_dict.pop('id', None)

            result = self.collection.insert_one(user_dict)
            
            # Prepara la risposta con l'ID generato da MongoDB
            response_data = {
                'id': str(result.inserted_id),
                'username': user_dict['username'],
                'email': user_dict['email']
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
            del user['password']  # Mai restituire la password

            return {'success': True, 'data': user}
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def get_user_by_credentials(self, email: str, password: str) -> dict:
        """Recupera un utente tramite email e password (login)"""
        try:
            # Trova l'utente per email
            user = self.collection.find_one({'email': email})
            if not user:
                return {'success': False, 'error': 'Credenziali non valide'}

            # Crea un oggetto User temporaneo per verificare la password
            temp_user = User(
                id=str(user['_id']),
                username=user['username'],
                email=user['email'],
                password=None  # Non hashare di nuovo
            )
            temp_user.password = user['password']  # Assegna direttamente la password hashata

            # Verifica la password
            if not temp_user.check_password(password):
                return {'success': False, 'error': 'Credenziali non valide'}

            # Prepara la risposta senza la password
            user_data = {
                'id': str(user['_id']),
                'username': user['username'],
                'email': user['email']
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
            
            # Rimuovi l'id se presente nei dati di aggiornamento
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