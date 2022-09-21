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
            <h1>The Team</h1>
            <div data-aos="slide-left" className="line">
                <Member name="GAIGNARD Alex" picture="/ag.png" position="Web Developer / CI-CD" />
                <Member name="MENARD Leo" picture="/ag.png" position="Web Developer / IA" />
                <Member name="CLAIN Dimitri" picture="/ag.png" position="Web Developer / Web Designer" />
                <Member name="FERTIN Timothe" picture="/ag.png" position="Web Developer" />
            </div>
            <div data-aos="slide-right" className="line">
                <Member name="VAN KERCKVOORDE Paul" picture="/ag.png" position="Web Developer / QA" />
                <Member name="LAURET Marc-Olivier" picture="/ag.png" position="Web Developer" />
                <Member name="CHEUNG LIM YEN Fabien" picture="/ag.png" position="Artificial Intelligence" />
                <Member name="DESRUES Matthieu" picture="/ag.png" position="Web Developer" />
            </div>
        </div>
    );
}
 
export default TheTeam;