import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
// Loaded after a viewer answers; timer will be displayed on streamers end
import { socket } from "../utils.tsx";

function ViewerAnswered() {
  const navigate = useNavigate();
  const location = useLocation();
  const response = location.state?.response;
  const question = location.state?.question;

  React.useEffect(() => {
    console.log("useEffect viewer_answered with results calls");
    socket.on("results", () => {
      navigate("/answer", {
        state: {
          correct: question.answer
            .toLowerCase()
            .split(",")
            .includes(response.toLowerCase()),
        },
      });
      // navigate(0);
    });

    return () => {
      socket.off("results");
    };
  }, [navigate, question, response]);

  return (
    <div
      className="bg-gray-200 h-screen w-screen flex flex-col items-center justify-center"
      key={location.key}
    >
      <h1 className="text-2xl font-bold mb-4">Good answer?</h1>
      <div className="w-12 h-12 border-4 border-t-4 border-t-purple-500 border-purple-300 rounded-full mt-4 animate-spin"></div>
    </div>
  );
}

export default ViewerAnswered;
