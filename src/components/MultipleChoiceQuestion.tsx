import { QuestionProps } from "../interfaces/QuestionProps";

function MultipleChoiceQuestion({ question }: QuestionProps) {
  const colors = ["#39FF14", "#FF073A", "#0FF0FC", "#BC13FE"];

  return (
    <div>
      <h1 className="text-9xl text-black text-center font-bold mb-4">
        {question.question}
      </h1>
      <div className="grid grid-cols-2 gap-4 w-full h-full">
        {question.image_url && (
          <div className="flex justify-center mb-4">
            <img
              src={question.image_url}
              alt="Question related"
              className="w-160 h-auto"
            />
          </div>
        )}
        {question.choices.split(",").map((choice, index) => (
          <button
            key={index}
            className={` text-white h-full w-full flex items-center justify-center p-4`}
            style={{ backgroundColor: colors[index % 4] }}
          >
            <p className="font-bold text-4xl">{choice}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default MultipleChoiceQuestion;
