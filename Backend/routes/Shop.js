module.exports = function(app) {
    const Shop = require("../Controllers/Shop/Shop");
    const authMiddleware = require("../Controllers/User/authMiddleware");
    const collabMiddleware = require('../Controllers/Collaboration/collabMiddleware');

    app.get('/shop',
    //    authMiddleware.authenticateUser,
        Shop.searchItems //OK
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
        Shop.getCartFromProject //OK
    );

    app.post('/cart/:projectId',
        //authMiddleware.authenticateUser,
        // collabMiddleware.hasRightAdmin,
        Shop.addItemToCart //Ok
    );

    app.delete('/cart/:projectId',
        //authMiddleware.authenticateUser,
        // collabMiddleware.hasRightAdmin,
        Shop.removeItemFromCart
    );
}
