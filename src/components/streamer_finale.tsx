import { useEffect, useState, useContext } from "react";
import { BACKEND, SocketContext } from "../utils.tsx";

const GOAL_SCORE = 1000;

interface FeedEvent {
  id: string; // Unique ID for the fade-out timeout
  username: string;
  team: string;
  question: string;
  correct: boolean;
}

function StreamerFinale() {
  const socket = useContext(SocketContext);
  const [teamScores, setTeamScores] = useState({ red: 0, blue: 0 });
  const [feed, setFeed] = useState<FeedEvent[]>([]);

  useEffect(() => {
    // 1. Listen for score updates
    const handleScoreUpdate = (data: any) => {
      setTeamScores({ red: data.red_modifier, blue: data.blue_modifier });
    };

    // 2. Listen for live feed events
    const handleFeedEvent = (data: {
      username: string;
      team: string;
      question: string;
      correct: boolean;
    }) => {
      const eventId = Math.random().toString(36).substring(7);

      // Just drop it straight into the feed
      const newEvent = { ...data, id: eventId };
      setFeed((prev) => [newEvent, ...prev].slice(0, 8));

      // The Cleanup: Auto-remove after 4.5 seconds
      setTimeout(() => {
        setFeed((currentFeed) => currentFeed.filter((item) => item.id !== eventId));
      }, 4500);
    };

    socket.on("team_score_update", handleScoreUpdate);
    socket.on("finale_feed_event", handleFeedEvent);

    return () => {
      socket.off("team_score_update", handleScoreUpdate);
      socket.off("finale_feed_event", handleFeedEvent);
    };
  }, [socket]);

  // Secret Streamer Controls (Invisible buttons)
  const injectSecretPoints = (team: "red" | "blue") => {
    fetch(BACKEND + "/secret_finale_points", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ team: team, amount: 50 }), // Adds 50 points silently
    }).catch(console.error);
  };

  const redPercent = Math.min(100, Math.max(0, (teamScores.red / GOAL_SCORE) * 100));
  const bluePercent = Math.min(100, Math.max(0, (teamScores.blue / GOAL_SCORE) * 100));

  return (
    <div className="flex flex-col items-center h-screen w-screen bg-gray-900 pt-24 overflow-hidden relative">
      {/* --- INVISIBLE CHEAT BUTTONS --- */}
      <div
        className="absolute bottom-0 left-0 w-32 h-32 cursor-pointer opacity-0 z-50"
        onClick={() => injectSecretPoints("blue")}
        title="Secretly boost FBI"
      />
      <div
        className="absolute bottom-0 right-0 w-32 h-32 cursor-pointer opacity-0 z-50"
        onClick={() => injectSecretPoints("red")}
        title="Secretly boost Mafia"
      />

      <h1 className="text-5xl font-black text-white mb-8 tracking-widest animate-pulse">
        FINAL SHOWDOWN
      </h1>

      {/* --- PROGRESS BARS --- */}
      <div className="w-full max-w-7xl bg-gray-800 rounded-2xl shadow-2xl p-8 mb-10 border-4 border-gray-700">
        <div className="flex w-full gap-8 items-end">
          {/* FBI / Blue Team */}
          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <span className="font-bold text-blue-400 text-3xl">POLICE / RA</span>
              <span className="font-bold text-blue-400 text-3xl">{teamScores.blue}</span>
            </div>
            <div className="w-full bg-gray-900 rounded-full h-12 border-4 border-gray-700 relative overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-blue-800 to-blue-500 h-full rounded-full transition-all duration-700 ease-out flex items-center justify-end px-4"
                style={{ width: `${bluePercent}%` }}
              >
                <span className="text-white text-xl font-black">{Math.floor(bluePercent)}%</span>
              </div>
            </div>
          </div>

          <div className="font-black text-6xl text-gray-500 pb-1 px-4 italic">VS</div>

          {/* Mafia / Red Team */}
          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <span className="font-bold text-red-500 text-3xl">MCUT MAFIA</span>
              <span className="font-bold text-red-500 text-3xl">{teamScores.red}</span>
            </div>
            <div className="w-full bg-gray-900 rounded-full h-12 border-4 border-gray-700 relative overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-red-800 to-red-500 h-full rounded-full transition-all duration-700 ease-out flex items-center justify-end px-4"
                style={{ width: `${redPercent}%` }}
              >
                <span className="text-white text-xl font-black">{Math.floor(redPercent)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- LIVE ACTIVITY FEED --- */}
      <div className="w-full max-w-4xl flex flex-col gap-3 h-[400px]">
        {feed.map((item) => (
          <div
            key={item.id}
            className={`flex items-center p-4 rounded-xl border-l-8 shadow-lg transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 ${
              item.team === "red"
                ? "bg-red-900/40 border-red-500"
                : item.team === "blue"
                ? "bg-blue-900/40 border-blue-500"
                : "bg-gray-800 border-gray-500"
            }`}
          >
            <div className="flex-1">
              <span className="font-bold text-xl text-white mr-3">{item.username}</span>
              <span className="text-gray-300 text-lg">
                is hacking... <span className="italic text-gray-400">"{item.question}"</span>
              </span>
            </div>
            <div className="ml-4 flex-shrink-0 flex justify-end">
              {item.correct ? (
                <span className="text-green-400 font-black text-xl tracking-wider px-3 py-1 bg-green-900/30 rounded-lg shadow-[0_0_10px_rgba(74,222,128,0.5)]">
                  SUCCESS
                </span>
              ) : (
                <span className="text-red-500 font-black text-xl tracking-wider px-3 py-1 bg-red-900/30 rounded-lg shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                  FAILURE
                </span>
              )}
            </div>
          </div>
        ))}
        {feed.length === 0 && (
          <div className="text-center text-gray-600 italic text-2xl mt-10">Awaiting answers...</div>
        )}
      </div>
    </div>
  );
}

export default StreamerFinale;
