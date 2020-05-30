async function setupLayout(key, username) {
    var keyHeader = ""
    var response = "";
    var taskData = {
        "Assigned": "",
        "Owned": ""
    }
    if (username.toLowerCase().includes("gdsxprod") && password != "") {
        document.getElementById("loading").style = 'margin: auto; padding-top: 150px;';
        if (key != "") {
            keyHeader = "Bearer " + key;
            console.log("Using API key: " + keyHeader)
            response = await assignedTasksViaSwagger(username.split("\\")[1], keyHeader)
            if (response != "Error" && response != "") {
                taskData.Assigned = response;
                response = await ownedTasksViaSwagger(username.split("\\")[1], keyHeader)
                if (response != "Error" && response != "") {
                    taskData.Owned = response;
                    newTask(keyHeader)

                    buildTaskList(taskData, keyHeader, username);

                    document.getElementById("loading").style = 'display:none;';
                    document.getElementById("menu").style = 'height:100%;width:20%;float:left; vertical-align: top; height: 100%;';
                    document.getElementById("tabs").style = 'width: 80%;height: 100%; float:right;';
                } else {
                    error("Error getting task Data. Refresh.");
                    return "Error getting task Data. Refresh.";
                }
            } else {
                error("Error getting task Data. Refresh.");
                return "Error getting task Data. Refresh.";
            }
        }
    } else {
        error("Format GDSXProd username.")
        return "Format GDSXProd username.";
    }
    return "done";
}

function error(error) {
    document.getElementById("form").style = 'display:block;';
    document.getElementById("loading").style = 'display:none;';
    document.getElementById("error").innerHTML = "<p style='color:red;'>" + error + "</p>"
    document.getElementById("error").style = "display:block; width: 275px; vertical-align: middle; display:table; padding:10px;"
}

function buildTaskList(tasksJson, token, un) {
    const taskuri = "https://support.concurcompleat.com/task/"
    var htmlItems = "";
    var keys = Object.keys(tasksJson)
    keys.forEach(type => {
        htmlItems = htmlItems + "<div id='" + type + "'><div class='taskHeader'><h3 style='text-align:left;'> " + type + " </h3></div>";
        tasksJson[type].forEach(element => {
            var current = "<div class='task' id='" + element["id"] + "'>";
            //console.log(element);
            current = current + "<span style='white-space: nowrap;'><h3 style='display:inline-block;'>CT#" + element["id"] + "</h3>";
            current = current + " - " + element["title"] + "</span></div>";
            htmlItems = htmlItems + current;
        });
        htmlItems = htmlItems + "</div>";
    });
    document.getElementById("contents").innerHTML = htmlItems;
    //Now Assign our Events!
    (document.querySelectorAll(".task")).forEach(function(node) {
        node.addEventListener('click', function(event) {
            addNewTab(taskuri, node.id, token);
        });
    });
    document.getElementById("allLink").addEventListener('click', function(event) {
        newTask(token)
    });
    document.getElementById("refresh").addEventListener('click', async function(event) {
        var temp = await assignedTasksViaSwagger(un.split("\\")[1], token)
        var temp2 = await ownedTasksViaSwagger(un.split("\\")[1], token)
        tasksJson = {
            "Assigned": temp,
            "Owned": temp2
        }
        buildTaskList(tasksJson, token, un)
    });
}

function addNewTab(uriparam, id, token) {
    var titleText = ""
    if (id == "") {
        titleText = "New Task";
    } else {
        uriparam = uriparam + id
        titleText = "CT#" + id;
    }
    var options = {
            title: titleText,
            src: uriparam,
            visible: true,
            active: true,
            nodeintegration: true
        }
        //if (clarityTabs.tabs.length == 0) {
    var xtra = "authorization: " + token
    options.webviewAttributes = {
            extraHeaders: xtra
        }
        //}
    let tab = clarityTabs.addTab(options);
    //console.log(tab);
}

function newTask(token) {
    addNewTab("https://support.concurcompleat.com/task/", "", token)
        //addNewTab("https://google.com", "", token)
}