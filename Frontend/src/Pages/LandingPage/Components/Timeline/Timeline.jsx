import "./Timeline.css";

const Timeline = () => {
  return (
    <div href="timeline" id="timeline" className="timeline-body">
      {/* <!-- The Timeline --> */}
        <h1 style={{marginBottom: '2vh'}}>The timeline</h1>
      <ul class="timeline">
        <li>
          <div class="direction-l">
            <div class="flag-wrapper">
              <span class="flag wbg">September 2020</span>
              <span class="time-wrapper hide">
                <span class="time">2011 - 2013</span>
              </span>
            </div>
            <div class="desc">
              Definition of the project
            </div>
          </div>
        </li>

        <li>
          <div class="direction-l">
            <div class="flag-wrapper">
              <span class="flag wbg">February 2021</span>
              <span class="time-wrapper hide">
                <span class="time">2011 - 2013</span>
              </span>
            </div>
            <div class="desc">
              Design and Tests
            </div>
          </div>
        </li>

        <li>
          <div class="direction-l">
            <div class="flag-wrapper">
              <span class="flag wbg">May 2021</span>
              <span class="time-wrapper hide">
                <span class="time">2011 - 2013</span>
              </span>
            </div>
            <div class="desc">
              Start of the development of the software
            </div>
          </div>
        </li>

        {/* <!-- Item Focsued --> */}
        <li>
          <div class="direction-l">
            <div class="flag-wrapper">
              <span class="flag xl">May 2022 </span>
              <span class="time-wrapper hide">
                <span class="time">2011 - 2013</span>
              </span>
            </div>
            <div class="desc">
              Deployment of the beta
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Timeline;
