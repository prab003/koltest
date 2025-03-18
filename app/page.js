"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { signUpWithEmail, loginWithEmail, logout } from "@/lib/auth";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [modules, setModules] = useState([]); // Store modules data
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let currentUser;
      if (isLogin) {
        currentUser = await loginWithEmail(email, password);
      } else {
        currentUser = await signUpWithEmail(email, password);
      }
      setUser(currentUser);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setModules([]); // Clear modules on logout
  };

  // Fetch modules directly from Firestore
  const fetchModules = async () => {
    setLoading(true);
    try {
      const modulesRef = collection(db, "modules");
      const snapshot = await getDocs(modulesRef);

      let fetchedModules = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        fetchedModules.push({
          id: doc.id,
          addedOn: data.addedOn?.toDate() || new Date(),
          language: data.language,
          name: data.name,
          questionsOrder: data.questionsOrder,
        });
      });

      setModules(fetchedModules);
    } catch (err) {
      setError("Error fetching modules");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchModules();
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center mt-10">
      {user ? (
        <div className="text-center">
          <p>Welcome, {user.email}</p>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white p-2 rounded mt-4"
          >
            Logout
          </button>

          <div className="mt-6">
            <h2 className="text-lg font-semibold">Modules</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <ul className="mt-2">
                {modules.map((module) => (
                  <li key={module.id} className="border p-2 my-1">
                    <strong>{module.name}</strong> ({module.language}) -{" "}
                    {new Date(module.addedOn).toLocaleString()}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleAuth} className="flex flex-col space-y-4 w-96">
          {error && <p className="text-red-500">{error}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            {isLogin ? "Login" : "Sign Up"}
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500"
          >
            {isLogin ? "Create an account" : "Already have an account? Login"}
          </button>
        </form>
      )}
    </div>
  );
}
