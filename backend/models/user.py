import bcrypt
from marshmallow import Schema, fields, validate, post_load, validates, ValidationError

class User:
    def __init__(self, id=None, username=None, email=None, password=None):
        self.id = id
        self.username = username
        self.email = email
        self.password = self.hash_password(password) if password else None

    def hash_password(self, raw_password: str) -> str:
        hashed = bcrypt.hashpw(raw_password.encode('utf-8'), bcrypt.gensalt())
        return hashed.decode('utf-8')

    def check_password(self, raw_password: str) -> bool:
        return bcrypt.checkpw(raw_password.encode('utf-8'), self.password.encode('utf-8'))

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
        }

class UserSchema(Schema):
    id = fields.Str(dump_only=True)
    username = fields.Str(required=True, validate=validate.Length(min=3, max=30))
    email = fields.Email(required=True)
    password = fields.Str(required=True, load_only=True, validate=validate.Length(min=6))

    @validates("username")
    def validate_username(self, value, **kwargs):
        if " " in value:
            raise ValidationError("Il nome utente non può contenere spazi.")

    @post_load
    def make_user(self, data, **kwargs):
        return User(**data)