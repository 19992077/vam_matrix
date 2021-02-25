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

def get_youtube_search(search_term: str):
    results = YoutubeSearch(search_term).to_json()
    data = json.loads(results)

    return data

# add a way to exclude tags
def get_pornhub_search(search_term: str):
    pornhub_api = PornhubApi()
    results = pornhub_api.search.search(search_term)
    data = json.loads(results.json())

    return data

# add a way to get video time
# add a way to auto get more pages
def get_spankbang_search(search_term: str):
    search = 'https://spankbang.com/s/' + search_term
    raw_html = simple_get(search)
    html = BeautifulSoup(raw_html, 'html.parser')

    narrowed_html = html.find(class_='results_search')
    narrowed_html = narrowed_html.find_all(class_='video-item')
    for i, n_html in enumerate(narrowed_html):
        narrowed_html[i] = 'https://www.spankbang.com' + n_html.a["href"]
    results_str = json.dumps(narrowed_html)
    results_list = json.loads(results_str)

    return results_list

@app.route("/search", methods=["GET"])
def search():
    search_term = request.args.get("search_term")
    exclude = request.args.get("exclude")

    results = {
        "youtube": get_youtube_search(search_term),
        "pornhub": get_pornhub_search(search_term),
        "spankbang": get_spankbang_search(search_term)
    }

    if exclude:
        excludeList = list(exclude.split(","))
        for platform in excludeList:
            if platform in excludeList:
                results.pop(platform)
        return json.dumps(results)
    else:
        results_json = json.dumps(results, indent=2)
        return results_json
    
app.run()