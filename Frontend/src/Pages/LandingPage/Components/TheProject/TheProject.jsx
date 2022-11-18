import React from 'react';
import ProjectComponent from './ProjectComponent/ProjectComponent';
import { useTranslation } from 'react-i18next';
import "./TheProject.css"


const TheProject = () => {
    const { t } = useTranslation('translation', {keyPrefix: 'landingPage.project'});

    return (
        <div href="project" id="project" className="project-container">
            <ProjectComponent delay="0" title={t("help.header")} underTitle={t("help.subheader")} number="1" text={t("help.text")} />
            <ProjectComponent delay="500" title={t("simplify.header")} underTitle={t("simplify.subheader")} number="2" text={t("simplify.text")} />
            <ProjectComponent delay="1000" title={t("propel.header")} underTitle={t("propel.subheader")} number="3" text={t("propel.text")} />
        </div>
    );
}
 
export default TheProject;