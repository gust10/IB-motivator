import { useState } from 'react'
import './App.css'
import { Link } from 'react-router-dom'


function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-300 via-blue-300 to-purple-300 text-white">
      {/* Header */}
      <header className="absolute top-0 right-0 p-4">
        <Link to={'/login'}>
          <button className="bg-white text-purple-700 hover:bg-gray-100 py-2 px-4 rounded-full mr-2">
            Login
          </button>
        </Link>
        <Link to={'/register'}>
          <button className="bg-white text-purple-700 hover:bg-gray-100 py-2 px-4 rounded-full">
            Register
          </button>
        </Link>
        
      </header>

      {/* Main Content */}
      <main className="text-center px-6">
        <h1 className="text-5xl font-bold mb-4">IB Motivator</h1>
        <h2 className="text-2xl font-semibold mb-6">Let us help you survive IB!</h2>
        <p className="text-lg mb-10">
          Website designed by IB students to help you organize and complete all IB assignments smoothly.
        </p>
        <Link to={'/register'}>
          <button className="bg-purple-600 hover:bg-purple-800 text-white py-3 px-6 rounded-full text-lg shadow-lg transition duration-300">
            Get Started
          </button>
        </Link>
        
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 text-center p-4">
        <p className="text-sm">&copy; 2024 IB Motivator. All rights reserved.</p>
      </footer>
    </div>
  );

}

export default App

// {/* <>
//       <div className="min-h-screen flex flex-col bg-white text-gray-800">
//       {/* Header */}
//       <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 shadow-lg">
//         <div className="container mx-auto flex justify-between items-center">
//           <h1 className="text-3xl font-bold">IB Motivator</h1>
//           <div>
//             <Link to={'/login'}>
//             <button className="bg-white text-blue-600 font-semibold py-2 px-4 rounded-full mr-2 hover:bg-gray-200 transition">
//               Login
//             </button>
//             </Link>
//             <Link to={'/register'}>
//             <button className="bg-white text-purple-600 font-semibold py-2 px-4 rounded-full hover:bg-gray-200 transition">
//               Register
//             </button>
//             </Link>
//           </div>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section id="home" className="flex-1 flex items-center justify-center text-center p-8 bg-gradient-to-r from-green-300 via-blue-300 to-purple-300">
//         <div>
//           <h2 className="text-4xl md:text-6xl font-bold mb-4 text-gray-900">IB Motivator</h2>
//           <p className="text-xl md:text-2xl mb-8 text-gray-700">
//             A tool that helps track your progress in IB and makes assignment management easy.
//           </p>
//           <a href="#about" className="bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition">
//             Learn More
//           </a>
//         </div>
//       </section>

//       {/* About Section */}
//       <section id="about" className="py-12 bg-gray-50">
//         <div className="container mx-auto text-center">
//           <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">About IB Motivator</h2>
//           <p className="text-lg md:text-xl text-gray-700">
//             IB Motivator is designed to streamline your IB journey by providing tools to track your progress, manage assignments efficiently, and stay organized. Our goal is to help you succeed with less stress and more clarity.
//           </p>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer id="contact" className="bg-gradient-to-r from-purple-600 to-blue-500 text-white p-4 mt-auto shadow-lg">
//         <div className="container mx-auto text-center">
//           <p>&copy; 2024 IB Motivator. All rights reserved.</p>
//           <div className="mt-4">
//             <a href="#" className="text-white mx-2 hover:underline">Privacy Policy</a>
//             <a href="#" className="text-white mx-2 hover:underline">Terms of Service</a>
//           </div>
//         </div>
//       </footer>
//     </div>
//     </> */}