from flask import Flask, request
from flask_cors import CORS

from youtube_search import YoutubeSearch
from pornhub_api import PornhubApi

import json

app = Flask(__name__)
CORS(app)

@app.route("/search/youtube", methods=["GET"])
def get_youtube_search():
    search_term = request.args.get("search_term")

    results = YoutubeSearch(search_term).to_json()
    data = json.loads(results)

    return data

@app.route("/search/pornhub", methods=["GET"])
def get_pornhub_search():
    search_term = request.args.get("search_term")
    
    pornhub_api = PornhubApi()
    results = pornhub_api.search.search(search_term)
    data = json.loads(results.json())

    return data

app.run()