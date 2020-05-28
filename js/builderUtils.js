function buildTaskList(tasksJson, token, un) {

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
            addTab(taskuri, node.id, token);
        });
    });
    document.getElementById("allLink").addEventListener('click', function(event) {
        allTasks(un, token)
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

function addTab(uriparam, id, token) {
    var titleText = ""
    if (id == "") {
        titleText = "Task List";
    } else {
        uriparam = uriparam + id
        titleText = "CT#" + id;
    }
    var options = {
        title: titleText,
        src: uriparam,
        visible: true,
        active: true
    }
    if (tabGroup.tabs.length == 0) {
        var xtra = "APIToken: " + token
        options.webviewAttributes = {
            extraHeaders: xtra
        }
    }
    let tab = tabGroup.addTab(options);
}

function allTasks(username, token) {
    addTab("https://support.concurcompleat.com/tasklist?assignee=" + username.split("\\")[1] + "&status=1,2,3,4,5,6", "", token)
    addTab("https://support.concurcompleat.com/tasklist?owner=" + username.split("\\")[1] + "&status=1,2,3,4,5,6", "", token)
}