const { Project } = require("../../Models/Project");
const { Errors } = require("../../Models/Errors.js");
const { Item } = require("../../Models/shop/Item")

/**
 * add an item in the Beyond Vision catalog
 * @param { Request } req { body: {name, owner, type, sexe, price, language} }
 * @param { Response } res
 * @returns { response to send }
 */
exports.addItem = async function(req, res) {
    try {
        if (!req.body || (!req.body.name || !req.body.owner || !req.body.type ||
            !req.body.sexe || !req.body.price || !req.body.language))
            return (res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS));
        
        const newItem = new Item({
            name: req.body.name,
            owner: req.body.owner,
            type: req.body.type,
            sexe: req.body.sexe,
            price: req.body.price,
            language: req.body.language
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
        
        await Item.deleteOne({ _id: req.params.itemid });

        return res.status(204).send("");
    } catch (err) {
        console.log("Shop->removeMyItem: " + err);
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
        //if (!req.params.name || !req.params.type || !req.params.minPrice || !req.params.maxPrice || (req.params.minPrice < 0 || req.params.maxPrice < req.params.minPrice) || (req.body.itemsPerPage <= 0 || req.body.pageNb < 0))
            //return (res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS));
        // TODO Mongo request from params
        var research = {}

        if (req.params.name)
            research.name = req.params.name     //TODO aprox research : exemple /John/i
        if (req.params.type)
            research.type = req.params.type
        const items = await Item.find(research);

        return (res.status(200).send(items));
    } catch (err) {
        console.log("Shop->searchItems: " + err);
        return (res.status(400).send(Errors.BAD_REQUEST_BAD_INFOS));
    }
}

/**
 * add an article to the project cart
 * @param { Request } req { body: projectId, articleId }
 * @param { Response } res
 * @returns { response to send }
 */
exports.addToCart = async function(req, res) {
    try {
        if ((!req.body.projectId || !req.body.articleID))
            return (res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS));

        var project = await Project.findById(req.params.projectId);
        // var article = await TODO: Shop.findById(req.params.articleId)

        if (!project)
            return (res.status(400).send(Errors.PROJECT_NOT_FOUND));

        // if (!article)
        // return (res.status(400).send(Errors.ARTICLE_NOT_FOUND));

        return (res.status(200).send("Items have been successfully retrieved"));
    } catch (err) {
        console.log("Shop->addToCart: " + err);
        return (res.status(400).send(Errors.BAD_REQUEST_BAD_INFOS));
    }
}

/**
 * remove an article to the project cart
 * @param { Request } req { body: projectId, articleId }
 * @param { Response } res
 * @returns { response to send }
 */
exports.removeFromCart = async function(req, res) {
    try {
        if ((!req.body.projectId || !req.body.articleID))
            return (res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS));

        var project = await Project.findById(req.params.projectId);
        // var article = await TODO: Shop.findById(req.params.articleId)

        if (!project)
            return (res.status(400).send(Errors.PROJECT_NOT_FOUND));

        // if (!article)
        // return (res.status(400).send(Errors.ARTICLE_NOT_FOUND));

        return (res.status(200).send("Items have been successfully removed"));
    } catch (err) {
        console.log("Shop->removeFromCart: " + err);
        return (res.status(400).send(Errors.BAD_REQUEST_BAD_INFOS));
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

        return res.status(200).send(project);
    } catch (err) {
        console.log("Shop->getItemById: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}