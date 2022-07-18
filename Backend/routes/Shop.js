module.exports = function(app) {
    const Shop = require("../Controllers/Shop/Shop");
    const authMiddleware = require("../Controllers/User/authMiddleware");

    app.get('/shop',
    //    authMiddleware.authenticateUser,
        // TODO j'arrive pas chopper les params dans l'url alaid (je les ai retiré de la route pour l'instant parce que c'était full bs)
        Shop.searchItems
    );
    app.post('/shop/items',
        //authMiddleware.authenticateUser,
        Shop.addItem    //OK
    );
    //app.get('/shop/items/:itemid',
    //    authMiddleware.authenticateUser,
    //    Shop.getItemById    //OK
    //);
    app.delete('/shop/items/:itemid',
        //authMiddleware.authenticateUser,
        Shop.removeMyItem   //OK
    );

    app.get('/shop/items/:itemid',
    //authMiddleware.authenticateUser,
    Shop.getItemById    //OK
);
}
