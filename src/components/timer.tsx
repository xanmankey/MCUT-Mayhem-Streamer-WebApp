import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// import { socket } from "../utils";
import { SocketContext } from "../utils";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import ShortAnswerQuestion from "./ShortAnswerQuestion";
import NumberQuestion from "./NumberQuestion";
import DropdownQuestion from "./DropdownQuestion";

function TimerComponent() {
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { duration, question_number } = location.state as {
    duration: number;
    question_number: number;
  };
  const question = location.state?.question;
  const [timeLeft, setTimeLeft] = useState(duration);
  const endQuestionEmitted = useRef(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timeLeft <= 0) {
      console.log("times up");
      // Remove timer from the page
      const timerElement = document.getElementById("timer");
      if (timerElement && timerElement.parentElement && timerElement.parentElement.parentElement) {
        timerElement.parentElement.parentElement.removeChild(timerElement.parentElement);
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
      key={location.key}
      className="flex flex-col items-center justify-center h-screen w-screen bg-white"
    >
      <div
        className="h-1/6 flex py-10"
        style={{
          fontSize: "96px",
          fontWeight: "bold",
          color: "black",
          marginBottom: "20px",
        }}
      >
        {minutes}:{seconds}
      </div>
      <div className="flex-1 flex justify-center w-full h-1/2">
        {question.question_type === "multiple_choice" ||
        question.question_type === "this_or_that" ? (
          <MultipleChoiceQuestion question={question} />
        ) : question.question_type === "short_answer" ? (
          <ShortAnswerQuestion question={question} />
        ) : question.question_type === "numbers" ? (
          <NumberQuestion question={question} />
        ) : question.question_type === "ranked_answer" ? (
          <ShortAnswerQuestion question={question} />
        ) : question.question_type === "dropdown" ? (
          <DropdownQuestion question={question} />
        ) : (
          <p className="text-2xl font-bold">Unknown question type: {question.question_type}</p>
        )}
      </div>
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
        color: "black",
      }}
    >
      <TimerComponent />
    </div>
  );
}

export default Timer;
