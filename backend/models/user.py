import bcrypt
from marshmallow import Schema, fields, validate, post_load, validates, ValidationError

class User:
    def __init__(self, id=None, username=None, email=None, password=None, favorite_movies=None):
        self.id = id
        self.username = username
        self.email = email
        self.password = self.hash_password(password) if password else None
        self.favorite_movies = favorite_movies or []

    def hash_password(self, raw_password: str) -> str:
        hashed = bcrypt.hashpw(raw_password.encode('utf-8'), bcrypt.gensalt())
        return hashed.decode('utf-8')

    def check_password(self, raw_password: str) -> bool:
        return bcrypt.checkpw(raw_password.encode('utf-8'), self.password.encode('utf-8'))

    def add_favorite_movie(self, movie_id: str):
        """Aggiunge un film ai preferiti se non è già presente"""
        if movie_id not in self.favorite_movies:
            self.favorite_movies.append(movie_id)

    def remove_favorite_movie(self, movie_id: str):
        """Rimuove un film dai preferiti se presente"""
        if movie_id in self.favorite_movies:
            self.favorite_movies.remove(movie_id)

    def is_favorite_movie(self, movie_id: str) -> bool:
        """Controlla se un film è nei preferiti"""
        return movie_id in self.favorite_movies

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'favorite_movies': self.favorite_movies
        }

class UserSchema(Schema):
    id = fields.Str(dump_only=True)
    username = fields.Str(required=True, validate=validate.Length(min=3, max=30))
    email = fields.Email(required=True)
    password = fields.Str(required=True, load_only=True, validate=validate.Length(min=6))
    favorite_movies = fields.List(fields.Str(), load_default=[])

    @validates("username")
    def validate_username(self, value, **kwargs):
        if " " in value:
            raise ValidationError("Il nome utente non può contenere spazi.")

    @post_load
    def make_user(self, data, **kwargs):
        return User(**data)