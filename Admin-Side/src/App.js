import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Candidate from "./pages/Candidate";
import Voter from "./pages/Voter";
import ElectionCommission from "./pages/ElectionCommission";
import { toast, Toaster } from "sonner";

function App() {
  const [state, setState] = useState({
    provider: null,
    contract: null,
    signer: null,
  });

  const [info, setInfo] = useState();
  const [pIdEc, setPIdEc] = useState({
    pollId: null,
    EcAddress: null,
  });

  const setinfo = async (data) => {
    setInfo(data);
  };

  const details = async (_pollId, _EcAddress) => {
    setPIdEc({ pollId: _pollId, EcAddress: _EcAddress });
  };

  const wallet = async (provider, contract, signer) => {
    setState({ provider, contract, signer });
    console.log("Wallet Connected:", signer);
  };

  // Define handleCase function
  const handleCase = (data) => {
    if (!data || typeof data !== "string") {
      console.error("Invalid input passed to handleCase:", data);
      return data; // Return the original value if invalid
    }

    // Example: Trim whitespace and capitalize the first letter
    const processedData = data.trim();
    console.log("Handling case:", processedData);
    return processedData;
  };

  const checkLogin = useCallback(() => {
    if (!state.provider || !state.contract || !state.signer) {
      toast.error("Please login again");
      return false;
    }
    return true;
  }, [state]);

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  return (
    <>
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 w-full h-screen overflow-hidden transition-colors duration-700">
        <Router>
          <Routes>
            <Route path="/" element={<Login wallet={wallet} />} />
            <Route
              path="/Dashboard"
              element={
                <Dashboard
                  state={state}
                  info={info}
                  details={details}
                  setinfo={setinfo}
                  pIdEc={pIdEc}
                  handleCase={handleCase} // Pass handleCase as a prop
                />
              }
            />
            <Route
              path="/Candidate"
              element={<Candidate state={state} handleCase={handleCase} />} // Pass handleCase
            />
            <Route
              path="/Voter"
              element={<Voter state={state} handleCase={handleCase} />} // Pass handleCase
            />
            <Route
              path="/ElectionCommission"
              element={<ElectionCommission state={state} />} // No handleCase needed here
            />
          </Routes>
        </Router>
        <Toaster position="top-right" />
      </div>
    </>
  );
}

export default App;



