module.exports = function(app) {
    const Task = require("../Controllers/Task/");

    /*app.get('/tasks',
        Shop.searchItems
    );*/
    app.post('/tasks/add',
        Task.addTask
    );
    /*
    app.put('/tasks/status/employee',
        Task.setStatusEmployee
    );
    app.put('/tasks/status/client',
        Task.setStatusClient
    ); */
}
