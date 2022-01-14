import React from "react";
import ScriptEditBox from "../ScriptEditBox/ScriptEditBox";

// TODO fetch current created script parts

const ScriptBoxList = () => {
    const tempText =
    [
        {id: 0, content: <ScriptEditBox />},
        {id: 1, content: <ScriptEditBox />},
        {id: 2, content: <ScriptEditBox />},
        {id: 3, content: <ScriptEditBox />}
    ];

    const scriptBoxes = tempText.map((item) => {
        return (
        <li id="scriptList{item.id}">{item.content}</li>
        )
    });

    return (
        <div>
            <ul>{scriptBoxes}</ul>
        </div>
    )
}

export default ScriptBoxList;