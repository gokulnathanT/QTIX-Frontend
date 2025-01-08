import { useState, useEffect } from "react";
import axios from "axios";
import "./Questions.css";
import Summary from "../Summary/Summary";
export default function Questions() {
  console.log("gokul");

  const [counts, setCounts] = useState({
    easy: "",
    medium: "",
    hard: "",
  });

  const [questions, setQuestions] = useState([]);
  const [completedQuestions, setCompletedQuestions] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPopup, setIsPopup] = useState(false);

  const handleCheckbox = (questionId) => {
    setCompletedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };
  const fetchQuestion = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `http://localhost:8081/api/questions/random`,
        {
          params: {
            easyCount: counts.easy,
            mediumCount: counts.medium,
            hardCount: counts.hard,
          },
        }
      );
      setQuestions(response.data);
      setCompletedQuestions(new Set());
    } catch (err) {
      setError(err.message || "Error occurred");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  function handleCount(difficulty, value) {
    const limitValue = Math.min(Math.max(0, parseInt(value)), 10);
    setCounts((pre) => ({
      ...pre,
      [difficulty.toLowerCase()]: limitValue,
    }));
  }

  const details = {
    solved: completedQuestions.size,
    total: questions.length,
    time: "10:00",
  };

  const togglePopup = () => {
    setIsPopup(!isPopup);
    if(isPopup){
      setCompletedQuestions(new Set());
    }
      
  };

  const questionsCompleted = [];
  completedQuestions.forEach((id) => {
    const question = questions.find((q) => q.questionNumber === id);
    if (question) {
      questionsCompleted.push(question);
    }
  });

  return (
    <div className="questions">
      <div className="questionsInput">
        {Object.entries(counts).map(([difficulty, count]) => (
          <div key={difficulty} className="countInput">
            <label htmlFor={difficulty}>{difficulty}</label>
            <input
              type="number"
              min="0"
              max="10"
              value={count}
              placeholder="Max 10"
              onChange={(e) => handleCount(difficulty, e.target.value)}
            />
          </div>
        ))}
        <button onClick={fetchQuestion} disabled={loading}>
          Problems
        </button>
      </div>
      <div className="summary">
        <button onClick={togglePopup}>Generate Summary</button>
      </div>

      {isPopup && (
        <Summary
          details={details}
          questions={questions}
          solvedQuestions={questionsCompleted}
          onClose={togglePopup}
        />
      )}

      {questions.length > 0 && (
        <div className="generatedQuestions">
          {questions.map((question, index) => (
            <div key={index} className="questionCard">
              <div className="questionHeader">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={completedQuestions.has(question.questionNumber)}
                    onChange={() => handleCheckbox(question.questionNumber)}
                  />
                  <span className="checkmark"></span>
                </label>
                <div className="questionNumber">#{question.questionNumber}</div>
                <div
                  className={`difficultyTag ${question.difficulty.toLowerCase()}`}
                >
                  {question.difficulty}
                </div>
              </div>
              <h3 className="questionTitle">{question.title}</h3>
              <div className="categoryTag">{question.category}</div>
              <a
                href={question.url}
                target="_blank"
                rel="noopener noreferrer"
                className="solveButton"
              >
                Solve Problem !
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
