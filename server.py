from requests.exceptions import RequestException
from requests import get
from contextlib import closing
from flask import Flask, request
from flask_cors import CORS
from bs4 import BeautifulSoup

from youtube_search import YoutubeSearch
from pornhub_api import PornhubApi

from random import randint, choice
import json

def simple_get(url):
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
                
    except RequestException as e:
        log_error('Error during requests to {0} : {1}'.format(url, str(e)))
        return None

def is_good_response(resp):
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200 
            and content_type is not None 
            and content_type.find('html') > -1)

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

@app.route("/search/spankbang", methods=["GET"])
def get_spankbang_search():
    search_term = request.args.get("search_term")
    pages = int(request.args.get("page"))

    if pages:
        page = '/' + str(randint(1, pages))
    else:
        page = ''

    search = 'https://spankbang.com/s/' + search_term + page
    raw_html = simple_get(search)
    html = BeautifulSoup(raw_html, 'html.parser')

    narrowed_html = html.find(class_='results_search')
    narrowed_html = narrowed_html.find_all(class_='video-item')
    for i, n_html in enumerate(narrowed_html):
        narrowed_html[i] = 'https://www.spankbang.com' + n_html.a["href"]
    results = json.dumps(narrowed_html)
    
    return results

app.run()