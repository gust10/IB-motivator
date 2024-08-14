import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const assignments = [
  { id: 1, title: "Math", progress: 70 },
  { id: 2, title: "Science", progress: 50 },
  { id: 3, title: "History", progress: 90 },
  { id: 4, title: "English", progress: 30 },
  { id: 5, title: "Art", progress: 80 }
];

const Page = () => {
  return (
    <div className="min-h-screen flex bg-gradient-to-r from-green-300 via-blue-300 to-purple-300">
      {/* Left Section */}
      <div className="w-1/3 bg-white p-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Assignment Progress</h2>
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="flex items-center space-x-4">
              <CircularProgressbar
                value={assignment.progress}
                text={`${assignment.progress}%`}
                styles={buildStyles({
                  textSize: '16px',
                  pathColor: `rgba(62, 152, 199, ${assignment.progress / 100})`,
                  textColor: '#3e98c7',
                  trailColor: '#d6d6d6'
                })}
                className="w-16 h-16"
              />
              <span className="text-lg text-gray-700">{assignment.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Section */}
      <div className="w-2/3 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full h-full relative">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 text-center">Avatar Playground</h2>
          <div className="avatar-container w-full h-full border-2 border-dashed border-gray-300 relative overflow-hidden">
            <div className="avatar bg-blue-500 w-12 h-12 rounded-full absolute"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page