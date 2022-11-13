import React from 'react';
import ProjectComponent from './ProjectComponent/ProjectComponent';
import { useTranslation } from 'react-i18next';
import "./TheProject.css"


const TheProject = () => {
    const { t } = useTranslation('translation', {keyPrefix: 'landingPage'});

    return (
        <div href="project" id="project" className="project-container">
            <ProjectComponent delay="0" title={t("project-HELP")} underTitle={t("project-Help")} number="1" text={t("project-help")} />
            <ProjectComponent delay="500" title={t("project-SIMPLIFY")} underTitle={t("project-Simplify")} number="2" text={t("project-simplify")} />
            <ProjectComponent delay="1000" title={t("project-PROPEL")} underTitle={t("project-Propel")} number="3" text={t("project-propel")} />
        </div>
    );
}
 
export default TheProject;