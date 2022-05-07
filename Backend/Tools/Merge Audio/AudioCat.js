const audioconcat = require('audioconcat');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');

var fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const aws = require("./Upload")

var results;
var dataIn;
var dataOut;

function checkExtention(filename) {
    var extention = filename.split('.').pop()
    if (extention != "mp3")
        return (false);
    return (true);
}

function AWSPush(output_file, bucket_name, AWS_file_name) {
    console.log("[3/3] ===== SENDING THE FILE TO AWS : ")
    if (fs.existsSync(output_file)) {
        //aws.uploadFile(output_file, bucket_name, AWS_file_name)
        console.log("[3/3] ===== SUCCESS")
    }
    else
        console.log("[3/3] ===== FAILED : Output file Missing: The file cannot be send to AWS")
}

function getConfig() {

    console.log("[1/3] ===== READING THE CONFIG FILE : ")

    var length = 0;
    if (!fs.existsSync(dataIn + "config.json"))
        return (false);
    
    results = JSON.parse(fs.readFileSync(dataIn + "config.json", 'utf-8'))["order"]

    for (let i in results) {
        length += 1
        if (results[i].silence == undefined || results[i].audio == undefined)
            return (false)
        if (results[i].silence < 0 || !fs.existsSync(dataIn + results[i].audio) || !checkExtention(dataIn + results[i].audio))
            return (false)
    }

    if (length == 0)
        return (false);

    if (!fs.existsSync(dataOut))
        fs.mkdirSync(dataOut)

    console.log("[1/3] ===== SUCCESS")
    
    return (true)
}

function ClearFolder(FolderPath) {
    if (fs.existsSync(FolderPath)) {
        Files = fs.readdirSync(FolderPath)
        for (const FolderFile of Files) {
            fs.unlinkSync(FolderPath + FolderFile, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            })
        }
    }
}

async function GenBlankAudio(time, path) {
    try {
        let script = await exec('./ffmpegaudiogen.sh ' + time + ' ' + path,
        function (error, stdout, stderr) {
        })
        return (1)
    } catch (error) {
        console.error(error)
        return (-1)
    }
}

async function GenAudios() {
    console.log("      [1/3] ===== GENERATING BLANK AUDIOS : ")
    var blankAudios = []
    if (fs.existsSync(dataIn + ".blank" + path.sep))
        ClearFolder(dataIn + ".blank" + path.sep)
    for (let i in results) {
        if (results[i].silence > 0) {
            var res = await GenBlankAudio(results[i].silence, dataIn + ".blank" + path.sep + "blank-audio_" + ('0000' + i).slice(-5) + ".mp3")
            if (res == 1)
                blankAudios.push(dataIn + ".blank" + path.sep + "blank-audio_" + ('0000' + i).slice(-5) + ".mp3")
            else {
                console.error("      [1/3] ===== FAILED")
                throw ("Generation failed, this error seems to come from ffmpeg")
            }
        }
        else
            blankAudios.push("none");
    }
    console.log("      [1/3] ===== SUCCESS")
    return (blankAudios)
}

async function GenAudioArray(blankAudios) {
    try {
        console.log("      [2/3] ===== GENERATION OF THE AUDIO PLAN : ")
        var audios = []
        for (let i in results) {
            if (results[i].silence > 0) {
                audios.push(blankAudios[i - 1])
            }
            audios.push(dataIn + results[i].audio)
        }
        console.log("      [2/3] ===== SUCCESS")
        return (audios)
    } catch (error) {
        throw("      [2/3] ===== FAILED : " + error)
    }
}

async function GenAudio(output_path) {
    try {
        console.log("[2/3] ===== STARTING THE AUDIO GENERATION : ")
        const blankAudios = await GenAudios()
        const audios = await GenAudioArray(blankAudios)
        const res = await concatAudios(audios, output_path)
        console.log("[2/3] ===== SUCCESS")
        return (1)
    } catch (error) {
        console.error("[2/3] ===== FAILED : " + error)
        return (-1)
    }
}

function concatAudios(audios, output_path) {
    return new Promise(resolve => {
        try {
        audioconcat(audios).concat(output_path)
        .on('start', function (command) {
            console.log("      [3/3] ===== CONCAT AUDIOS : ")
        })
        .on('error', function(err) {
            console.error("      [3/3] ===== FAILED : " + err)
            resolve(-1)
        })
        .on('end', function (output_path) {
            console.error("      [3/3] ===== SUCCESS")
            resolve(1)
        })
    } catch (error) {}
    })
}

async function audioCat(FolderPath, bucket_name, AWS_file_name) {
    const outputname = `AD_output_${(new Date().toJSON().slice(0,10))}.mp3`
    if (FolderPath.slice(-1) != path.sep)
        FolderPath += path.sep
    dataIn = FolderPath + "DATA" + path.sep + "IN" + path.sep
    dataOut = FolderPath + "DATA" + path.sep + "OUT" + path.sep
    if (!getConfig()) {
        console.error("[1/3] ===== FAILED : Invalid configuration file stynax or missing files")
        return;
    }
    ClearFolder(dataOut)
    const result = await GenAudio(dataOut + outputname);
    ClearFolder(dataIn + ".blank" + path.sep)
    if (result == 1)
        AWSPush(dataOut + outputname, bucket_name, AWS_file_name)
}

/*TESTING*/
if (process.argv.length != 5)
    process.exit(1)
audioCat(process.argv[2], process.argv[3], process.argv[4])