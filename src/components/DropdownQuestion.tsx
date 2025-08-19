import { useState } from "react";
import { QuestionProps } from "../interfaces/QuestionProps";

function DropdownQuestion({ question }: QuestionProps) {
  const [answer, setAnswer] = useState("");

  return (
    <div>
      <h1 className="text-9xl text-black text-center font-bold mb-4">{question.question}</h1>
      <div className="grid grid-cols-2 gap-4 w-full h-full">
        {question.image_url && (
          <div className="flex justify-center mb-4">
            <img src={question.image_url} alt="Question related" className="w-160 h-auto" />
          </div>
        )}

        <div className="overflow-y-auto max-h-[60vh] w-full flex flex-col gap-4">
          {question.choices.split(",").map((choice, index) => (
            <button
              key={index}
              onClick={() => setAnswer(choice)}
              className={`px-4 py-2 rounded border text-lg font-medium ${
                answer === choice ? "bg-blue-500 text-white" : "bg-white text-black"
              }`}
            >
              {choice}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DropdownQuestion;
