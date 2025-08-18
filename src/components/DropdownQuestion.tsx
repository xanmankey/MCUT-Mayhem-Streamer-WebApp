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
        {question.choices.split(",").map((choice, index) => (
          <div className="flex items-center">
            {/* <label htmlFor={`dropdown-${index}`} className="mr-2 text-lg font-medium">
              Choice {index + 1}:
            </label> */}
            <select
              id={`dropdown-${index}`}
              value={answer === choice ? choice : ""}
              onChange={() => setAnswer(choice)}
              className="border rounded px-2 py-1"
            >
              <option value="">Select</option>
              <option value={choice}>{choice}</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DropdownQuestion;
