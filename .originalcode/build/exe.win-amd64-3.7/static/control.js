// functions to load information from urls
function xhrSuccess() { 
    this.callback.apply(this, this.arguments); 
}

function xhrError() { 
    console.error(this.statusText); 
}

// invokes callback function when it returns data
function http_get_body_async(url, callback)
{
    var xhr = new XMLHttpRequest();
    xhr.callback = callback;
    xhr.arguments = Array.prototype.slice.call(arguments, 2);
    xhr.onload = xhrSuccess;
    xhr.onerror = xhrError;
    xhr.open("GET", url, true);
    xhr.send(null);
}

function load_new_video(vid_container) {
    vid_container.src = this.responseText;
}

// need synchronous get for static text file, whose contents we need for later calls
function http_get_body(url)
{
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send(null);
    return xhr.responseText;
}

// add random choice function to arrays
Array.prototype.choice = function () {
    return this[Math.floor(Math.random() * this.length)];
}

//--------------------------------------------------

// keyboard controls
document.addEventListener("keydown", function(e) {
    if (!e.repeat) {
        if (search_state == "hidden") {
            if (!isNaN(e.key)) {
                key = parseInt(e.key);
                if (key <= rows * cols) {
                    http_get_body_async(make_search_link(search), load_new_video, vids[key - 1]);
                }
            } else if (e.key == "ArrowLeft") {
                fast_reverse();
                bc.postMessage("fast_reverse");
            } else if (e.key == "ArrowRight") {
                fast_forward();
                bc.postMessage("fast_forward");
            } else if (e.key == "ArrowDown") {
                bc.postMessage("beginning");
                beginning();
            } else if (e.key == "ArrowUp") {
                bc.postMessage("end");
                end();
            } else if (e.key.toLowerCase() == "r") {
                load_all_vid_containers(search);
                bc.postMessage("reload");
            } else if (e.key.toLowerCase() == "m") {
                bc.postMessage(["toggle_mute", localStorage.toggle_mute]);
                toggle_mute();
            } else if (e.key.toLowerCase() == "c") {
                bc.postMessage(["toggle_controls", localStorage.toggle_controls]);
                toggle_controls();
            } else if (e.key.toLowerCase() == "h") {
                bc.postMessage(["toggle_help", localStorage.toggle_help]);
                toggle_help();
            } else if (e.key.toLowerCase() == "p" || e.key == "Pause") {
                bc.postMessage(["toggle_pause", localStorage.toggle_pause]);
                toggle_pause();
            } else if (e.key == "Enter") {
                toggle_search();
            }
        } else if (e.key == "Enter") {
            toggle_search();
        }
    }
    if (search_state == "hidden") {
        if (e.key == "+") {
            value = parseFloat(document.getElementById("volume").value) + .05;
            document.getElementById("volume").value = value;
            change_volume(value);
            bc.postMessage(["change_volume", value]);
        } else if (e.key == "-") {
            value = parseFloat(document.getElementById("volume").value) - .05;
            document.getElementById("volume").value = value;
            change_volume(value);
            bc.postMessage(["change_volume", value]);
        }
    }
});

// broadcast channel, control all windows at once
var bc = new BroadcastChannel("cross_window_control");
bc.onmessage = function (ev) {
    if (ev.data == "reload") {
        load_all_vid_containers(search);
    } else if (ev.data == "fast_forward") {
        fast_forward();
    } else if (ev.data == "fast_reverse") {
        fast_reverse();
    } else if (ev.data == "pause") {
        pause();
    } else if (ev.data == "beginning") {
        beginning();
    } else if (ev.data == "end") {
        end();
    } else if (ev.data[0] == "toggle_pause") {
        toggle_pause(ev.data[1]);
    } else if (ev.data[0] == "toggle_mute") {
        toggle_mute(ev.data[1]);
    } else if (ev.data[0] == "toggle_controls") {
        toggle_controls(ev.data[1]);
    } else if (ev.data[0] == "toggle_help") {
        toggle_help(ev.data[1]);
    } else if (ev.data[0] == "change_volume") {
        document.getElementById("volume").value = ev.data[1];
        change_volume(ev.data[1]);
    }
}

