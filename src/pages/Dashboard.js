// import React from 'react';
// import StorageNavBar from '../components/storage/StorageNavBar';
// import { useFolder } from './../components/hooks/useFolder';
// import Folder from './../components/storage/Folder';
// import File from './../components/storage/File';
// import { useParams } from "react-router-dom";
// import FolderBreadcumps from './../components/storage/FolderBreadcumps';
// import { getStorage, ref, deleteObject} from "firebase/storage";
// import { useAuth } from '../components/store/AuthStore';
// import { database } from '../firebase'; // Import database from firebase.js
// import { collection, addDoc } from 'firebase/firestore'; // Import Firestore methods
// import { getDownloadURL } from 'firebase/storage'; // Import for getting download URL

// const Dashboard = () => {
//     const { id } = useParams();
//     const { folder, childFolders, childFiles } = useFolder(id);
//     const { currentUser } = useAuth();

//     const deleteFolder = async (folder) => {
//         const storage = getStorage();
//         const currentPath = folder.path.map(u => u.name).join('/');
//         const desertRef = ref(storage, currentPath ? 
//             `files/${currentUser.uid}/${currentPath}/${folder.name}` : 
//             `files/${currentUser.uid}/${folder.name}`);

//         // Deleting the folder from Firestore
//         await database.folders.doc(folder.id).delete();

//         deleteObject(desertRef).then(() => {
//             alert("Folder deleted successfully");
//         }).catch((error) => {
//             console.error("Error deleting folder:", error);
//         });
//     };

//     const deleteFile = async (file) => {
//         const storage = getStorage();
//         const currentPath = folder.path.map(u => u.name).join('/');
//         const desertRef = ref(storage, currentPath ? 
//             `files/${currentUser.uid}/${currentPath}/${file.name}` : 
//             `files/${currentUser.uid}/${file.name}`);

//         // Deleting the file from Firestore
//         await database.files.doc(file.id).delete();

//         deleteObject(desertRef).then(() => {
//             alert("File deleted successfully");
//         }).catch((error) => {
//             console.error("Error deleting file:", error);
//         });
//     };

//     // Updated shareFile function to handle missing file error
//     const shareFile = async (file) => {
//         const storage = getStorage();
    
//         // Construct the current path for the file
//         const currentPath = folder.path.map(u => u.name).join('/');
//         const fileRef = ref(storage, currentPath ? 
//             `files/${currentUser.uid}/${currentPath}/${file.name}` : 
//             `files/${currentUser.uid}/${file.name}`);
    
//         console.log('Sharing File:', file.name); // Log file name
//         console.log('Current Path:', currentPath); // Log current path
//         console.log('File Reference:', fileRef.toString()); // Log file reference for debugging
    
//         try {
//             // Check if the file exists
//             //const metadata = await getMetadata(fileRef);
    
//             // If the file exists, generate the download URL
//             const url = await getDownloadURL(fileRef);
    
//             // Define expiration time (e.g., 24 hours from now)
//             const expirationDate = new Date();
//             expirationDate.setHours(expirationDate.getHours() + 24); // Set expiration time to 24 hours
    
//             // Store the URL and expiration date in Firestore
//             await addDoc(collection(database.folders.firestore, 'sharedLinks'), {
//                 fileName: file.name,
//                 url: url,
//                 expiration: expirationDate,
//                 ownerId: currentUser.uid
//             });
    
//             // Copy the link to the clipboard
//             await navigator.clipboard.writeText(url);
    
//             // Notify user that the link has been copied
//             alert(`File shared successfully! The link has been copied to your clipboard.\nThe link will expire on ${expirationDate}`);
//         } catch (error) {
//             // If the file doesn't exist, catch the error
//             if (error.code === 'storage/object-not-found') {
//                 alert("Error: The file you're trying to share does not exist.");
//             } else {
//                 console.error("Error sharing file:", error);
//                 alert(`Error sharing file: ${error.message}`);
//             }
//         }
//     };
    

//     return (
//         <div className="container mx-auto">
//             <div>
//                 <FolderBreadcumps currentFolder={folder} />
//             </div>
//             <div>
//                 <StorageNavBar currentFolder={folder} />
//             </div>
//             <div className="mt-6 border p-2"
//                 style={{ maxHeight: window.innerHeight - 300, height: window.innerHeight - 300 }}
//             >
//                 {childFolders.length > 0 && (
//                     <div>
//                         {childFolders.map(childFolder => (
//                             <div
//                                 className="border-b p-1 hover:bg-slate-100 flex justify-between"
//                                 key={childFolder.id}>
//                                 <Folder folder={childFolder} />
//                                 <button 
//                                     className="text-red-600 hover:text-red-800"
//                                     onClick={() => deleteFolder(childFolder)}>
//                                     Delete
//                                 </button>
//                             </div>
//                         ))}
//                     </div>
//                 )}

//                 {childFolders.length > 0 && childFiles.length > 0 && <hr />}
//                 {childFiles.length > 0 && (
//                     <div>
//                         {childFiles.map(file => (
//                             <div className="border-b p-1 hover:bg-slate-100 flex justify-between" key={file.id}>
//                                 <File file={file} />
                    
