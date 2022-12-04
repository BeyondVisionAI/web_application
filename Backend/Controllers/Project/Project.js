const { Project, enumStatus, enumActualStep } = require("../../Models/Project");
const Collaboration = require("../../Controllers/Collaboration/Collaboration");
const { Role } = require("../../Models/Roles");
const { Errors } = require("../../Models/Errors.js");
const { ProjectListed } = require("../../Models/list/ProjectListed");
const axios = require("axios");
const { Payment, PaymentStatus } = require("../../Models/Payment");

const projectHasBeenPaid = async function (projectId) {
    const payments = await Payment.find({ projectId: projectId });

    if (!payments.length) {
        return false;
    }
    for (const payment of payments) {
        if (!payment || payment.paymentStatus != PaymentStatus.success) {
            return false;
        }
    }
    return true;
}
const { Collaboration: CollaborationModel } = require("../../Models/Collaboration") ;
const { User } = require("../../Models/User");
const { Image } = require("../../Models/Media/Image");
const { Video } = require("../../Models/Media/Video");

exports.getProjectDB = async function (projectId) {
    try {
        const project = await Project.findById(projectId);
        const isPaid = await projectHasBeenPaid(projectId);        

        return {...project._doc, isPaid: isPaid};
    } catch (err) {
        console.log("Project->getProjectDB: " + err);
        return null;
    }
}

exports.getAllProjectsDB = async function (userId) {
    try {
        const collabs = await Collaboration.getAllCollaborationsDB(userId);
        var projects = [];
        for (const collab in collabs) {
            var project = await Project.findById(collabs[collab].projectId);
            if (project)
                projects.push(project);
            else
                console.log("Project->getAllProjectDB: Collab \"" + collabs[collab]._id + "\" is linked to a not existing projectId: " + collab.projectId);
        }
        return projects;
    } catch (err) {
        console.log("Project->getAllProjectsDB: " + err);
        return null;
    }
}

/**
 * Get a project
 * @param { Request } req { params: { projectID } }
 * @param { Response } res
 * @returns { [{ _id, name, status, videoId, script, creator, assignedAudioDescriptiors }] }
 */
