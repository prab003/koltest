"use client";

import { useState, useEffect } from "react";
import { auth } from "../../lib/firebase";

const Page = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModules = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) {
          setError("User not authenticated");
          return;
        }

        const token = await user.getIdToken(); // Get Firebase Auth token

        const response = await fetch("/api/modules", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch modules");
        }

        const fetchedModules = await response.json();
        setModules(fetchedModules.modules);
      } catch (err) {
        setError("Error fetching modules");
      }
      setLoading(false);
    };
    fetchModules();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Modules</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && modules.length === 0 && <p>No modules found</p>}

      {!loading && !error && (
        <ul className="mt-4 space-y-2">
          {modules.map((module) => (
            <li key={module.id} className="border p-4 rounded-lg shadow">
              <strong>{module.name}</strong> ({module.language}) -{" "}
              {module.addedOn
                ? new Date(module.addedOn).toLocaleString()
                : "No date"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Page;
