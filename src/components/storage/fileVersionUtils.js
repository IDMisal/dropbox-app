import { collection, query, where, getDocs } from 'firebase/firestore';
import { database } from '../../firebase'; // Adjust the path if necessary

// Fetch file versions from Firestore based on file name and user
export const fetchFileVersions = async (fileName, currentUser) => {
    try {
        const q = query(
            collection(database, 'fileVersions'),
            where('fileName', '==', fileName),
            where('userId', '==', currentUser.uid)
        );

        const querySnapshot = await getDocs(q);
        const versions = [];

        querySnapshot.forEach((doc) => {
            versions.push({
                versionId: doc.id,
                ...doc.data()
            });
        });

        return versions;
    } catch (error) {
        console.error('Error fetching file versions:', error);
        return [];
    }
};
