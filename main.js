 
var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
var mobile = false




if (windowHeight > windowWidth) {
  var elem = document.createElement("link");
  elem.setAttribute("rel", "stylesheet");
  elem.setAttribute("href", "mobile.css");
  document.head.appendChild(elem);
  mobile = true;
}

function close_page() {
  if (confirm("Close window?")) {
    window.close()
  } else {
    // NOPE!!!
  }
}

var tables = document.querySelectorAll("table.detailed");
for (t in tables) {
  try {
    tables[t].addEventListener("keydown", (event) => {
      if (event.which == 13) {    // ENTER!!
        const dblclickEvent = new MouseEvent('dblclick', {
          'view': window,
          'bubbles': true,
          'cancelable': true
        });
        event.target.dispatchEvent(dblclickEvent);
      }
    });
  } catch (err) {
    console.log("OOPS!!!", err);
  }
}

function get_post_num(id) {
  var out = false
  for (i in post_db) {
    if (post_db[i]["id"] == id) {
      out = i
    }
  }
  return out
}

function display_post(id) {
  console.log(`dISPLAY POST: ${id}`);

  post_info(id);
   
  document.querySelector(".post-iframe").src = `posts/${id}.html`;

  
  document.querySelector(".post-view").style.display = "block";
  document.querySelector(".back-button").style.display = "block";
  document.querySelector(".list-view").style.display = "none";
  document.querySelector(".back-button-spacing").style.display = "none";

  var url = `${window.location.pathname}?post=${id}`;

  history.pushState({}, null, url);
}

function post_info(id) {
  console.log("POST INFO", id)
  var post_num = get_post_num(id);
  if (post_num !== false) {
    document.querySelector(".info-name").innerHTML = `${post_db[post_num]["title"]}`;
    document.querySelector(".info-date").innerHTML = `${post_db[post_num]["date"]}`;
    document.querySelector(".info-desc").innerHTML = `${post_db[post_num]["desc"]}`;
    document.querySelector(".info-img").src = `img/${post_db[post_num]["img"]}`;
  }
}


function build_post_list() {
  console.log("polist")

  document.querySelector(".post-list tbody").innerHTML = "";

  document.querySelector(".post-view").style.display = "none";
  document.querySelector(".back-button").style.display = "none";
  document.querySelector(".list-view").style.display = "block";
  document.querySelector(".back-button-spacing").style.display = "block";

  var url = `${window.location.pathname}`;
  history.pushState({}, null, url);

  for (i in post_db) {
    var post_id = post_db[i]["id"];
    var elem = document.querySelector(".post-entry.template").cloneNode(true);
    elem.classList.remove("template");
    elem.querySelector(".post-title").innerHTML = `${post_db[i]["title"]}`;
    elem.querySelector(".post-date").innerHTML = `${post_db[i]["date"]}`;
    elem.querySelector(".post-icon").src = `styles/win9x/icons/${post_db[i]["icon"]}`;
    elem.setAttribute("tabindex", "-1");
    elem.setAttribute("aria-selected", "false");
    elem.setAttribute("post-id", `${post_id}`);

    elem.setAttribute("ondblclick", `display_post("${post_id}")`);
    // elem.addEventListener("dblclick", (event) => {
    //   var post_id = event.target.getAttribute("post-id");
    //   display_post(post_id);
    // });

    
    if (mobile == true) {
      elem.setAttribute("onclick", `display_post("${post_id}")`);
    } else {
      elem.setAttribute("onclick", `post_info("${post_id}")`);
    }
    
    // elem.addEventListener("click", (event) => {
    //   var post_id = event.target.getAttribute("post-id");
    //   if (mobile == true) {
    //     display_post(post_id);
    //   } else {
    //     post_info(post_id);
    //   }
      
    // });
    
    elem.addEventListener("keyup", (event) => {
      if (event.which == 38 || event.which == 40) {
        var post_id = event.target.getAttribute("post-id");
        post_info(post_id);
      }
    });

    document.querySelector(".post-list tbody").appendChild(elem);
  }
  try {
    module.initlist(); 
  } catch {

  }
  
}


const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const url_post = urlParams.get('post');

console.log("url post", url_post);

if (url_post != null) {
  var post_id_check = get_post_num(url_post);
  if (post_id_check !== false) {
    display_post(url_post);
  } else {
    build_post_list();
  }
} else {
  build_post_list();
}