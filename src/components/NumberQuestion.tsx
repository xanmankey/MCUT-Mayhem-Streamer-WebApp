import { useState } from "react";

import { QuestionProps } from "../interfaces/QuestionProps";

function NumberQuestion({ question }: QuestionProps) {
  const [number, setNumber] = useState("");

  return (
    <div>
      <h1 className="text-9xl text-black font-bold mb-4">
        {question.question}
      </h1>
      {question.image_url && (
        <div className="flex justify-center mb-4">
          <img
            src={question.image_url}
            alt="Question related"
            className="w-160 h-auto"
          />
        </div>
      )}
      <div className="flex flex-col items-center">
        <input
          type="number"
          className="border p-2"
          placeholder="Enter a number..."
          value={number}
          onChange={(e) => setNumber(e.target.value.replace(/[^0-9]/g, ""))}
        />
        <button className="bg-green-500 text-white px-4 py-6 mt-4">
          Submit
        </button>
      </div>
    </div>
  );
}

export default NumberQuestion;
