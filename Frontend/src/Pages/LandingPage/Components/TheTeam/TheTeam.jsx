import React, {useEffect} from 'react';
import Member from './Member/Member';
import "./TheTeam.css"
import Aos from 'aos'

const TheTeam = () => {

    useEffect(() => {
        Aos.init({duration: "1500", disable: 'mobile'})
    }, []);

    return (
        <div href="aboutus" id="aboutus" className="team-container">
            <div data-aos="slide-left" className="line">
                <Member name="GAIGNARD Alex" picture="/ag.png" position="Web Developer" />
                <Member name="GAIGNARD Alex" picture="/ag.png" position="Web Developer" />
                <Member name="GAIGNARD Alex" picture="/ag.png" position="Web Developer" />
                <Member name="GAIGNARD Alex" picture="/ag.png" position="Web Developer" />
            </div>
            <div data-aos="slide-right" className="line">
                <Member name="GAIGNARD Alex" picture="/ag.png" position="Web Developer" />
                <Member name="GAIGNARD Alex" picture="/ag.png" position="Web Developer" />
                <Member name="GAIGNARD Alex" picture="/ag.png" position="Web Developer" />
                <Member name="GAIGNARD Alex" picture="/ag.png" position="Web Developer" />
            </div>
        </div>
    );
}
 
export default TheTeam;