// toggle controls logic
if (localStorage.toggle_controls === undefined) {
    localStorage.toggle_controls = "visible";
} else if (localStorage.toggle_controls == "hidden") {
    document.getElementById("controls").style.display = "none";
}
function toggle_controls(control_state) {
    if (control_state !== undefined) {
        localStorage.toggle_controls = control_state;
    }
    if (localStorage.toggle_controls == "hidden") {
        document.getElementById("controls").style.display = "table";
        localStorage.toggle_controls = "visible";
    } else {
        document.getElementById("controls").style.display = "none";
        localStorage.toggle_controls = "hidden";
    }
}

// toggle help logic
if (localStorage.toggle_help === undefined) {
    localStorage.toggle_help = "visible";
} else if (localStorage.toggle_help == "hidden") {
    document.getElementById("help").style.display = "none";
}
function toggle_help(help_state) {
    if (help_state !== undefined) {
        localStorage.toggle_help = help_state;
    }
    if (localStorage.toggle_help == "hidden") {
        document.getElementById("help").style.display = "block";
        localStorage.toggle_help = "visible";
    } else {
        document.getElementById("help").style.display = "none";
        localStorage.toggle_help = "hidden";
    }
}

// toggle search logic
search_state = "hidden";
function toggle_search() {
    if (search_state == "hidden") {
        document.getElementById("search_box").style.display = "block";
        search_state = "visible";
        document.getElementById("search_box").focus();
    } else {
        document.getElementById("search_box").style.display = "none";
        search_state = "hidden";
    }
}
document.getElementById("toggle_search").addEventListener("click", function() {
    toggle_search();
});

// toggle mute logic
localStorage.toggle_mute = "muted";
function toggle_mute(mute_state) {
    if (mute_state !== undefined) {
        localStorage.toggle_mute = mute_state;
    }
    if (localStorage.toggle_mute == "muted") {
        document.getElementById("toggle_mute").innerHTML = '<i class="fas fa-volume-up">';
        [].forEach.call(vids, function (vid) {
            vid.muted = false;
        })
        localStorage.toggle_mute = "unmuted";
    } else {
        document.getElementById("toggle_mute").innerHTML = '<i class="fas fa-volume-mute">';
        [].forEach.call(vids, function (vid) {
            vid.muted = true;
        })
        localStorage.toggle_mute = "muted";
    }
}
document.getElementById("toggle_mute").addEventListener("click", function() {
    bc.postMessage(["toggle_mute", localStorage.toggle_mute]);
    toggle_mute();
});

// toggle pause button logic
localStorage.toggle_pause = "playing";
function toggle_pause(pause_state) {
    if (pause_state !== undefined) {
        localStorage.toggle_pause = pause_state;
    }
    if (localStorage.toggle_pause == "playing") {
        document.getElementById("toggle_pause").innerHTML = '<i class="fas fa-play">';
        [].forEach.call(vids, function (vid) {
            vid.pause();
        })
        localStorage.toggle_pause = "paused";
    } else {
        document.getElementById("toggle_pause").innerHTML = '<i class="fas fa-pause">';
        [].forEach.call(vids, function (vid) {
            vid.play();
        })
        localStorage.toggle_pause = "playing";
    }
}
document.getElementById("toggle_pause").addEventListener("click", function() {
    bc.postMessage(["toggle_pause", localStorage.toggle_pause]);
    toggle_pause();
});

// fast reverse button logic
function fast_reverse() {
    [].forEach.call(vids, function (vid) {
        vid.currentTime -= 30;
    })
}
document.getElementById("fast_reverse").addEventListener("click", function() {
    fast_reverse();
    bc.postMessage("fast_reverse");
});

// fast forward button logic
function fast_forward() {
    [].forEach.call(vids, function (vid) {
        vid.currentTime += 30;
    })
}
document.getElementById("fast_forward").addEventListener("click", function() {
    fast_forward();
    bc.postMessage("fast_forward");
});

