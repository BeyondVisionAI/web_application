import React from "react";
import ScriptEditBox from "../ScriptEditBox/ScriptEditBox";

const ScriptBoxList = () => {
    const tempText = // TODO fetch current created script parts
    [
        {id: 0, content: <ScriptEditBox />},
        {id: 1, content: <ScriptEditBox />},
        {id: 2, content: <ScriptEditBox />},
        {id: 3, content: <ScriptEditBox />}
    ];

    const scriptBoxes = tempText.map((item) => {
        <li><ScriptEditBox /></li>
        // <li key={item.id}>
        //     <div>
        //         <ScriptEditBox />
        //     </div>
        // </li>
    });

    return (
        <div>
            <ul>{scriptBoxes}</ul>
        </div>
    )
}

export default ScriptBoxList;