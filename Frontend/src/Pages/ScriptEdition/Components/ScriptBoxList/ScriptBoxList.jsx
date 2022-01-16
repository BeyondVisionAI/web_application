import React from "react";
import ScriptEditBox from "../ScriptEditBox/ScriptEditBox";

// TODO fetch current created script parts

const ScriptBoxList = () => {
    const tempText =
    [
        {id: 0, content: <ScriptEditBox />},
        {id: 1, content: <ScriptEditBox />},
        {id: 2, content: <ScriptEditBox />},
        {id: 3, content: <ScriptEditBox />},
        {id: 4, content: <ScriptEditBox />},
        {id: 5, content: <ScriptEditBox />},
        {id: 6, content: <ScriptEditBox />},
        {id: 7, content: <ScriptEditBox />},
        {id: 8, content: <ScriptEditBox />},
        {id: 9, content: <ScriptEditBox />}
    ];

    const scriptBoxes = tempText.map((item) => {
        return (
        <li className="flex" key={"scriptList_" + item.id}>{item.content}</li>
        )
    });

    return (
        <div className="h-full m-auto">
            <ul className="w-full h-full list-none m-auto overflow-y-scroll
            flex flex-col flex-nowrap py-1 pl-1">{scriptBoxes}</ul>
        </div>
    )
}

export default ScriptBoxList;