import { useState } from "react";

import { QuestionProps } from "../interfaces/QuestionProps";

function NumberQuestion({ question }: QuestionProps) {
  const [number, setNumber] = useState("");

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-xl flex flex-col items-center px-4">
        <h1 className="text-3xl md:text-5xl lg:text-6xl text-black text-center font-bold mb-4 break-words">
          {question.question}
        </h1>
        {question.image_url && (
          <div className="flex justify-center mb-4 w-full">
            <img
              src={question.image_url}
              alt="Question related"
              className="max-w-full h-auto rounded"
              style={{ maxHeight: "300px" }}
            />
          </div>
        )}
        <div className="flex flex-col items-center w-full">
          <input
            type="number"
            className="border-4 border-solid border-black p-2 w-full max-w-xs"
            placeholder="Enter a number..."
            value={number}
            onChange={(e) => setNumber(e.target.value.replace(/[^0-9]/g, ""))}
          />
        </div>
      </div>
    </div>
  );
}

export default NumberQuestion;
