import React, { useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './transitions.css'; // Import the CSS for transitions
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Select from 'react-select'


const options = [
  {value: "languagea", label: "Language A"},
  {value: "languageb", label: "Language B"},
  {value: "geography", label: "Geography"},
  {value: "physics", label: "Physics"},
  {value: "mathematics", label: "Mathematics"},
  {value: "music", label: "Music"}
]

const questions = [
  "Choose your subject",
  "Choose your avatar"
];

const Survey = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(""));

  const location = useLocation();
  const userid = location.state
  console.log(userid)
  const navigate = useNavigate()

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      alert("Survey completed!");
      navigate("/center", { state: userid})
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleChange = (e) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = e.target.value;
    setAnswers(newAnswers);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-300 via-blue-300 to-purple-300">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Survey</h2>
        <TransitionGroup>
          <CSSTransition
            key={currentQuestion}
            timeout={300}
            classNames="fade"
          >
            <div>
              <p className="text-lg text-gray-700 mb-4">{questions[currentQuestion]}</p>
              <Select options={options} isMulti={true}/>
            </div>
          </CSSTransition>
        </TransitionGroup>
        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${currentQuestion === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`}
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Survey