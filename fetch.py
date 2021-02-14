from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

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

def get_youtube(search_term: str):
    search_url = search_urls["youtube"] + space_to_plus(search_term)

    raw_html = simple_get(search)
    html = BeautifulSoup(raw_html, "html.parser")