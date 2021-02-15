from flask import Flask, request
from flask_cors import CORS
from youtube_search import YoutubeSearch
import json

app = Flask(__name__)
CORS(app)

@app.route("/search/youtube", methods=["GET"])
def get_youtube_search():
    search_term = request.args.get("search_term")

    results = YoutubeSearch(search_term).to_json()
    data = json.loads(results)

    return data

app.run()