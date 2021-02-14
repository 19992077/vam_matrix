from os import path
from flask import (Flask, send_from_directory,
                  render_template, request)
from search_to_url import search_to_vid_url

app = Flask(__name__)
app.jinja_env.trim_blocks = True
app.jinja_env.lstrip_blocks = True

@app.route("/")
def main_page():
    cols = int(request.args.get("cols", default=3))
    rows = int(request.args.get("rows", default=3))
    pages = int(request.args.get("pages", default=1))
    length = int(request.args.get("length", default=0))
    hd = int(request.args.get("hd", default=1))
    search = request.args.get("search", default="default")
    return render_template("vid_grid.html",
            cols=cols, rows=rows, pages=pages, length=length, hd=hd, search=search)

@app.route("/favicon.ico")
def favicon():
    return send_from_directory(path.join(app.root_path, "static"),
                               "favicon.ico", mimetype="image/vnd.microsoft.icon")

@app.route("/search/<query>")
def direct_vid_link(query):
    pages = int(request.args.get("pages", default=1))
    length = int(request.args.get("length", default=10))
    hd = int(request.args.get("hd", default=0))
    direct_link = search_to_vid_url(query, pages=pages, length=length, hd=hd)
    print(direct_link)
    return direct_link

if __name__ == "__main__":
    import sys
    import waitress
    import webbrowser
    print("Porn Matrix.exe 8080 to run on port 8080, etc.")
    PORT = sys.argv[1] if len(sys.argv) > 1 else '69'
    webbrowser.open('http://127.0.0.1:' + PORT)
    waitress.serve(app, port=PORT)