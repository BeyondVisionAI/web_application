const { Project } = require("../../Models/Project");
const { Errors } = require("../../Models/Errors.js");

/**
 * add an item in the Beyond Vision catalog
 * @param { Request } req { body: TODO }
 * @param { Response } res
 * @returns { response to send }
 */
exports.addItem = async function(req, res) {
    try {
        if (!req.body)
            return (res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS));

        return (res.status(200).send("Item successfully added to the catalog"));
    } catch (err) {
        console.log("Shop->addItem: " + err);
        return (res.status(400).send(Errors.BAD_REQUEST_BAD_INFOS));
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
        if (!req.params.name || !req.params.type || !req.params.minPrice || !req.params.maxPrice || (req.params.minPrice < 0 || req.params.maxPrice < req.params.minPrice) || (req.body.itemsPerPage <= 0 || req.body.pageNb < 0))
            return (res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS));
        // TODO Mongo request from params

        return (res.status(200).send("Research successfully completed"));
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
 * get an article by id
 * @param { Request } req { body: articleId }
 * @param { Response } res
 * @returns { response to send }
 */
exports.getItemById = async function(req, res) {
    try {
        if ((!req.body.articleID))
            return (res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS));

        // var article = await TODO: Shop.findById(req.params.articleId)

        // if (!article)
        // return (res.status(400).send(Errors.ARTICLE_NOT_FOUND));

        return (res.status(200).send("Item have been successfully retrieved"));
    } catch (err) {
        console.log("Shop->getItemById: " + err);
        return (res.status(400).send(Errors.BAD_REQUEST_BAD_INFOS));
    }
}