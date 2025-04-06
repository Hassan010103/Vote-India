import React from 'react'
import Navigation from "./Navigation"
import { toast } from 'sonner';

const Candidate = ({ state, handleCase }) => {

  const handleInfo = async (event) => {
    event.preventDefault();

    const candidatesInfo = {
      name: handleCase(document.querySelector("#name").value),
      party: document.querySelector("#party").value.toUpperCase(),
      age: parseInt(document.querySelector("#age").value, 10),
      gender: handleCase(document.querySelector("#gender").value),
    };

    if (!candidatesInfo.name || !candidatesInfo.party || isNaN(candidatesInfo.age) || !candidatesInfo.gender) {
      toast.error("Please fill out all fields correctly");
      return;
    }

    try {
      const votingStarted = await state.contract.votingStarted();
      if (!votingStarted) {
        toast.error("Voting has not started. Please start a new voting poll.");
        return;
      }

      const tx = await state.contract.candidateRegister.send(
        candidatesInfo.name,
        candidatesInfo.party,
        candidatesInfo.age,
        candidatesInfo.gender
      );
      console.log("Transaction Receipt:", tx);
      toast.success(`Candidate ${candidatesInfo.name} registered successfully`);

      // Fetch and log the updated list of candidates
      const candidates = await state.contract.getCandidates(); // Replace with your contract's method to fetch candidates
      console.log("Updated Candidates List from Smart Contract:", candidates);
    } catch (error) {
      console.error("Error during candidate registration:", error);
      toast.error(error.reason || "An error occurred during candidate registration");
    }
  };

  return (
    <div className="flex h-[100%] space-x-32">
      <Navigation />
      <div className="w-[60%] h-[70%]">
        <div className="flex flex-col justify-center items-center mt-[10%]">
          <h1 className="mb-10 tracking-wide text-gray-600 dark:text-gray-400 text-2xl">Candidate Registration</h1>

          {/* Forms starts */}
          <form className="grid grid-rows-2 grid-flow-col gap-7" onSubmit={handleInfo}>
            <div className='grid grid-rows-4 grid-flow-col gap-10'>

              <div className="w-[100%] col-span-10 rounded-3xl p-px bg-gradient-to-b from-blue-300 to-pink-300 dark:from-blue-800 dark:to-purple-800 transition-all duration-700 hover:shadow-[0_3px_10px_rgb(0.4,0.4,0.4,0.4)] dark:hover:shadow-cyan-500/50">
                <input className="rounded-[calc(1.5rem-1px)] p-6 w-[100%] bg-white dark:bg-gray-900 dark:text-slate-200 h-10" placeholder="Enter name" name="" id="name"></input>
              </div>

              <div className="w-[100%] col-span-10 rounded-3xl p-px bg-gradient-to-b from-blue-300 to-pink-300 dark:from-blue-800 dark:to-purple-800 transition-all duration-700 hover:shadow-[0_3px_10px_rgb(0.4,0.4,0.4,0.4)] dark:hover:shadow-cyan-500/50">
                <input className="rounded-[calc(1.5rem-1px)] p-6 w-[100%] bg-white dark:bg-gray-900 dark:text-slate-200 h-10" placeholder="Enter party" name="" id="party"></input>
              </div>

              <div className="w-[100%] col-span-10 rounded-3xl p-px bg-gradient-to-b from-blue-300 to-pink-300 dark:from-blue-800 dark:to-purple-800 transition-all duration-700 hover:shadow-[0_3px_10px_rgb(0.4,0.4,0.4,0.4)] dark:hover:shadow-cyan-500/50">
                <input className="rounded-[calc(1.5rem-1px)] p-6 w-[100%] bg-white dark:bg-gray-900 dark:text-slate-200 h-10" placeholder="Enter age" name="" id="age"></input>
              </div>

              <div className="w-[100%] col-span-10 rounded-3xl p-px bg-gradient-to-b from-blue-300 to-pink-300 dark:from-blue-800 dark:to-purple-800 transition-all duration-700 hover:shadow-[0_3px_10px_rgb(0.4,0.4,0.4,0.4)] dark:hover:shadow-cyan-500/50">
                <input className="rounded-[calc(1.5rem-1px)] p-6 w-[100%] bg-white dark:bg-gray-900 dark:text-slate-200 h-10" placeholder="Enter gender" name="" id="gender"></input>
              </div>

            </div>

            <div className='w-[100%] rounded-3xl p-px'>
              <button className="relative inline-flex ml-32 items-center justify-center p-0.5 rounded-full mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 transition-all duration-200 shadow-[0_3px_10px_rgb(0.4,0.4,0.4,0.4)]" type='submit'>
                <span className="relative px-5 py-2.5 transition-all rounded-calc(1.5rem-1px) ease-in-out duration-700 bg-white dark:bg-gray-900 rounded-full group-hover:bg-opacity-0">
                  Register
                </span>
              </button>
            </div>

          </form>
          {/* Form ends */}

        </div>
      </div>
    </div>
  )
}

export default Candidate