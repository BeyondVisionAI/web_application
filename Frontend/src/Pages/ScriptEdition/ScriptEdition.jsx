import React from 'react';
import NavBar from '../../GenericComponents/NavBar/NavBar';
import ReplicaDetails from './Components/ReplicaDetails';

const date = new Date(Date.now());

const dateOptions =
{
    weekday: 'short', year: 'numeric', month: '2-digit',
    day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'
};

const tempReplica = {
    content: "This is an example of a replica",
    voice: "plop",
    comments: [
        "This is an example of a replica's nested comment",
        "Other comment written about this replica",
        "I would like to comment something else"
    ],
    // lastEdit: date.setMinutes(date.getMinutes() - 5),
    lastEdit: Date.now()/*.toLocaleDateString()*/,
    lastEditor: "John Doe"
}



const ScriptEdition = ( {title, script, video} ) => {
    return (
        <>
            <div className="script-edition-container h-screen w-screen">
                <NavBar />
                <div id="page-container" className="h-5/6 w-full py-2 px-6">
                    <div id="title" className="h-1/10 w-full flex flex-row justify-between items-center py-4">
                        <h1 className="text-blue-400 w-1/3 inline-flex items-center text-3xl">{title}</h1>
                        <button className="bg-blue-600 w-min h-1/5 rounded-full text-white truncate p-3 inline-flex items-center text-base">Soumettre</button>
                    </div>

                    <div id="edit-bloc" className="flex h-4/6">
                        {/* DETAILS IF REPLICA IS SELECTED */}
                       <div id="menu-detail" className="bg-gray-100 w-1/3 mx-1 shadow-lg rounded-tl-lg">
                            <ReplicaDetails replica={tempReplica}/>
                       </div>
                       {/* DETAILS EMPTY AS NOT REPLICA IS SELECTED */}
                       {/* <div id="menu-detail" className="bg-gray-100 w-1/3 mx-1 shadow-lg rounded-tl-lg">
                            <ReplicaDetails replica={tempReplica}/>
                       </div> */}
                       
                       <div id="movie-insight" className="flex justify-center content-end w-2/3 rounded-tr-3xl mx-1 shadow-lg bg-red-500">
                           <img className="object-cover" src="/assets/fight_club.jpeg" alt="" />
                       </div>
                    </div>

                    <div className="flex h-1/3 w-full px-2 pb-6 mt-2">
                       <div id="timeline" className="w-full h-full bg-green-400 rounded-b-3xl opacity-50 shadow-lg">Audio Timeline</div>
                   </div>

                </div>
            </div>
        </>
    )
}

/* OLD SCRIPT EDITION SCRIPT */
// const ScriptEdition = ( {script/*, video */}) => {
//     return (
//         <>
//             <div className="script-edition-container h-screen">
//                 <NavBar />

//                 <div className="page-container container h-5/6 pt-2 flex flex-col">
//                     <div className='h-1/6 flex w-full justify-between content-center px-6'>
//                         <h1 className='text-blue-400 text-3x1'>Project Title</h1>
//                         <button className='bg-blue-600 rounded-lg text-white h-1/3'>Submit</button>
//                     </div>
//                     <div className="flex h-3/6 px-1">
//                         <div className="flex flex-row w-full justify-around mt-2">
//                             <div id="movie-insight" className="flex justify-center content-end w-3/5 rounded-tl-3xl mx-1 p-2 shadow-lg">
//                                 <img className="object-cover" src="/assets/fight_club.jpeg" alt="" />
//                             </div>
//                             <div id="script-boxes" className="w-2/5 shadow-lg rounded-tr-3xl mx-1"><ScriptBoxList script={script} /></div>
//                             {/* shadow-xl ressembles the most to what's asked on the Figma, but smh doesn't work */}
//                         </div>
//                     </div>
//                     <div className="flex h-2/6 w-full px-2 mt-2">
//                         <div id="timeline" className="w-full h-full bg-green-400 rounded-b-3xl shadow-lg">Audio Timeline</div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// }

export default ScriptEdition;