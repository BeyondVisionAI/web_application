import React, { Component } from 'react';
import axios from "axios";

class FileDownload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image_name: null,
            image_preview: '',
        }
    }

    // Image Preview Handler
    handleImagePreview = (e) => {
        let image_as_base64 = URL.createObjectURL(e.target.files[0])
        let image_as_files = e.target.files[0];

        this.setState({
            image_preview: image_as_base64,
            image_file: image_as_files,
        })
    }

    // Image/File Submit Handler
    handleSubmitFile = async () => {

        try {
            if (this.state.image_file !== null) {
                const responseThumbnail = await axios.post(`${process.env.REACT_APP_API_URL}/mediaManager/Download/thumbnail`, {objectName: this.image_name}, { withCredentials: true });
                const urlThumbnailUpload = responseThumbnail.data;
                console.log('url :', urlThumbnailUpload);
                const response = axios.get(
                    urlThumbnailUpload,
                    {
                        headers: {
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Methods": "GET",
                            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
                        },
                    }
                )
                .then(res => {
                    console.log(`Success` + res.data);
                })
                .catch(err => {
                    console.log(err);
                })
                this.handleImagePreview(response.data);
            }
        } catch (err) {
            console.log(err);
        }
    }


    // render from here
    render() {
        return (
            <div>
                {/* image preview */}
                <img src={this.state.image_preview} alt="image preview"/>

                {/* image input field */}
                <input
                    type="text"
                />
                <label>Download file</label>
                <input type="Submit" onClick={this.handleSubmitFile} value="Download"/>
            </div>
        );
    }
}

export default FileDownload;