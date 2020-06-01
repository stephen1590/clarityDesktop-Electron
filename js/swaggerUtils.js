const swaggeruri = "https://clarityapi.concurcompleat.com/swagger";
const SwaggerClient = require("swagger-client");

function getKeyViaSwagger(un, pw, cu) {
    return new Promise(resolve => {
        setTimeout(() => {
            new SwaggerClient({
                    url: swaggeruri,
                    usePromise: true
                })
                .then(function(client) {
                    client.apis.default.login({
                            user: un,
                            pass: pw,
                            cust: cu
                        })
                        .then(function(login) {
                            resolve(login.body["Token"]);
                        })
                        .catch(function(error) {
                            console.log('Oops!  failed with message: ' + error.statusText);
                            resolve("Error");
                        });
                });
        }, 1000);
    });
}

function assignedTasksViaSwagger(un, token) {
    return new Promise(resolve => {
        setTimeout(() => {
            new SwaggerClient({
                    url: swaggeruri,
                    usePromise: true,
                    authorizations: {
                        clarity_auth: token
                    }
                })
                .then(function(client) {
                    client.apis.default.getTasks({
                            assignee: [
                                un
                            ],
                            status: [
                                "1",
                                "2",
                                "3",
                                "4",
                                "5",
                                "6"
                            ]
                        }, )
                        .then(function(tasks) {
                            resolve(tasks.body);
                        })
                        .catch(function(error) {
                            console.log('Oops!  failed with message: ' + error.statusText);
                            resolve("Error");
                        });
                });
        }, 1000);
    });
}

function ownedTasksViaSwagger(un, token) {
    return new Promise(resolve => {
        setTimeout(() => {
            new SwaggerClient({
                    url: swaggeruri,
                    usePromise: true,
                    authorizations: {
                        clarity_auth: token
                    }
                })
                .then(function(client) {
                    client.apis.default.getTasks({
                            owner: [
                                un
                            ],
                            status: [
                                "1",
                                "2",
                                "3",
                                "4",
                                "5",
                                "6"
                            ]
                        }, )
                        .then(function(tasks) {
                            resolve(tasks.body);
                        })
                        .catch(function(error) {
                            console.log('Oops!  failed with message: ' + error.statusText);
                            resolve("Error");
                        });
                });
        }, 1000);
    });
}