import { useEffect, useState } from "react";
import { BACKEND, socket } from "../utils.tsx";

import { Question } from "../interfaces/Question.tsx";
import { useLocation, useNavigate } from "react-router-dom";

console.log("Streamer websocket connected\n");

function StreamerQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all of the questions from the server
    fetch(BACKEND + "/get_questions")
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data.questions);
      });
  }, []);

  // Sends question json to the server
  const handleClick = (question: string) => {
    socket.emit("start_question", { question });
    // Render the Timer component
    const parsedQuestion = JSON.parse(question);
    navigate("/timer", {
      state: {
        duration: parsedQuestion.time,
        question_number: parsedQuestion.number,
      },
    });
    console.log(parsedQuestion);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        paddingTop: "5%",
      }}
      key={location.key}
    >
      <ul style={{ width: "50%" }}>
        {questions.map((q, index) => (
          <li key={index} style={{ marginBottom: "20px" }}>
            <button
              onClick={() => handleClick(JSON.stringify(q))}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "10px",
                fontSize: "16px",
              }}
            >
              <div style={{ fontWeight: "bold", fontSize: "18px" }}>
                {q.question}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "14px",
                }}
              >
                <span>Time: {q.time}</span>
                <span>Weight: {q.weight}</span>
              </div>
              <div style={{ marginLeft: "20px", fontSize: "16px" }}>
                {q.answer}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StreamerQuestions;