exports.getProject = async function (req, res) {
    try {
        const project = await Project.findById(req.params.projectId);
        const isPaid = await projectHasBeenPaid(req.params.projectId);        

        if (project)
            return res.status(200).send({...project._doc, isPaid: isPaid});
        return res.status(404).send(Errors.PROJECT_NOT_FOUND);
    } catch (err) {
        console.log("Project->getProject: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
};

/**
 * Create a project
 * @param { Request } req { user: { userId }, body: { name, thumbnailId, description, videoId, script }}
 * @param { Response } res
 * @returns { status: Number, message: String }
 */
exports.createProject = async function (req, res) {
    try {
        if (!req.body.name || !req.body.description)
            return res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS);

        const newProject = new Project({
            name: req.body.name,
            status: 'Stop',
            thumbnailId: req.body.thumbnailId,
            videoId: req.body.videoId,
            description: req.body.description,
            script: req.body.script
        });
        await newProject.save();
        await Collaboration.createCollaborationDB(req.user.userId, newProject._id, "Owner", Role.OWNER);
        res.status(200).send(newProject);
    } catch (err) {
        console.log("Project->createProject: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
};

/**
 * Delete a project
 * @param { Request } req { body: { projectId } }
 * @param { Response } res
 * @returns { status: Number, message: String }
 */
exports.deleteProject = async function (req, res) {
    try {
        const projectsListedToDelete = await ProjectListed.find({ projectId: req.params.projectId });
        for (var projectListed of projectsListedToDelete)
            await ProjectListed.deleteOne({ _id: projectListed._id });

        const collaborationsToDelete = await Collaboration.getAllCollaborationsWithProjectId(req.params.projectId);
        for (var collaboration of collaborationsToDelete)
            await Collaboration.deleteCollaborationDB(collaboration._id);

        await Project.deleteOne({ _id: req.params.projectId }); // TODO: Try multiple
        await Project.deleteMany({ _id: { $in: req.body.projectIds } });
        return res.status(204).send("");
    } catch (err) {
        console.log("Project->deleteProject: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

/**
 * Delete a project
 * @param { Request } req { params: { projectId }, body: { status?, actualStep?, progress?, thumbnailId?, videoId?, description?, script? } }
 * @param { Response } res
 * @returns { status: Number, data: Project }
 */
exports.updateProject = async function (req, res) {
    try {
        const project = await Project.findByIdAndUpdate(req.params.projectId, req.body, { returnDocument: 'after' });
        return res.status(200).send(project);
    } catch (err) {
        console.log("Project->updateProject: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

exports.getAllProjects = async function (req, res) {
    try {
        var projectsIds = null
        console.log("🚀 ~ file: Project.js ~ line 164 ~ req.body", req.query)
        if (req.query.limit) {
            projectsIds = await CollaborationModel.find({userId : req.user.userId}).sort({ _id: -1 }).limit(parseInt(req.body.limit));
        } else {
            projectsIds = await CollaborationModel.find({userId : req.user.userId}).sort({ _id: -1 });
        }
        const projects = []
        for (const projectId of projectsIds) {
            let ownerId = await CollaborationModel.findOne({projectId: projectId.projectId, rights: Role.OWNER});
            const owner = await User.findOne({ _id: ownerId.userId}, {firstName: 1, lastName: 1})
            const project = await Project.findOne({ _id: projectId.projectId});
            const thumbnail = await Image.findOne({ _id: project.thumbnailId})
            const video = await Video.findOne({ _id: project.videoId})
            projects.push({...project._doc, owner: owner, thumbnail: thumbnail, video: video})
        }
        console.log("🚀 ~ file: Project.js ~ line 164 ~ projects", projects)
        return res.status(200).send(projects);
    } catch (err) {
        console.log("Project->getAllProject: " + err);
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}

/**
 * set the Status of a project from the ServerAPI
 * @param { Request } req { params: projectId, body: { statusType, stepType, percentage (no required) } }
 * @param { Response } res
 * @returns { response to send }
 */
exports.setStatus = async function (req, res) {
    console.log('Route Set Status');
    try {
        if (!req.params.projectId || !req.body.statusType || !req.body.stepType)
            return (res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS));
        let project = await Project.findById(req.params.projectId);

        if (!project)
            return (res.status(400).send(Errors.PROJECT_NOT_FOUND));
        else if (!Object.values(enumStatus).includes(req.body.statusType) || !Object.values(enumActualStep).includes(req.body.stepType))
            return (res.status(400).send(Errors.BAD_REQUEST_BAD_INFOS));

        project.status = req.body.statusType;
        project.ActualStep = req.body.stepType;

        if (req.body.progress && req.body.progress >= 0 && progrreq.body.progressess <= 100)
            project.progress = req.body.progress;
        else if (req.body.statusType === 'Stop' || req.body.statusType === 'Error')
            project.progress = 0;
        else if (req.body.statusType === 'InProgress')
            project.progress = 50;
        else if (req.body.statusType === 'Done')
            project.progress = 100;


        await project.save();
        console.log("Project:", project);
        if (project.ActualStep === 'VoiceGeneration' && project.statusType === 'Done') {
            axios.post(`${process.env.SERVER_IA_URL}/GenerationVideo`, { projectId: req.params.projectId })
        }
        return (res.status(200).send("The status has been changed"));
    } catch (err) {
        console.log("Project->setStatus: " + err);
        return (res.status(400).send(Errors.BAD_REQUEST_BAD_INFOS));
    }
}

exports.generationIA = async function (req, res) {
    console.log('Route generation IA');
    let returnCode = 200;
    let returnMessage = "";
    let project = await Project.findById(req.params.projectId);
    try {
        if (!req.body.typeGeneration) {
            throw Errors.BAD_REQUEST_BAD_INFOS;
        }
        if ((project.ActualStep === 'ActionRetrieve' || project.ActualStep === 'FaceRecognition') && project.status === 'InProgress') {
            returnMessage = 'Generation IA is in progress';
        } else {
            if (req.body.typeGeneration === 'ActionRetrieve') {
                project.ActualStep = 'ActionRetrieve';
                await axios.post(`${process.env.SERVER_IA_URL}/AI/Action/NewProcess`, { projectId: req.params.projectId });
            } else if (req.body.typeGeneration === 'FaceRecognition') {
                project.ActualStep = 'FaceRecognition';
                // IA A besoin des images des different personnage sinon ils seront considérer en tant que unknow
                await axios.post(`${process.env.SERVER_IA_URL}/AI/FaceRecognition/NewProcess`, { projectId: req.params.projectId });
            }
        }
    } catch (err) {
        project.status = 'Error';
        await project.save();
        console.log("Project->Generation IA: " + err);
        returnCode = 400;
        returnMessage = err;
    }
    return (res.status(returnCode).send(returnMessage));
}

exports.finishedEdition = async function (req, res) {
    console.log('Route Finished Edtion');
    let returnCode = 200;
    let returnMessage = "La generation des Audio sont en cours...";
    try {
        replicas = getProjectReplicas(req.params.projectId);
        if (replicas === Errors.INTERNAL_ERROR) {
            throw Errors.INTERNAL_ERROR;
        } else if ((await replicas).length === 0) {
            returnCode = 400;
            returnMessage = "Error : Il n'y a aucun audio a générer.";
        }
        let audiosInfo = []
        let audioObject = {
            id: '',
            timeStamp: .0,
            duration: .0,
        }
        for (replica in replicas) {
            audioObject.id = replica.id;
            audioObject.timeStamp = replica.id;
            audioObject.duration = replica.id;
            if (replica.status !== 'Done' && replicas.actualStep !== 'Voice')
                if (!createAudio(replica))
                    throw Errors.INTERNAL_ERROR;
            audiosInfo.append(audioObject);
        }

        //TODO voir ce que marco a besoin au niveau des audios (url et etc...)
        axios.post(`${process.env.SERVER_IA_URL}/GenerationAudio`, { projectId: req.params.projectId, audiosInfo: audiosInfo });
    } catch (err) {
        console.log("Project->Finished Edition: " + err);
        returnCode = 400;
        returnMessage = err;
    }
    return (res.status(returnCode).send(returnMessage));
}