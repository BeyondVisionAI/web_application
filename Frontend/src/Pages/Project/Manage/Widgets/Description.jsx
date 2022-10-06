import axios from 'axios';
import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import Widget from '../../../../GenericComponents/Widget/Widget';
import UploadFile from '../../../../GenericComponents/Files/UploadFile';
import InputWithLabel from '../../../../GenericComponents/InputWithLabel/InputWithLabel';

export default function Description({ editing, setEditing, updateProjectValues, projectId, name, description, thumbnailId }) {

    const [tmpProject, setTmpProject] = useState({name: name, description: description});
    const [thumbnail, setThumbnail] = useState(null);
    const [image, setImage] = useState(null);

    function handleChange(input, value) {
        let tmp = tmpProject;

        tmp[input] = value;
        setTmpProject(tmp);
    }


    useEffect(() => {
        try {
            async function getThumbnailProject(projId) {
                try {
                    let image = await axios.get(`${process.env.REACT_APP_API_URL}/images/${projId}/${thumbnailId}`);
                    let response = await axios.get(`${process.env.REACT_APP_API_URL}/S3Manager/source-product/thumbnail/download-url/${image.data.name}`);
                    let url = response.data;
                    setThumbnail(url);
                } catch (err) {
                    console.error(`Getting file ${thumbnailId} on S3`, err);
                }
            }

            if (thumbnailId)
                getThumbnailProject(projectId);
        } catch (error) {
            console.error(error);
            toast.error('Error while fetching data!');
        }
    }, [projectId, setThumbnail, thumbnailId]);

    function dispThumbnail() {
        if (thumbnail)
            return (<img className='object-scale-down w-2/4' src={ thumbnail } alt='thumbnail'></img>);
        return (<div className="flex flex-wrap shadow-xl rounded">Uploading ...</div>);
    };
    // TODO: Loading

    useEffect(() => {
        const onImageChange = () => {
            if (image) {
                let reader = new FileReader();

                reader.readAsDataURL(image);
                reader.onload = () => {
                    setThumbnail(reader.result);
                }
            }
        };

        onImageChange();
    }, [image]);

    useEffect(() => {
        async function updateThumbnail() {
            try {
                const responseThumbnail = await axios.get(`${process.env.REACT_APP_API_URL}/S3Manger/source-product/thumbnail/upload-url/${projectId}.${image.name.split(".").pop()}}`);
                const urlThumbnailUpload = responseThumbnail.data;
                console.log("Thumbnail Url :", urlThumbnailUpload);
                axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
                const imageRes = await axios({
                    url: urlThumbnailUpload,
                    body: image,
                    method: 'PUT'
                });
                console.error("Upload thumbnail Finished - sending info of the file");
                let thumbnailResponse = await axios.post(`${process.env.REACT_APP_API_URL}/images${thumbnailId}`, {
                    name: imageRes.Key,
                    desc: `Thumbnail for ${tmpProject.name} locate in bv-thumbnail-project bucket`,
                    ETag: imageRes.ETag,
                });
                console.log(thumbnailResponse.data);
                if (thumbnailResponse.status !== 200)
                    console.error("Update image db error");
            } catch (err) {
                console.error("Upload thumbnail error:", err)
            }
        }

        async function updateProject () {
            try {
                let response = await axios.patch(`${process.env.REACT_APP_API_URL}/projects/${projectId}`, tmpProject);

                updateThumbnail();
                if (response.status !== 200)
                    toast.error("Error while update project");
                else {
                    toast.success('Update success');
                    updateProjectValues([{field: 'description', value: response.data.description}, {field: 'name', value: response.data.name}]);
                    setEditing(0);
                }
            } catch (error) {
                console.error(error);
                toast.error("Error, please retry.");
            }
        }

        if (editing === 2) {
            updateProject();
        }
    }, [editing, image, projectId, setEditing, thumbnailId, tmpProject, updateProjectValues])

    return (
        <Widget weight='h-2/4' rounded='rounded-t-lg'>
            <div className='w-2/4'>
            {editing === 1 ? <InputWithLabel defaultValue={ name } placeholder="Title" type="text" label="Title" onChange={ tmpTitle => handleChange('name', tmpTitle) } /> : <h1 className='indent-1 top-10 p-5 text-2xl font-bold'>{name}</h1>}
            {editing === 1 ? <InputWithLabel defaultValue={ description } placeholder="Résumé de la vidéo" type="textarea" label="Résumé court de la vidéo" onChange={ resume => handleChange('description', resume) } /> : <p className='p-5 right-9 text-lg'>{description}</p>}
            </div>
            <div className='w-2/4'>
                {editing === 1 ? <UploadFile setData={ setImage } isFill={image ? true : false} types=".jpg, .jpeg, .png"/> : null}
                { dispThumbnail() }
            </div>
        </Widget>
    )
}
