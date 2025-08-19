import { QuestionProps } from "../interfaces/QuestionProps";

function MultipleChoiceQuestion({ question }: QuestionProps) {
  const colors = ["#2AE4E0", "#BC13FE", "#E09B2A", "#A3E02A"];

  return (
    <div>
      {/* <div className="m-1"></div> */}
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-white">
        {/* <h1 className="text-4xl text-black font-bold mb-4 text-center">{question.question}</h1> */}
        <div className="m-10"></div>
        <h1 className="text-5xl text-black text-center font-bold mb-4 break-words">
          {question.question}
        </h1>
        <div className="grid grid-cols-2 gap-4 w-full h-full">
          {question.choices.split(",").map((choice, index) => {
            // Create a gradient using the current color and the next color in the palette
            const color1 = colors[index % colors.length];
            const color2 = colors[(index + 1) % colors.length];
            const gradient = `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
            return (
              <button
                key={index}
                className="text-white h-full w-full flex items-center justify-center p-4 transition-transform duration-200 hover:scale-105"
                style={{
                  background: gradient,
                  border: "none",
                  borderRadius: "1rem",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
                }}
              >
                <p className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center drop-shadow">
                  {choice}
                </p>
              </button>
            );
          })}
        </div>
      </div>
      {/* <div className="m-1"></div> */}
    </div>
  );
}

export default MultipleChoiceQuestion;
