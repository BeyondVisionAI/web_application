module.exports = function(app) {
    const Shop = require("../Controllers/Shop/Shop");
    const authMiddleware = require("../Controllers/User/authMiddleware");
    const collabMiddleware = require('../Controllers/Collaboration/collabMiddleware');

    app.get('/shop',
    //    authMiddleware.authenticateUser,
        // TODO j'arrive pas chopper les params dans l'url alaid (je les ai retiré de la route pour l'instant parce que c'était full bs)
        Shop.searchItems
    );
    app.post('/shop/items',
        //authMiddleware.authenticateUser,
        Shop.addItem    //OK
    );
    app.delete('/shop/items/:itemId',
        //authMiddleware.authenticateUser,
        Shop.removeMyItem   //OK
    );

    app.get('/shop/items/:itemId',
        //authMiddleware.authenticateUser,
        Shop.getItemById    //OK
    );

    app.get('/cart/:projectId',
        //authMiddleware.authenticateUser,
        // collabMiddleware.hasRightAdmin,
        Shop.getCartFromProject
    );

    app.post('/cart/:projectId',
        //authMiddleware.authenticateUser,
        // collabMiddleware.hasRightAdmin,
        Shop.addItemToCart
    );

    app.delete('/cart/:projectId',
        //authMiddleware.authenticateUser,
        // collabMiddleware.hasRightAdmin,
        Shop.removeItemFromCart
    );
}
