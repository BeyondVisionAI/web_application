const { Errors } = require("../../Models/Errors.js");
const { Cart } = require("../../Models/shop/Cart.js");
const { Item, ITEMTYPE } = require("../../Models/shop/Item")

/**
 * add an item in the Beyond Vision catalog
 * @param { Request } req { body: {name, owner, type, genre, price, language} }
 * @param { Response } res
 * @returns { response to send }
 */
exports.addItem = async function(req, res) {
    try {
        // TODO: OWNER ?????? USELESS
        // TODO: Vérifier que l'item existe pas déjà pour le même utilisateur
        
        if (!req.body || (!req.body.name || !req.body.owner || !req.body.type ||
            !req.body.genre || !req.body.price || !req.body.language)) {
            return (res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS));
            }
        
        const language = [];

        if (req.body.language.FRENCH)
            language.push('FRENCH')
        if (req.body.language.ENGLISH)
            language.push('ENGLISH')
        if (req.body.language.SPANISH)
            language.push('SPANISH')
        if (req.body.language.GERMAN)
            language.push('GERMAN')
        
        const newItem = new Item({
            name: req.body.name,
            owner: req.body.owner,
            type: req.body.type,
            genre: req.body.genre,
            price: req.body.price,
            language: language
        })
        await newItem.save();

        res.status(200).send(newItem);
    } catch (err) {
        console.log("Shop->addItem: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

/**
 * remove an item in the Beyond Vision catalog
 * @param { Request } req { params: itemid }
 * @param { Response } res
 * @returns { response to send }
 */
exports.removeMyItem = async function(req, res) {
    try {
        // TODO: Faut vérifier que l'item appartient bien à l'utilisateur
        if (!req.params.itemId)
            return (res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS));
        
        await Item.deleteOne({ _id: req.params.itemId });

        return res.status(204).send("Item deleted");
    } catch (err) {
        console.log("Shop->removeMyItem: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

/**
 * get an article by id
 * @param { Request } req { params: itemId }
 * @param { Response } res
 * @returns { response to send }
 */
exports.getItemById = async function(req, res) {
    try {
        if ((!req.params.itemId))
            return (res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS));

        var item = await Item.findById(req.params.itemId)

        if (!item)
            return (res.status(404).send(Errors.ARTICLE_NOT_FOUND));

        return res.status(200).send(item);
    } catch (err) {
        console.log("Shop->getItemById: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

/**
 * research items in the Beyond Vision catalog
 * @param { Request } req { query: name, type, minPrice, maxPrice, itemsPerPage, pageNb }
 * @param { Response } res
 * @returns { response to send }
 */
exports.searchItems = async function(req, res) {
    try {
        if ((!req.body.itemsPerPage || !req.body.pageNb) && (req.body.itemsPerPage <= 0 || req.body.pageNb <= 0))
            return (res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS));
        
        var research = {}
        var price = {}
        var out = []
        var check_price = false
        var start = ((req.body.itemsPerPage * req.body.pageNb) - req.body.itemsPerPage)

        if (req.query.name) {
            research.name = { "$regex": req.query.name, "$options": "i"}
        }
        if (req.query.type) {
            research.type = req.query.type
        }
        if (req.query.minPrice) {
            price.$gte = req.query.minPrice
            check_price = true
        }
        if (req.query.maxPrice) {
            price.$lte = req.query.maxPrice
            check_price = true
        }
        if (check_price) {
            research.price = price
        }

        const items = await Item.find(research);

        for (var i = start; (i < items.length) && (out.length < req.body.itemsPerPage); i++) {
            out.push(items[i])
        }

        return (res.status(200).send(out));
    } catch (err) {
        console.log("Shop->searchItems: " + err);
        return (res.status(400).send(Errors.BAD_REQUEST_BAD_INFOS));
    }
}

/**
 * Get project cart
 * @param { Request } req { params: projectId }
 * @param { Response } res
 * @returns { response to send }
 */
 exports.getCartFromProject = async function(req, res) {
    try {
        if (!req.params.projectId)
            return (res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS));
        var items = await Cart.find({ projectId: req.params.projectId });
        return (res.status(200).send(items));
    } catch (err) {
        console.log("Shop->getCartFromProject: " + err);
        return (res.status(400).send(Errors.BAD_REQUEST_BAD_INFOS));
    }
}

/**
 * add item to project's cart
 * @param { Request } req { params: projectId; body: itemId, quantity }
 * @param { Response } res
 * @returns { response to send }
 */
 exports.addItemToCart = async function(req, res) {
    try {
        if (!req.params.projectId || !req.body.itemId)
            return (res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS));

        var item = await Item.findOne({_id: req.body.itemId});
        if (!item) {
            return (res.status(404).send(Errors.ARTICLE_NOT_FOUND));
        }

        if (item.type == ITEMTYPE[1]) {
            var itemInCart = await Cart.findOneAndUpdate({projectId: req.params.projectId, type: ITEMTYPE[1]}, {itemId: req.body.itemId, bought: false, quantity: 0}, {new: true});
            if (itemInCart)
                return (res.status(200).send(itemInCart));
        }

            var itemInCart = new Cart({
                projectId: req.params.projectId,
                itemId: req.body.itemId,
                bought: false,
                quantity: 0,
                type: item.type
            });
            await itemInCart.save();

        return (res.status(200).send(itemInCart));
    } catch (err) {
        console.log("Shop->addItemToCart: " + err);
        return (res.status(400).send(Errors.BAD_REQUEST_BAD_INFOS));
    }
}

/**
 * remove project's cart
 * @param { Request } req { params: projectId; body: itemId }
 * @param { Response } res
 * @returns { response to send }
 */
 exports.removeItemFromCart = async function(req, res) {
    try {
        if (!req.params.projectId || !req.body.itemId)
            return (res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS));

        var item = await Cart.findOne({projectId: req.params.projectId, itemId: req.body.itemId});
        if (!item) {
            return (res.status(404).send(Errors.CART_NOT_FOUND));
        }

        await Cart.deleteOne({_id: item.id});

        return (res.status(200).send("Deleted"));
    } catch (err) {
        console.log("Shop->removeItemFromCart: " + err);
        return (res.status(400).send(Errors.BAD_REQUEST_BAD_INFOS));
    }
}