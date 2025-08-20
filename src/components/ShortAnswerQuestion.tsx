import { useState } from "react";

import { QuestionProps } from "../interfaces/QuestionProps";

function ShortAnswerQuestion({ question }: QuestionProps) {
  const [answer, setAnswer] = useState("");

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-2xl flex flex-col items-center justify-center px-4">
        <h1 className="text-3xl md:text-5xl lg:text-7xl text-black text-center font-bold mb-4 break-words">
          {question.question}
        </h1>
        {question.image_url && (
          <div className="flex justify-center mb-4 w-full">
            <img
              src={question.image_url}
              alt="Question related"
              className="max-w-full h-auto object-contain"
              style={{ maxHeight: "40vh" }}
            />
          </div>
        )}
        <div className="flex flex-col items-center w-2/3">
          <textarea
            className="border-4 border-solid border-black text-black p-2 w-full resize-none"
            placeholder="Type your answer..."
            value={answer}
            rows={Math.max(1, Math.min(8, Math.ceil(answer.length / 20)))}
            style={{ maxHeight: "20vh", minHeight: "3rem" }}
            onChange={(e) => {
              if (e.target.value.length <= 500) {
                setAnswer(e.target.value);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default ShortAnswerQuestion;
