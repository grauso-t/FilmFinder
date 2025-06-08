# models/movie.py
from marshmallow import Schema, fields, validate, post_load
from datetime import datetime
from typing import Optional, List, Dict, Any

class Movie:
    def __init__(self, id=None, title=None, type=None, description=None, 
                 release_year=None, age_certification=None, runtime=None, 
                 genres=None, production_countries=None, seasons=None, 
                 imdb_id=None, imdb_score=None, imdb_votes=None, 
                 tmdb_popularity=None, tmdb_score=None, cover_url=None):
        self.id = id
        self.title = title
        self.type = type
        self.description = description
        self.release_year = release_year
        self.age_certification = age_certification
        self.runtime = runtime
        self.genres = genres or []
        self.production_countries = production_countries or []
        self.seasons = seasons
        self.imdb_id = imdb_id
        self.imdb_score = imdb_score
        self.imdb_votes = imdb_votes
        self.tmdb_popularity = tmdb_popularity
        self.tmdb_score = tmdb_score
        self.cover_url = cover_url
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'type': self.type,
            'description': self.description,
            'release_year': self.release_year,
            'age_certification': self.age_certification,
            'runtime': self.runtime,
            'genres': self.genres,
            'production_countries': self.production_countries,
            'seasons': self.seasons,
            'imdb_id': self.imdb_id,
            'imdb_score': self.imdb_score,
            'imdb_votes': self.imdb_votes,
            'tmdb_popularity': self.tmdb_popularity,
            'tmdb_score': self.tmdb_score,
            'cover_url': self.cover_url,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

class MovieSchema(Schema):
    id = fields.Str(dump_only=True)
    title = fields.Str(required=True, validate=validate.Length(min=1, max=200))
    type = fields.Str(required=True, validate=validate.OneOf(['movie', 'show']))
    description = fields.Str(validate=validate.Length(max=1000))
    release_year = fields.Int(validate=validate.Range(min=1800, max=2030))
    age_certification = fields.Str(validate=validate.Length(max=10))
    runtime = fields.Int(validate=validate.Range(min=1))
    genres = fields.List(fields.Str(), load_default=[])
    production_countries = fields.List(fields.Str(), load_default=[])
    seasons = fields.Int(validate=validate.Range(min=1), allow_none=True)
    imdb_id = fields.Str(validate=validate.Length(max=20))
    imdb_score = fields.Float(validate=validate.Range(min=0, max=10))
    imdb_votes = fields.Int(validate=validate.Range(min=0))
    tmdb_popularity = fields.Float(validate=validate.Range(min=0))
    tmdb_score = fields.Float(validate=validate.Range(min=0, max=10))
    cover_url = fields.Url()
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    
    @post_load
    def make_movie(self, data, **kwargs):
        return Movie(**data)