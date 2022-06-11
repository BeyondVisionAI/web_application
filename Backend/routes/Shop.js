module.exports = function(app) {
    const Shop = require("../Controllers/Shop/Shop");
    const authMiddleware = require("../Controllers/User/authMiddleware");
    const collabMiddleware = require('../Controllers/Collaboration/collabMiddleware');

    app.get('/shop',
        authMiddleware.authenticateUser,
        Shop.searchItems
    );
    app.post('/shop/:projectId/cart',
        authMiddleware.authenticateUser,
        collabMiddleware.isCollab,
        Shop.addToCart
    );
    app.delete('/shop/:projectId/cart/:itemId',
        authMiddleware.authenticateUser,
        collabMiddleware.isCollab,
        Shop.removeFromCart
    );
    app.post('/shop/items',
        authMiddleware.authenticateUser,
        Shop.addItem    //OK
    );
    app.get('/shop/items/:itemid',
        authMiddleware.authenticateUser,
        Shop.getItemById    //OK
    );
    app.delete('/shop/items/:itemid',
        authMiddleware.authenticateUser,
        Shop.removeMyItem   //OK
    );
}