// reload button logic
function load_all_vid_containers(search) {
    [].forEach.call(vids, function (vid) {
        http_get_body_async(make_search_link(search), load_new_video, vid);
    })
}
document.getElementById("reload").addEventListener("click", function() {
    load_all_vid_containers(search);
    bc.postMessage("reload");
});

// beginning button logic
function beginning() {
    [].forEach.call(vids, function (vid) {
        vid.currentTime = 0;
    })
}
document.getElementById("beginning").addEventListener("click", function() {
    beginning();
    bc.postMessage("beginning");
});

// end button logic
function end() {
    [].forEach.call(vids, function (vid) {
        vid.currentTime = vid.duration - 10;
    })
}
document.getElementById("end").addEventListener("click", function() {
    end();
    bc.postMessage("end");
});

// search box logic
document.getElementById("search_box").addEventListener("input", function() {
    search = this.value;
    update_url(rows, cols, pages, length, hd, search);
});

// slider logic
function change_volume(volume) {
    [].forEach.call(vids, function (vid) {
        vid.volume = volume;
    })
}
document.getElementById("volume").addEventListener("input", function() {
    change_volume(this.value);
    bc.postMessage(["change_volume", this.value]);
});

//--------------------------------------------------

// construct search link based on search GET argument
function make_search_link(search) {
    if (search == "default") {
        return "/search/" + search_terms.choice() + "?pages=" + pages + "&length=" + length + "&hd=" + hd;
    } else {
        return "/search/" + search + "?pages=" + pages + "&length=" + length + "&hd=" + hd;
    }
}

// get static list of search terms - will expand later
search_terms = http_get_body("/static/pornstars.txt").split("\n");
var vids = document.getElementsByClassName("viddy");

// number button reload logic, must be after grabbing video elements
Array.prototype.forEach.call(vids, function (vid, index) {
    document.getElementById((index + 1).toString()).addEventListener("click", function() {
        http_get_body_async(make_search_link(search), load_new_video, vid);
    })
})

// add GET values to url if not present, so it is clear to the user what can be changed
var stateObj = {};
function update_url(rows, cols, pages, length, hd, search) {
    history.pushState(stateObj, "Porn Matrix",
    "?rows=" + rows + "&cols=" + cols + "&pages=" + pages + "&length=" + length + "&hd=" + hd + "&search=" + search);
}
update_url(rows, cols, pages, length, hd, search);

// handle touch devices
function toggleFullScreen() {
    var doc = window.document;
    var docEl = doc.documentElement;

    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

    if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        requestFullScreen.call(docEl);
    }
    else {
        cancelFullScreen.call(doc);
    }
}

function is_touch_device() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}

if (is_touch_device()) {
    document.getElementById("help").style.display = "none";
    var sheet = document.createElement("style");
    sheet.innerHTML = `
        button {font-size: 5vmin;min-width: 6vmin;}
        .fa-redo-alt {font-size: 4vmin;min-width: 5vmin;}
        #volume {width: 30vmin;height: 1vmin;top: 3.2vmin;left: 8vmin;}
        #volume::-webkit-slider-thumb {width: 4vmin;height: 4vmin;}
        #volume::-moz-range-thumb {width: 4vmin;height: 4vmin;}`;
    document.body.appendChild(sheet);
    var btn = document.createElement("button");
    btn.innerHTML = '<i class="fas fa-arrows-alt"></i>';
    main_buttons = document.getElementById("main_buttons");
    main_buttons.appendChild(btn);
    fullscreen = false;
    
    btn.addEventListener("click", function () {
        if (fullscreen) {
            fullscreen = false;
            btn.innerHTML = '<i class="fas fa-arrows-alt"></i>';
        } else {
            fullscreen = true;
            btn.innerHTML = '<i class="fas fa-compress-arrows-alt"></i>';
        }
        toggleFullScreen();
    });
}

// load videos on page load
load_all_vid_containers(search);