import axios from 'axios';
import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import { DownloadFileUrl } from '../../../../GenericComponents/Files/S3Manager';
import Widget from '../../../../GenericComponents/Widget/Widget';

export default function Description({ projectId, title, description, thumbnailId }) {

    const [thumbnail, setThumbnail] = useState(null);

    useEffect(() => {
        try {
            async function getData () {
                try {
                    let image = await axios.get(`${process.env.REACT_APP_API_URL}/images/${projectId}/${thumbnailId}`);
                    let url = await DownloadFileUrl('bv-thumbnail-project', image.data.name);
                    setThumbnail(url);
                } catch (err) {
                    console.error(`Getting file ${thumbnailId} on S3`, err);
                }
            }

            if (thumbnailId)
                getData();
        } catch (error) {
            console.error(error);
            toast.error('Error while fetching data!');
        }
    }, [projectId, setThumbnail, thumbnailId]);

    function dispThumbnail() {
        if (thumbnail)
            return (<img className='object-scale-down w-2/4' src={ thumbnail } alt='thumbnail'></img>);
        return (<div class="flex flex-wrap shadow-xl rounded"></div>);
    };
    // TODO: Loading

  return (
    <Widget weight='h-2/4' rounded='rounded-t-lg'>
        <div className='w-2/4'>
            <h1 className='indent-1 top-10 p-5 text-2xl font-bold'>{title}</h1>
            <p className='p-5 right-9 text-lg'>{description}</p>
        </div>
        <div className='w-2/4'>
            { dispThumbnail() }
        </div>
    </Widget>
  )
}
