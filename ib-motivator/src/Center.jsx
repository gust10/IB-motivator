import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import db from "../src/firebaseConfig"
import { getStorage, getDownloadURL } from 'firebase/storage'
import { Dialog, DialogTitle, Description} from '@headlessui/react';
import ReactDOM from 'react-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { formatDistanceToNow } from 'date-fns';

import { getDatabase, ref, get, onValue, set, update } from "firebase/database"

function Center() {
  const [activeTab, setActiveTab] = useState('main');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const location = useLocation();
  const userid = location.state
  console.log(userid)

  const initialUserData = {
    assignments: {
      Math: [
        {
          name: 'Math IA',
          subject: 'Math',
          progress: 0,
          description: '',
          deadline: new Date('2025-03-15').toISOString(),
        },
        {
          name: 'Physics IA',
          subject: 'Math',
          progress: 0,
          description: '',
          deadline: new Date('2025-03-15').toISOString(),
        },
      ],
      Science: [
        {
          name: 'Music IA',
          subject: 'Science',
          progress: 0,
          description: 'Conduct experiments and document results.',
          deadline: new Date('2025-03-15').toISOString(),
        },
        {
          name: 'Geography IA',
          subject: 'Science',
          progress: 0,
          description: 'Write a report on chemical reactions.',
          deadline: new Date('2025-03-15').toISOString(),
        },
        {
          name: 'LanguageA IA',
          subject: 'Science',
          progress: 0,
          description: 'Write a report on chemical reactions.',
          deadline: new Date('2025-03-15').toISOString(),
        },
        {
          name: 'LanguageB IA',
          subject: 'Science',
          progress: 0,
          description: 'Write a report on chemical reactions.',
          deadline: new Date('2025-03-15').toISOString(),
        },
      ],
    },
  };

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = userid; // Use a dynamic ID here, such as from the auth context
        const userRef = ref(db, `LoginInfo/User/${userId}/data`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          // Convert string dates to Date objects
          for (const subject in data.assignments) {
            data.assignments[subject] = data.assignments[subject].map(assignment => ({
              ...assignment,
              deadline: new Date(assignment.deadline), // Convert to Date object
            }));
          }
          setUserData(data);
        } else {
          // Initialize with default data if none exists
          await set(userRef, initialUserData);
          setUserData(initialUserData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []); // Empty dependency array to run only once

  useEffect(() => {
    if (!userData) return; // Avoid trying to update Firebase with null user data
    const updateUserDataInFirebase = async () => {
      try {
        const userId = userid; // Use a dynamic ID here
        const userRef = ref(db, `LoginInfo/User/${userId}/data`);
        const updatedData = { ...userData };
        // Convert Date objects to strings for Firebase
        for (const subject in updatedData.assignments) {
          updatedData.assignments[subject] = updatedData.assignments[subject].map(assignment => ({
            ...assignment,
            deadline: assignment.deadline, // Convert to ISO string
          }));
        }
        await update(userRef, updatedData);
      } catch (error) {
        console.error('Error updating user data:', error);
      }
    };
    updateUserDataInFirebase();
  }, [userData]); // Trigger update when userData changes

  const allAssignments = userData ? Object.values(userData.assignments).flat() : [];

  const handleAssignmentClick = (assignment) => {
    if (assignment) {
      setSelectedAssignment(assignment);
      setInputValue(assignment.progress.toString());
      setIsDialogOpen(true);
    } else {
      console.warn('Attempted to open dialog for undefined assignment');
    }
  };

  const updateProgress = () => {
    if (!selectedAssignment) return;

    setUserData((prevUserData) => {
      if (!prevUserData) return prevUserData;
      const updatedAssignments = { ...prevUserData.assignments };
      updatedAssignments[selectedAssignment.subject] = updatedAssignments[
        selectedAssignment.subject
      ].map((assignment) =>
        assignment.name === selectedAssignment.name
          ? { ...assignment, progress: parseInt(inputValue), deadline: selectedAssignment.deadline }
          : assignment
      );
      return { ...prevUserData, assignments: updatedAssignments };
    });
    setIsDialogOpen(false);
  };

  const calculateOverallProgress = () => {
    if (allAssignments.length === 0) return 0;
    const totalProgress = allAssignments.reduce((sum, assignment) => sum + assignment.progress, 0);
    return Math.round(totalProgress / allAssignments.length);
  };

  const calculateDaysLeft = (deadline) => {
    if (!deadline) return 'No deadline set';
    const date = new Date(deadline);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'main':
        return (
          <div className="p-4 text-gray-700">
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Overall Progress</h2>
              <div className="w-full bg-gray-300 rounded-full h-6">
                <div
                  className="bg-blue-600 h-6 rounded-full"
                  style={{ width: `${calculateOverallProgress()}%` }}
                ></div>
              </div>
              <p className="text-center mt-2">{calculateOverallProgress()}% Complete</p>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {allAssignments.map((assignment, index) => (
                <div
                  key={index}
                  onClick={() => handleAssignmentClick(assignment)}
                  className="relative flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full shadow-md cursor-pointer"
                >
                  <div
                    style={{
                      background: `conic-gradient(#4a90e2 ${assignment.progress}%, #e5e7eb 0)`,
                    }}
                    className="absolute inset-0 rounded-full"
                  ></div>
                  <span className="relative text-sm font-semibold text-gray-800">
                    {assignment.progress}%
                  </span>
                  <span className="absolute text-xs text-gray-600 bottom-1 text-center">
                    {assignment.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'helpcenter':
        return (
          <div className="p-4 text-gray-700">This is the Help Center section content.</div>
        );
      case 'reports':
        return (
          <div className="p-4 text-gray-700">This is the Reports section content.</div>
        );
      default:
        return <div className="p-4 text-gray-700">This is the Main section content.</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-green-300 via-blue-300 to-purple-300">
      <div className="text-center py-6">
        <h1 className="text-4xl font-bold text-white">IB Motivator</h1>
      </div>
      <div className="flex-grow flex">
        <div className="w-full p-8">
          <div className="bg-white rounded-lg shadow-lg h-full">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-4 p-4">
                <button
                  onClick={() => setActiveTab('main')}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'main' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600'
                  }`}
                >
                  Main
                </button>
                <button
                  onClick={() => setActiveTab('helpcenter')}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'helpcenter'
                      ? 'text-blue-500 border-b-2 border-blue-500'
                      : 'text-gray-600'
                  }`}
                >
                  Help Center
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === 'reports'
                      ? 'text-blue-500 border-b-2 border-blue-500'
                      : 'text-gray-600'
                  }`}
                >
                  Reports
                </button>
              </nav>
            </div>
            <div className="p-4">{renderContent()}</div>
          </div>
        </div>
      </div>
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        className="fixed z-10 inset-0 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="relative bg-white rounded-lg shadow-lg max-w-4xl w-full p-6 flex space-x-6">
            <div className="flex-grow">
              <DialogTitle as="h3" className="text-lg font-medium text-gray-900 mb-2">
                {selectedAssignment?.name || 'No Assignment Selected'}
              </DialogTitle>
              <Description className="text-sm text-gray-600 mb-4">
                {selectedAssignment?.description || 'No Description Available'}
              </Description>
              <p className="text-sm text-gray-700 mb-2">
                Current Deadline:{' '}
                {selectedAssignment?.deadline
                  ? new Date(selectedAssignment.deadline).toDateString()
                  : 'None'}
              </p>
              <p className="text-sm text-gray-700">
                Days Left: {calculateDaysLeft(selectedAssignment?.deadline)}
              </p>
            </div>
            <div className="flex-shrink-0 w-64">
              <label className="block text-gray-700 text-sm font-bold mb-2">Update Progress</label>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="border rounded-lg w-full p-2 mb-4"
              />
              <label className="block text-gray-700 text-sm font-bold mb-2">Set New Deadline</label>
              <DatePicker
                selected={
                  selectedAssignment?.deadline
                    ? new Date(selectedAssignment.deadline)
                    : new Date()
                }
                onChange={(date) =>
                  setSelectedAssignment((prev) => ({ ...prev, deadline: date }))
                }
                className="border rounded-lg w-full p-2 mb-4"
              />
              <button
                onClick={updateProgress}
                className="w-full bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default Center

// const [activeTab, setActiveTab] = useState('main');
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [selectedAssignment, setSelectedAssignment] = useState(null);
//   const [inputValue, setInputValue] = useState('');

//   const location = useLocation();
//   const userid = location.state
//   console.log(userid)

//   const initialUserData = {
//     assignments: {
//       Math: [
//         {
//           name: 'Algebra Homework',
//           subject: 'Math',
//           progress: 0,
//           description: 'Complete the algebra problems in the workbook.',
//           deadline: new Date('2025-03-15').toISOString(), // Convert to ISO string
//         },
//         {
//           name: 'Geometry Project',
//           subject: 'Math',
//           progress: 0,
//           description: 'Create a geometry model.',
//           deadline: new Date('2025-03-15').toISOString(), // Convert to ISO string
//         },
//       ],
//       Science: [
//         {
//           name: 'Physics Lab',
//           subject: 'Science',
//           progress: 0,
//           description: 'Conduct experiments and document results.',
//           deadline: new Date('2025-03-15').toISOString(), // Convert to ISO string
//         },
//         {
//           name: 'Chemistry Assignment',
//           subject: 'Science',
//           progress: 0,
//           description: 'Write a report on chemical reactions.',
//           deadline: new Date('2025-03-15').toISOString(), // Convert to ISO string
//         },
//       ],
//     },
//   };

//   const [userData, setUserData] = useState(initialUserData);


//   useEffect(() => {
//     const updateUserDataInFirebase = async () => {
//       try {
//         const userId = userid;
//         const userRef = ref(db, `LoginInfo/User/${userId}/data`);
//         const updatedData = { ...userData };
//         // Convert Date objects to strings for Firebase
//         for (const subject in updatedData.assignments) {
//           updatedData.assignments[subject] = updatedData.assignments[subject].map(assignment => ({
//             ...assignment,
//             deadline: assignment.deadline, // Convert to ISO string
//           }));
//         }
//         await update(userRef, updatedData);
//       } catch (error) {
//         console.error('Error updating user data:', error);
//       }
//     };
//     updateUserDataInFirebase();
//   }, [userData]);

//   const allAssignments = Object.values(userData.assignments).flat();

//   const handleAssignmentClick = (assignment) => {
//     if (assignment) {
//       setSelectedAssignment(assignment);
//       setInputValue(assignment.progress.toString());
//       setIsDialogOpen(true);
//     } else {
//       console.warn('Attempted to open dialog for undefined assignment');
//     }
//   };

//   const updateProgress = () => {
//     setUserData((prevUserData) => {
//       const updatedAssignments = { ...prevUserData.assignments };
//       updatedAssignments[selectedAssignment.subject] = updatedAssignments[
//         selectedAssignment.subject
//       ].map((assignment) =>
//         assignment.name === selectedAssignment.name
//           ? { ...assignment, progress: parseInt(inputValue), deadline: selectedAssignment.deadline }
//           : assignment
//       );
//       return { ...prevUserData, assignments: updatedAssignments };
//     });
//     setIsDialogOpen(false);
//   };

//   const calculateOverallProgress = () => {
//     if (allAssignments.length === 0) return 0;
//     const totalProgress = allAssignments.reduce((sum, assignment) => sum + assignment.progress, 0);
//     return Math.round(totalProgress / allAssignments.length);
//   };

//   const calculateDaysLeft = (deadline) => {
//     if (!deadline) return 'No deadline set';
//     const date = new Date(deadline);
//     return formatDistanceToNow(date, { addSuffix: true });
//   };

//   const renderContent = () => {
//     switch (activeTab) {
//       case 'main':
//         return (
//           <div className="p-4 text-gray-700">
//             <div className="mb-4">
//               <h2 className="text-lg font-semibold mb-2">Overall Progress</h2>
//               <div className="w-full bg-gray-300 rounded-full h-6">
//                 <div
//                   className="bg-blue-600 h-6 rounded-full"
//                   style={{ width: `${calculateOverallProgress()}%` }}
//                 ></div>
//               </div>
//               <p className="text-center mt-2">{calculateOverallProgress()}% Complete</p>
//             </div>
//             <div className="grid grid-cols-3 gap-4 mb-6">
//               {allAssignments.map((assignment, index) => (
//                 <div
//                   key={index}
//                   onClick={() => handleAssignmentClick(assignment)}
//                   className="relative flex items-center justify-center w-24 h-24 bg-blue-100 rounded-full shadow-md cursor-pointer"
//                 >
//                   <div
//                     style={{
//                       background: `conic-gradient(#4a90e2 ${assignment.progress}%, #e5e7eb 0)`,
//                     }}
//                     className="absolute inset-0 rounded-full"
//                   ></div>
//                   <span className="relative text-sm font-semibold text-gray-800">
//                     {assignment.progress}%
//                   </span>
//                   <span className="absolute text-xs text-gray-600 bottom-1 text-center">
//                     {assignment.name}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         );
//       case 'helpcenter':
//         return (
//           <div className="p-4 text-gray-700">This is the Help Center section content.</div>
//         );
//       case 'reports':
//         return (
//           <div className="p-4 text-gray-700">This is the Reports section content.</div>
//         );
//       default:
//         return <div className="p-4 text-gray-700">This is the Main section content.</div>;
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-r from-green-300 via-blue-300 to-purple-300">
//       <div className="text-center py-6">
//         <h1 className="text-4xl font-bold text-white">IB Motivator</h1>
//       </div>
//       <div className="flex-grow flex">
//         <div className="w-full p-8">
//           <div className="bg-white rounded-lg shadow-lg h-full">
//             <div className="border-b border-gray-200">
//               <nav className="flex space-x-4 p-4">
//                 <button
//                   onClick={() => setActiveTab('main')}
//                   className={`px-4 py-2 text-sm font-medium ${
//                     activeTab === 'main' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600'
//                   }`}
//                 >
//                   Main
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('helpcenter')}
//                   className={`px-4 py-2 text-sm font-medium ${
//                     activeTab === 'helpcenter'
//                       ? 'text-blue-500 border-b-2 border-blue-500'
//                       : 'text-gray-600'
//                   }`}
//                 >
//                   Help Center
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('reports')}
//                   className={`px-4 py-2 text-sm font-medium ${
//                     activeTab === 'reports' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600'
//                   }`}
//                 >
//                   Reports
//                 </button>
//               </nav>
//             </div>
//             <div className="p-6">{renderContent()}</div>
//           </div>
//         </div>
//       </div>
//       <Dialog
//         open={isDialogOpen}
//         onClose={() => setIsDialogOpen(false)}
//         className="fixed z-10 inset-0 overflow-y-auto"
//       >
//         <div className="flex items-center justify-center min-h-screen px-4">
          
//           <div className="relative bg-white rounded-lg shadow-lg max-w-4xl w-full p-6 flex space-x-6">
//             <div className="flex-grow">
//               <DialogTitle as="h3" className="text-lg font-medium text-gray-900 mb-2">
//                 {selectedAssignment?.name || 'No Assignment Selected'}
//               </DialogTitle>
//               <Description className="text-sm text-gray-600 mb-4">
//                 {selectedAssignment?.description || 'No Description Available'}
//               </Description>
//               <p className="text-sm text-gray-700 mb-2">
//                 Current Deadline: {selectedAssignment?.deadline ? new Date(selectedAssignment?.deadline).toDateString() : 'None'}
//               </p>
//               <p className="text-sm text-gray-700">
//                 Days Left: {calculateDaysLeft(selectedAssignment?.deadline)}
//               </p>
//             </div>
//             <div className="flex-shrink-0 w-64">
//               <label className="block text-gray-700 text-sm font-bold mb-2">Update Progress</label>
//               <input
//                 type="number"
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 className="border rounded-lg w-full p-2 mb-4"
//               />
//               <label className="block text-gray-700 text-sm font-bold mb-2">Set New Deadline</label>
//               <DatePicker
//                 selected={selectedAssignment?.deadline ? new Date(selectedAssignment?.deadline) : new Date()}
//                 onChange={(date) =>
//                   setSelectedAssignment((prev) => ({ ...prev, deadline: date }))
//                 }
//                 className="border rounded-lg w-full p-2 mb-4"
//               />
//               <button
//                 onClick={updateProgress}
//                 className="w-full bg-blue-500 text-white rounded-lg py-2 hover:bg-blue-600"
//               >
//                 Save Changes
//               </button>
//             </div>
//           </div>
//         </div>
//       </Dialog>
//     </div>
//   );