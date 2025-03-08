import { QuestionProps } from "../interfaces/QuestionProps";

function MultipleChoiceQuestion({ question, sendResponse }: QuestionProps) {
  const colors = ["#39FF14", "#FF073A", "#0FF0FC", "#BC13FE"];

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <h1 className="text-4xl font-bold mb-4">{question.question}</h1>
      <div className="grid grid-cols-2 gap-4 w-full h-full">
        {question.choices.split(",").map((choice, index) => (
          <button
            key={index}
            className={` text-white h-full w-full flex items-center justify-center p-4`}
            style={{ backgroundColor: colors[index % 4] }}
            onClick={() => sendResponse(choice)}
          >
            <p className="font-bold text-4xl">{choice}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default MultipleChoiceQuestion;
