import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// import { socket } from "../utils";
import { SocketContext } from "../utils";

function TimerComponent() {
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { duration, question_number } = location.state as {
    duration: number;
    question_number: number;
  };
  const [timeLeft, setTimeLeft] = useState(duration);
  const endQuestionEmitted = useRef(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timeLeft <= 0) {
      console.log("times up");
      // Remove timer from the page
      const timerElement = document.getElementById("timer");
      if (
        timerElement &&
        timerElement.parentElement &&
        timerElement.parentElement.parentElement
      ) {
        timerElement.parentElement.parentElement.removeChild(
          timerElement.parentElement
        );
      }
      // Emit the answer to the server
      if (!endQuestionEmitted.current) {
        console.log("emitting end_question");
        socket.emit("end_question", { question_number });
        endQuestionEmitted.current = true;
      }
    } else {
      interval = setTimeout(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearTimeout(interval); // Cleanup on unmount
  }, [timeLeft, navigate, question_number]);

  useEffect(() => {
    console.log("useEffect timer with results calls");
    socket.on("results", (data) => {
      console.log("results", data);
      navigate("/responses", { state: { data: data } });
    });

    return () => {
      socket.off("results");
    };
  }, [socket, navigate]);

  const minutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  return (
    <div
      style={{ fontSize: "96px", fontWeight: "bold", color: "black" }}
      key={location.key}
    >
      {minutes}:{seconds}
    </div>
  );
}

function Timer() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <TimerComponent />
    </div>
  );
}

export default Timer;
