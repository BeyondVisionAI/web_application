import React, { Component } from 'react';
import axios from "axios";

class FileUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image_file: null,
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
                let formData = new FormData();
                formData.append('Test.txt', this.state.image_file);
                const responseThumbnail = await axios.post(`${process.env.REACT_APP_API_URL}/mediaManager/Upload/thumbnail`, {objectName: 'Test.txt'}, { withCredentials: true });
                const urlThumbnailUpload = responseThumbnail.data;
                console.log('url :', urlThumbnailUpload);

                axios.put(
                    urlThumbnailUpload,
                    formData,
                    {
                        headers: {
                            "Content-Type": formData.type,
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Methods": "PUT",
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
                    type="file"
                    onChange={this.handleImagePreview}
                />
                <label>Upload file</label>
                <input type="submit" onClick={this.handleSubmitFile} value="Submit"/>
            </div>
        );
    }
}

export default FileUpload;