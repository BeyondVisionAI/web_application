import React from "react";

const ScriptBoxList = () => {
    const tempText = // TODO fetch current created script parts
    [
        {id: 0, title: "p1", content: "random text"},
        {id: 1, title: "p2", content: "another random text"},
        {id: 2, title: "p3", content: "pretty random text"},
        {id: 3, title: "p4", content: "last random text"}
    ];

    const scriptBoxes = tempText.map((item) => {
        <li key={item.id}>
            <div>
                <h1>{item.title}</h1>
                <p>{item.content}</p>
            </div>
        </li>
    });

    return (
        <div>
            <ul>{scriptBoxes}</ul>
        </div>
    )
}

export default ScriptBoxList;