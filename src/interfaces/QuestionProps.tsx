import { Question } from "./Question";

export interface QuestionProps {
  question: Question;
  sendResponse: (response: string) => void;
}
