import React, { useEffect, useCallback, useState } from "react";
import Navigation from "./Navigation";
import { createClient, cacheExchange, fetchExchange } from "@urql/core";

const Dashboard = ({ state, info, details, pIdEc, setinfo }) => {
  const [loading, setLoading] = useState(true);
  const [electionStatus, setElectionStatus] = useState("ended");
  const queryUrl = "https://api.studio.thegraph.com/query/55899/testing/version/latest";
  const query = `{
    ecWinners(first: 10, where: {_electionCommission: "${pIdEc.EcAddress}"}) {
      id
      _info_pollId
      _info_winnerName
      _info_partyName
      _electionCommission
    }
    candidates(first: 100, where: {_pollId: "${pIdEc.pollId}"}) {
      id
      _name
      _party
    }
  }`;

  const client = createClient({
    url: queryUrl,
    exchanges: [cacheExchange, fetchExchange],
  });

  const getPidEc = useCallback(async () => {
    try {
      const pollId = Number(await state.contract.nextPollId());
      const electionCommission = await state.contract.electionCommission();
      details(pollId, electionCommission);
    } catch (error) {
      console.error("Error fetching poll details:", error);
    }
  }, [state.contract, details]);

  const setifo = useCallback(async () => {
    try {
      const { data } = await client.query(query).toPromise();
      if (!data || (!data.ecWinners?.length && !data.candidates?.length)) {
        console.warn("No data fetched from The Graph or data is empty");
        setinfo({ ecWinners: [], candidates: [] }); // Set empty data to avoid indefinite loading
        setLoading(false);
        return;
      }
      console.log("Fetched Data from The Graph:", data);
      setinfo(data);
      setLoading(false);
    } catch (error) {
      if (error.message.includes("429")) {
        console.error("Rate limit exceeded. Retrying in 5 seconds...");
        setTimeout(setifo, 5000); // Retry after 5 seconds
      } else {
        console.error("Error fetching data:", error);
        setLoading(false); // Ensure loading state is cleared even on error
      }
    }
  }, [client, setinfo, query]);

  useEffect(() => {
    if (state.contract) {
      console.log("Contract is initialized:", state.contract);
      getPidEc();
      setifo();
    } else {
      console.warn("Contract is not initialized yet");
    }
  }, [state.contract, getPidEc, setifo]);

  useEffect(() => {
    const currentTime = new Date().getTime();
    const pollEndTime = new Date("2025-01-04T21:12:13").getTime();
    setElectionStatus(currentTime < pollEndTime ? "ongoing" : "ended");
  }, []);

  return (
    <div className="flex">
      <Navigation />
      <div className="flex-1 p-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 min-h-screen">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-200 tracking-wide">
            Dashboard
          </h1>
          <div
            className={`w-6 h-6 rounded-full ${
              electionStatus === "ongoing" ? "bg-red-500 animate-pulse-in-out" : "bg-gray-500"
            }`}
            title={electionStatus === "ongoing" ? "Election Ongoing" : "Election Ended"}
          ></div>
        </div>
        {loading ? (
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {/* Registered Candidates */}
            <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 tracking-wide">
                Registered Candidates
              </h2>
              {info?.candidates?.length > 0 ? (
                <ul className="space-y-4">
                  {info.candidates.map((candidate, index) => (
                    <li
                      key={index}
                      className="p-4 bg-gray-100 rounded-lg dark:bg-gray-700"
                    >
                      <p className="text-gray-800 dark:text-gray-200">
                        <strong>Name:</strong> {candidate._name}
                      </p>
                      <p className="text-gray-800 dark:text-gray-200">
                        <strong>Party:</strong> {candidate._party}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  Candidates have not registered yet !!
                </p>
              )}
            </div>

            {/* Winner */}
            <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 tracking-wide">
                Winner
              </h2>
              {info?.ecWinners?.length > 0 ? (
                <div>
                  <p className="text-gray-800 dark:text-gray-200">
                    <strong>Name:</strong> {info.ecWinners[0]._info_winnerName}
                  </p>
                  <p className="text-gray-800 dark:text-gray-200">
                    <strong>Party:</strong> {info.ecWinners[0]._info_partyName}
                  </p>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  No winner declared yet!
                </p>
              )}
            </div>

            {/* Election Status */}
            <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 tracking-wide">
                Election Status
              </h2>
              <p className="text-gray-800 dark:text-gray-200">
                <strong>Poll Start:</strong> 1/4/2025, 10:49:49 PM
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                <strong>Poll End:</strong> 1/4/2025, 10:59:49 PM
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                <strong>Current Time:</strong> 1/4/2025, 11:23:08 PM
              </p>
              <p
                className={`font-bold mt-4 ${
                  electionStatus === "ongoing"
                    ? "text-green-500"
                    : "text-red-500 dark:text-red-400"
                }`}
              >
                {electionStatus === "ongoing" ? "Voting is ongoing" : "Voting has ended"}
              </p>
            </div>

            {/* User Status */}
            <div className="p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 tracking-wide">
                User Status
              </h2>
              <p className="text-gray-800 dark:text-gray-200">
                <strong>Registered:</strong> Voter registered
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                <strong>Voter ID:</strong> 1
              </p>
              <p className="text-gray-800 dark:text-gray-200">
                <strong>Voted:</strong> Not Voted
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;