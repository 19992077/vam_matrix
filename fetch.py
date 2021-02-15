from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from youtube_search import YoutubeSearch

search_urls = {
    "youtube": "https://www.youtube.com/results?search_query="
}

def space_to_plus(string: str):
    return string.replace(" ", "+")

def simple_get(url: str):
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
                
    except RequestException as e:
        log_error('Error during requests to {0} : {1}'.format(url, str(e)))
        return None

def get_youtube_results(search_term: str, max_results: int):
    base_url = "https://youtube.com"
    results = YoutubeSearch(search_term, max_results=max_results).to_json()

    print(results)

get_youtube_results("nintendo", 2)