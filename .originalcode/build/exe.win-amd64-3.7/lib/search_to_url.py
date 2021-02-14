from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
from random import randint, choice
import youtube_dl

#--------------------------------------------------

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

def log_error(e):
    print(e)

#--------------------------------------------------

def search_to_vid_url(search, pages=None, length=None, hd=None):
    path = randint(1,2)
    if path == 1:
        return spankbang_url(search, pages, length, hd)
    if path == 2:
        return pornhub_url(search, pages, length, hd)

def spankbang_url(search, pages=None, length=None, hd=None):
    if pages:
        page = '/' + str(randint(1,pages))
    else:
        page = ''
    if length:
        length = 'min_length=' + str(length)
    else:
        length = ''
    if hd:
        hd = '720p=1'
    else:
        hd = ''

    search = 'https://spankbang.com/s/' + search + page + '?' + length + '&' + hd
    print(search)
    raw_html = simple_get(search)
    html = BeautifulSoup(raw_html, 'html.parser')

    # extract video pages from search page
    narrowed_html = html.find(class_='results_search')
    narrowed_html = narrowed_html.find_all(class_='video-item')
    for i, n_html in enumerate(narrowed_html):
        narrowed_html[i] = 'https://www.spankbang.com' + n_html.a["href"]

    # get direct link for one of the video pages
    info_dict = ydl.extract_info(choice(narrowed_html), download=False)
    url = info_dict.get("url", None)

    return url

def pornhub_url(search, pages=None, length=None, hd=None):
    if pages:
        page = 'page=' + str(randint(1,pages))
    else:
        page = ''
    if length:
        length = 'min_duration=' + str(int(length/10)*10)
    else:
        length = ''
    if hd:
        hd = 'hd=1'
    else:
        hd = ''

    search = 'https://www.pornhub.com/video/search?search=' + search.lower() + '&' + page + '&' + length + '&' + hd
    print(search)
    raw_html = simple_get(search)
    html = BeautifulSoup(raw_html, 'html.parser')

    with open(r'.\out.txt', 'w', encoding='utf8') as f:
        f.write(html.prettify())

    # extract video pages from search page
    narrowed_html = html.find(id='videoSearchResult')
    narrowed_html = narrowed_html.find_all(class_='videoPreviewBg')
    for i, n_html in enumerate(narrowed_html):
        narrowed_html[i] = 'https://www.pornhub.com' + n_html.a["href"]

    # get direct link for one of the video pages
    info_dict = ydl.extract_info(choice(narrowed_html), download=False)
    url = info_dict.get("url", None)

    return url

ydl_opts = {'format':'bestvideo[ext=mp4]+bestaudio[ext=m4a]/mp4,'quiet':True,'no_warnings':True,'noplaylist':True,'playlist_items':1}
ydl = youtube_dl.YoutubeDL(ydl_opts)

if __name__ == "__main__":
    '''
    import time
    start = time.time()
    print(pornhub_url("gina valentina", pages=3, length=10))
    print('It took {0:0.2f} seconds'.format(time.time() - start))

    start = time.time()
    print(spankbang_url("gina valentina", pages=3, length=10))
    print('It took {0:0.2f} seconds'.format(time.time() - start))
    '''

    ''' for testing
    with open(r'D:\Anaconda\flask_server_app\out.txt', 'w', encoding='utf8') as f:
        f.write(html.prettify())
    '''