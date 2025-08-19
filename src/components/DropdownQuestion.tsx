import { useState } from "react";
import { QuestionProps } from "../interfaces/QuestionProps";

function DropdownQuestion({ question }: QuestionProps) {
  const [answer, setAnswer] = useState("");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen">
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="m-10"></div>
        <h1 className="text-5xl text-black text-center font-bold mb-4 break-words">
          {question.question}
        </h1>
        {question.image_url && (
          <div className="flex justify-center items-center mb-4">
            <img
              src={question.image_url}
              alt="Question related"
              className="max-w-[300px] max-h-[300px] w-auto h-auto object-contain"
            />
          </div>
        )}

        <div className="m-20"></div>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 items-center justify-center max-w-[620px]">
          {question.choices.split(",").map((choice, index) => (
            <button
              key={index}
              onClick={() => setAnswer(choice)}
              className={`px-2 py-1 rounded border text-base font-medium truncate w-full ${
                answer === choice ? "bg-blue-500 text-white" : "bg-white text-black"
              }`}
              style={{ maxWidth: "300px" }}
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
