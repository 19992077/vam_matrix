# Porn_Matrix
This is a Python 3 server application for viewing porn streams in a grid on your browser. It loads videos based on provided search parameters. If no search terms are provided, it chooses from a list of my favorite porn stars. :)

[donate if you enjoy my work :)](https://paypal.me/deracoslon)

# Run / Build
Intall prereqs

> pip install -r requirements.txt

If you have issues installing cx_freeze on python 3.7, try this - thanks Slurgie from the bodybuilding.com forums

> pip install --upgrade git+https://github.com/anthony-tuininga/cx_Freeze.git@master

Run it, it will automatically open a browser window

> python porn_matrix.py

Change port

> python porn_matrix.py 8080

Build to build folder, run exe - works the same as above

> python setup.py build

Run exe from build folder and change port

> porn_matrix.exe 8080

In action:
https://i.imgur.com/n3HoJpk.png

# Hotkeys:
```
m = toggle mute
+/- = adjust volume 5%
h = toggle help
c = toggle controls
enter = toggle search
new vids will use it
F11 = fullscreen
left arrow = go back 30s
right arrow = go forward 30s
down arrow = move to beginning
up arrow = move to end
p or pause = toggle pause/play
r = reload all
1-9 = load new in square #
```

# Tips:
- Multiple monitor support,
control windows simultaneously
- Phone support, just go to the server url

# Tech details
It is a Flask python app with a vanilla JavaScript frontend. I am searching supported streaming sites with my own code. I then manipulate those queries into a list of video links and run one at random through youtube-dl to get a direct link to an mp4. I then send that to the client side, which loads that with an HTML5 Video container.

Currently you can also enter some information into the URL as GET parameters including the number of rows and columns, number of pages to search, as well as the minimum length of videos. I will integrate these parameters into the UI in the future.

It supports Pornhub and Spankbang at the moment, but it can support any site that youtube-dl has an extractor for. To add new sites would mean making a function that can search the site and narrow it down to a specific video to feed into youtube-dl on the python server.

Some features I have in mind:
- Interface for pasting a video url from Pornhub/Spankbang/whatever and loading it into any of the grid spots.
- Better interface overall, integrating other search features into the search dialogue.