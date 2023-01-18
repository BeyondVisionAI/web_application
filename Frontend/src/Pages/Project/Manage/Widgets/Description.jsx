/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import { DownloadFileUrl, UploadFileOnS3 } from '../../../../GenericComponents/Files/S3Manager';
import Widget from '../../../../GenericComponents/Widget/Widget';
import UploadFile from '../../../../GenericComponents/Files/UploadFile';
import InputWithLabel from '../../../../GenericComponents/InputWithLabel/InputWithLabel';
import { useTranslation } from 'react-i18next';

export default function Description({ editing, setEditing, updateProjectValues, projectId, name, description, thumbnailId }) {
    const { t } = useTranslation('translation', {keyPrefix: 'project.manage.descriptionWidget'});
    const { t: tErr } = useTranslation('translation', {keyPrefix: "errMsgs"})
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
                    let url = await DownloadFileUrl('bv-thumbnail-project', image.data.name);
                    setThumbnail(url);
                } catch (err) {
                    toast.error(tErr('description.gettingThumbnail'))
                }
            }

            if (thumbnailId)
                getThumbnailProject(projectId);
        } catch (error) {
            toast.error(t('errMsgs.errWhileFetchingData'));
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
        function updateThumbnail() {
            let bucket = 'bv-thumbnail-project';

            UploadFileOnS3(image, bucket, 'us-east-1', `${projectId}.${image.name.split(".").pop()}`)
            .then(async (imageRes) => {
                let thumbnailResponse = await axios.put(`${process.env.REACT_APP_API_URL}/images/${thumbnailId}`, {
                    name: imageRes.Key,
                    desc: `Thumbnail for ${tmpProject.name} locate in ${bucket} bucket`,
                    ETag: imageRes.ETag,
                });
                if (thumbnailResponse.status !== 200)
                    toast.error(tErr("description.uploadImage"));
            }).catch(() => toast.error(tErr("description.uploadThumbnail")));
        }

        async function updateProject () {
            try {
                let response = await axios.patch(`${process.env.REACT_APP_API_URL}/projects/${projectId}`, tmpProject);

                updateThumbnail();
                if (response.status !== 200)
                    toast.error(t('errMsgs.errWhileUpdatingProject'));
                else {
                    toast.success(t('updateSuccess'));
                    updateProjectValues([{field: 'description', value: response.data.description}, {field: 'name', value: response.data.name}]);
                    setEditing(0);
                }
            } catch (error) {
                console.error(error);
                toast.error(t('errMsgs.errPleaseRetry'));
            }
        }

        if (editing === 2) {
            updateProject();
        }
    }, [editing, image, projectId, setEditing, thumbnailId, tmpProject, updateProjectValues])

    return (
        <Widget weight='h-2/4' rounded='rounded-t-lg'>
            <div className='w-2/4'>
            {editing === 1 ? <InputWithLabel defaultValue={ name } placeholder={t('title.placeholder')} type="text" label={t('title.label')} onChange={ tmpTitle => handleChange('name', tmpTitle) } /> : <h1 className='indent-1 top-10 p-5 text-2xl font-bold'>{name}</h1>}
            {editing === 1 ? <InputWithLabel defaultValue={ description } placeholder={t('description.placeholder')} type="textarea" label={t('description.label')} onChange={ resume => handleChange('description', resume) } /> : <p className='p-5 right-9 text-lg'>{description}</p>}
            </div>
            <div className='w-2/4'>
                {editing === 1 ? <UploadFile setData={ setImage } isFill={image ? true : false} types=".jpg, .jpeg, .png"/> : null}
                { dispThumbnail() }
            </div>
        </Widget>
    )
}
