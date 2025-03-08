import { useState } from "react";

import { QuestionProps } from "../interfaces/QuestionProps";

function NumberQuestion({ question, sendResponse }: QuestionProps) {
  const [number, setNumber] = useState("");

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <h1 className="text-4xl font-bold mb-4">{question.question}</h1>
      <input
        type="number"
        className="border p-2"
        placeholder="Enter a number..."
        value={number}
        onChange={(e) => setNumber(e.target.value.replace(/[^0-9]/g, ""))}
      />
      <button
        className="bg-green-500 text-white px-4 py-2 mt-4"
        onClick={() => sendResponse(number)}
      >
        Submit
      </button>
    </div>
  );
}

export default NumberQuestion;
