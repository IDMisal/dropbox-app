// import React, { useState } from 'react';
// import { FolderPlusIcon } from '@heroicons/react/20/solid';
// import ConfirmAddFolder from './modals/ConfirmAddFolder';
// import { useAuth } from './../store/AuthStore';
// import { database } from '../../firebase';
// import { ROOT_FOLDER } from './../hooks/useFolder';

// const AddFolderBtn = ({ currentFolder }) => {
//     const [open, setOpen] = useState(false);
//     const { currentUser } = useAuth();

//     const createFolder = (name) => {
//         if(name.trim()) {
//             if(!currentFolder) return
//             const path = [...currentFolder.path];

//             if(currentFolder !== ROOT_FOLDER) {
//                 path.push({
//                     name: currentFolder.name,
//                     id: currentFolder.id
//                 });
//             }

//             database.folders.add({
//                 name: name,
//                 parentId: currentFolder.id,
//                 userId: currentUser.uid,
//                 path: path,
//                 createdAt: database.getCurrentTimestamp(),
//             })
//         }

//         setOpen(false);
//     }

//     return (
//         <>
//             <button onClick={() => setOpen(true)} className="flex bg-blue-500 hover:bg-blue-800 justify-center items-center">
//                 <div className="text-white flex items-center px-4 py-1 w-full font-base">
//                     <FolderPlusIcon
//                         className="h-5 w-5 mr-1"
//                         aria-hidden="true"
//                     />
//                     <span>Create Folder</span>
//                 </div>
//             </button>
//             <ConfirmAddFolder open={open} setOpen={setOpen} handleSubmit={createFolder}/>
//         </>
//     );
// };

// export default AddFolderBtn;
import React, { useState } from 'react';
import { FolderPlusIcon } from '@heroicons/react/20/solid';
import ConfirmAddFolder from './modals/ConfirmAddFolder';
import { useAuth } from './../store/AuthStore';
import { database } from '../../firebase'; // Import your Firebase instance
import { ROOT_FOLDER } from './../hooks/useFolder';

const AddFolderBtn = ({ currentFolder }) => {
    const [open, setOpen] = useState(false);
    const { currentUser } = useAuth();

    // Function to create a folder
    const createFolder = async (name) => {
        if (name.trim()) {
            if (!currentFolder) return;

            // Construct the path for the new folder
            const path = [...currentFolder.path];

            if (currentFolder !== ROOT_FOLDER) {
                path.push({
                    name: currentFolder.name,
                    id: currentFolder.id,
                });
            }

            try {
                // Check if a folder with the same name already exists in the current folder
                const existingFolders = await database.folders
                    .where("name", "==", name)
                    .where("parentId", "==", currentFolder.id)
                    .where("userId", "==", currentUser.uid)
                    .get();

                if (!existingFolders.empty) {
                    alert("A folder with this name already exists in the current folder.");
                    return;
                }

                // Add the new folder to Firestore
                await database.folders.add({
                    name: name,
                    parentId: currentFolder.id,
                    userId: currentUser.uid,
                    path: path,
                    createdAt: database.getCurrentTimestamp(),
                });

                setOpen(false); // Close modal after successful creation

            } catch (error) {
                console.error("Error creating folder:", error);
                alert("Error creating folder, please try again.");
            }
        }
    };

    return (
        <>
            {/* Create Folder Button */}
            <button
                onClick={() => setOpen(true)}
                disabled={!currentFolder}  // Disable button if currentFolder is null/undefined
                className={`flex justify-center items-center ${!currentFolder ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-800'}`}
            >
                <div className="text-white flex items-center px-4 py-1 w-full font-base">
                    <FolderPlusIcon
                        className="h-5 w-5 mr-1"
                        aria-hidden="true"
                    />
                    <span>Create Folder</span>
                </div>
            </button>

            {/* Modal to Confirm Folder Creation */}
            <ConfirmAddFolder open={open} setOpen={setOpen} handleSubmit={createFolder} />
        </>
    );
};

export default AddFolderBtn;
