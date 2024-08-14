import React, { useState } from 'react';
import { getDatabase, ref, get } from "firebase/database"
import db from "../src/firebaseConfig"
import { Link, useNavigate, useParams } from "react-router-dom";


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  let [IdArray, setIdArray] = useState([]);
  let loginBool = false;
  const navigate = useNavigate();
  const fetchData = async () => {
      const dbRef = ref(db, "LoginInfo/User");
      const snapshot = await get(dbRef);
      // settestid(Object(snapshot.val()))
      if(snapshot.exists()) {
          setIdArray(Object.values(snapshot.val()));
          // console.log(Object.values(snapshot.val()))
      } else {
          alert("error");
      }
  }
  fetchData();

  const handleLogin = async (e) => {
    e.preventDefault();
    // Add login logic here
    // console.log('Username:', username);
    // console.log('Password:', password);
    // for (let i = 0; i < IdArray.length; i++) {
    //   if (username === IdArray[i].username) {
    //       console.log("username correct");
    //       if(password === IdArray[i].password) {
    //           console.log("password correct");
    //           alert("login successful");
    //           navigate("/center", { state: IdArray[i].username})
    //           loginBool = true;
    //           console.log("yes")

    //       }
    //   }

    // }
    const dbRef = ref(db, "LoginInfo/User");
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
      const key = childSnapshot.key;
      const data = childSnapshot.val();

      if(data.username === username && data.password === password) {
        alert("Login successful");
        navigate("/center", { state: key})
        loginBool = true;
      }
    })
    }
    

    if (loginBool === false) {
        alert("Username or password incorrect. Try Again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-300 via-blue-300 to-purple-300">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login