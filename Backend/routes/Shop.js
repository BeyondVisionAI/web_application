module.exports = function(app) {
    const Shop = require("../Controllers/Shop/Shop");
    const authMiddleware = require("../Controllers/User/authMiddleware");

    // Adding Item in a shop

    app.post('/shop/add',
        authMiddleware.authenticateUser,
        Shop.addItem
        );
    
    // SHOP MAIN PAGE

    app.get('/shop',
        authMiddleware.authenticateUser,
        Shop.getItems
    );

    app.get('/shop/:name&:type&:minPrice&:maxPrice',
        authMiddleware.authenticateUser,
        Shop.searchItems
    );

    app.post('/shop/addToCart',
        authMiddleware.authenticateUser,
        Shop.addToCart
    );

    // ARTICLE PAGE

    app.get('/shop/:itemid',
        authMiddleware.authenticateUser,
        Shop.getItemById
    );

    // PROJET

    // SEE PROJECT.JS LINE 32
}