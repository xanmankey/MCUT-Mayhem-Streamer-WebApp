import { useState } from "react";

import { QuestionProps } from "../interfaces/QuestionProps";

function ShortAnswerQuestion({ question }: QuestionProps) {
  const [answer, setAnswer] = useState("");

  return (
    <div>
      <h1 className="text-9xl text-black text-center font-bold mb-4">{question.question}</h1>
      {question.image_url && (
        <div className="flex justify-center mb-4">
          <img src={question.image_url} alt="Question related" className="w-160 h-auto" />
        </div>
      )}
      <div className="flex flex-col items-center">
        <input
          type="text"
          className="border-4 border-solid border-black p-2 mb-4"
          placeholder="Type your answer..."
          value={answer}
          onChange={(e) => {
            if (e.target.value.length <= 200) {
              setAnswer(e.target.value);
            }
          }}
        />
        <button className="bg-blue-500 text-white px-4 py-2">Submit</button>
      </div>
    </div>
  );
}

export default ShortAnswerQuestion;
