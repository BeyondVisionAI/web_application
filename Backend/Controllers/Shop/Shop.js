const { Errors } = require("../../Models/Errors.js");
const { Item } = require("../../Models/shop/Item")

/**
 * add an item in the Beyond Vision catalog
 * @param { Request } req { body: {name, owner, type, genre, price, language} }
 * @param { Response } res
 * @returns { response to send }
 */
exports.addItem = async function(req, res) {
    try {
        if (!req.body || (!req.body.name || !req.body.owner || !req.body.type ||
            !req.body.genre || !req.body.price || !req.body.language))
            return (res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS));
        
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

        res.status("200").send(newItem);
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
        if ((!req.params.itemid))
            return (res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS));
        
        console.log("value = " + req.params.itemid)
        await Item.deleteOne({ _id: req.params.itemid });

        return res.status(204).send("");
    } catch (err) {
        console.log("Shop->removeMyItem: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

/**
 * get an article by id
 * @param { Request } req { params: itemid }
 * @param { Response } res
 * @returns { response to send }
 */
exports.getItemById = async function(req, res) {
    try {
        if ((!req.params.itemid))
            return (res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS));

        var item = await Item.findById(req.params.itemid)

        if (!item)
            return (res.status(400).send(Errors.ARTICLE_NOT_FOUND));

        return res.status(200).send(item);
    } catch (err) {
        console.log("Shop->getItemById: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

/**
 * research items in the Beyond Vision catalog
 * @param { Request } req { params: name, type, minPrice, maxPrice, itemsPerPage, pageNb }
 * @param { Response } res
 * @returns { response to send }
 */
exports.searchItems = async function(req, res) {
    try {
        console.log("GO");
        console.log(req.params)
        //if (!req.params.name || !req.params.type || !req.params.minPrice || !req.params.maxPrice || (req.params.minPrice < 0 || req.params.maxPrice < req.params.minPrice) || (req.body.itemsPerPage <= 0 || req.body.pageNb < 0))
            //return (res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS));
        // TODO Mongo request from params
        var research = {}

        if (req.params.name) {
            console.log("pass");
            research.name = { "$regex": req.params.name, "$options": "i"}
        }

        const items = await Item.find(research);

        return (res.status(200).send(items));
    } catch (err) {
        console.log("Shop->searchItems: " + err);
        return (res.status(400).send(Errors.BAD_REQUEST_BAD_INFOS));
    }
}