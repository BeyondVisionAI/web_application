import { useTranslation } from 'react-i18next';
import "./Timeline.css";

const Timeline = () => {
  const { t } = useTranslation('translation', {keyPrefix: 'landingPage.timeline'});
  const timeline = [
    { date: "Sep_20", isFocused: false },
    { date: "Feb_21", isFocused: false },
    { date: "May_21", isFocused: false },
    { date: "May_22", isFocused: true }
  ]
  return (
    <div href="timeline" id="timeline" className="timeline-body">
      {/* <!-- The Timeline --> */}
        <h1 style={{marginBottom: '2vh'}}>{t('header')}</h1>
      <ul className="timeline">
        {timeline.map((milestone => (
          <li>
            <div className="direction-l">
              <div className="flag-wrapper">
                <span className={(milestone.isFocused) ? "flag x1" : "flag wbg"}>
                  {t(`${milestone.date}.label`)}
                </span>
                <span className="time-wrapper hide">
                  <span className="time">2011 - 2013</span>
                </span>
              </div>
              <div className="desc">
              {t(`${milestone.date}.description`)}
              </div>
            </div>
          </li>
        )))}
      {/*
        <li>
          <div className="direction-l">
            <div className="flag-wrapper">
              <span className="flag wbg">September 2020</span>
              <span className="time-wrapper hide">
                <span className="time">2011 - 2013</span>
              </span>
            </div>
            <div className="desc">
              Definition of the project
            </div>
          </div>
        </li>

        <li>
          <div className="direction-l">
            <div className="flag-wrapper">
              <span className="flag wbg">February 2021</span>
              <span className="time-wrapper hide">
                <span className="time">2011 - 2013</span>
              </span>
            </div>
            <div className="desc">
              Design and Tests
            </div>
          </div>
        </li>

        <li>
          <div className="direction-l">
            <div className="flag-wrapper">
              <span className="flag wbg">May 2021</span>
              <span className="time-wrapper hide">
                <span className="time">2011 - 2013</span>
              </span>
            </div>
            <div className="desc">
              Start of the development of the software
            </div>
          </div>
        </li>
  */}

        {/* <!-- Item Focsued --> */}
        {/*
        <li>
          <div className="direction-l">
            <div className="flag-wrapper">
              <span className="flag xl">May 2022 </span>
              <span className="time-wrapper hide">
                <span className="time">2011 - 2013</span>
              </span>
            </div>
            <div className="desc">
              {t('May_22.description')}
            </div>
          </div>
        </li>
        */}
      </ul>
    </div>
  );
};

export default Timeline;