//                                 <button
//                                     className="text-blue-600 hover:text-blue-800"
//                                     onClick={() => shareFile(file)}>
//                                     Share
//                                 </button>
//                                 <button 
//                                     className="text-red-600 hover:text-red-800"
//                                     onClick={() => deleteFile(file)}>
//                                     Delete
//                                 </button>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Dashboard;
import React from 'react';
import StorageNavBar from '../components/storage/StorageNavBar';
import { useFolder } from './../components/hooks/useFolder';
import Folder from './../components/storage/Folder';
import File from './../components/storage/File';
import { useParams } from "react-router-dom";
import FolderBreadcumps from './../components/storage/FolderBreadcumps';
import { getStorage, ref, listAll, deleteObject } from "firebase/storage"; // Added listAll
import { useAuth } from '../components/store/AuthStore';
import { database } from '../firebase'; // Import Firestore instance
import { collection, addDoc } from 'firebase/firestore'; // Firestore methods
import { getDownloadURL } from 'firebase/storage'; // For generating download URL

const Dashboard = () => {
    const { id } = useParams();
    const { folder, childFolders, childFiles } = useFolder(id);
    const { currentUser } = useAuth();

    // Function to delete folder and its files
    const deleteFolder = async (folder) => {
        const storage = getStorage();
        const currentPath = folder.path.map(u => u.name).join('/');
        const folderRef = ref(storage, currentPath ? 
            `files/${currentUser.uid}/${currentPath}/${folder.name}` : 
            `files/${currentUser.uid}/${folder.name}`);

        // Step 1: List all files inside the folder and delete them
        try {
            const folderContents = await listAll(folderRef);

            // Step 2: Delete each file inside the folder
            const deletePromises = folderContents.items.map((itemRef) => {
                return deleteObject(itemRef);
            });
            await Promise.all(deletePromises);

            // Step 3: Delete the folder metadata from Firestore
            await database.folders.doc(folder.id).delete();

            alert("Folder and all its contents deleted successfully.");
        } catch (error) {
            if (error.code === 'storage/object-not-found') {
                console.error("Folder not found in Firebase Storage.");
                // Still delete the folder metadata in Firestore if it's not found in storage
                await database.folders.doc(folder.id).delete();
                alert("Folder metadata deleted successfully, but folder didn't exist in Firebase Storage.");
            } else {
                console.error("Error deleting folder:", error);
                alert("Error deleting folder, please try again.");
            }
        }
    };

    const deleteFile = async (file) => {
        const storage = getStorage();
        const currentPath = folder.path.map(u => u.name).join('/');
        const fileRef = ref(storage, currentPath ? 
            `files/${currentUser.uid}/${currentPath}/${file.name}` : 
            `files/${currentUser.uid}/${file.name}`);

        try {
            // Deleting the file from Firestore
            await database.files.doc(file.id).delete();

            // Deleting the file from Firebase Storage
            await deleteObject(fileRef);

            alert("File deleted successfully.");
        } catch (error) {
            console.error("Error deleting file:", error);
            alert("Error deleting file, please try again.");
        }
    };

    // Updated shareFile function to handle missing file error
    const shareFile = async (file) => {
        const storage = getStorage();
        const currentPath = folder.path.map(u => u.name).join('/');
        const fileRef = ref(storage, currentPath ? 
            `files/${currentUser.uid}/${currentPath}/${file.name}` : 
            `files/${currentUser.uid}/${file.name}`);

        try {
            // Generate the download URL
            const url = await getDownloadURL(fileRef);

            // Define expiration time (e.g., 24 hours from now)
            const expirationDate = new Date();
            expirationDate.setHours(expirationDate.getHours() + 24);

            // Store the URL and expiration date in Firestore
            await addDoc(collection(database.folders.firestore, 'sharedLinks'), {
                fileName: file.name,
                url: url,
                expiration: expirationDate,
                ownerId: currentUser.uid
            });

            // Copy the link to the clipboard
            await navigator.clipboard.writeText(url);

            alert(`File shared successfully! The link has been copied to your clipboard.\nThe link will expire on ${expirationDate}`);
        } catch (error) {
            if (error.code === 'storage/object-not-found') {
                alert("Error: The file you're trying to share does not exist.");
            } else {
                console.error("Error sharing file:", error);
                alert(`Error sharing file: ${error.message}`);
            }
        }
    };

    return (
        <div className="container mx-auto">
            <div>
                <FolderBreadcumps currentFolder={folder} />
            </div>
            <div>
                <StorageNavBar currentFolder={folder} />
            </div>
            <div className="mt-6 border p-2"
                style={{ maxHeight: window.innerHeight - 300, height: window.innerHeight - 300 }}
            >
                {childFolders.length > 0 && (
                    <div>
                        {childFolders.map(childFolder => (
                            <div
                                className="border-b p-1 hover:bg-slate-100 flex justify-between"
                                key={childFolder.id}>
                                <Folder folder={childFolder} />
                                <button 
                                    className="text-red-600 hover:text-red-800"
                                    onClick={() => deleteFolder(childFolder)}>
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {childFolders.length > 0 && childFiles.length > 0 && <hr />}
                {childFiles.length > 0 && (
                    <div>
                        {childFiles.map(file => (
                            <div className="border-b p-1 hover:bg-slate-100 flex justify-between" key={file.id}>
                                <File file={file} />
                    
                                <button
                                    className="text-blue-600 hover:text-blue-800"
                                    onClick={() => shareFile(file)}>
                                    Share
                                </button>
                                <button 
                                    className="text-red-600 hover:text-red-800"
                                    onClick={() => deleteFile(file)}>
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
