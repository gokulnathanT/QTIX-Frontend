import { useState } from "react";
import axios from "axios";
import './Questions.css'
export default function Questions(){
    console.log("gokul");




    const [counts,setCounts]=useState({
        easy:'',
        medium:'',
        hard:''
    });

    const [questions,setQuestions]=useState([]);
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState(null);


    const fetchQuestion = async () => {
    try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`http://localhost:8081/api/questions/random`, {
            params: {
                easyCount: counts.easy,
                mediumCount: counts.medium,
                hardCount: counts.hard
            }
        });
        
        // With axios, the data is directly available in response.data
        setQuestions(response.data);
    } catch (err) {
        setError(err.message || 'Error occurred');
        console.error('Error:', err);
    } finally {
        setLoading(false);
    }
};

    function handleCount(difficulty,value){

      const limitValue=Math.min(Math.max(0,parseInt(value)),10);
       setCounts(pre=>({
        ...pre,[difficulty.toLowerCase()]:limitValue
       }));
    }
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
            onChange={(e)=>handleCount(difficulty,e.target.value)}
          />
        </div>
      ))}
    </div>
    <button onClick={fetchQuestion} disabled={loading}>
      {loading ? "Generating..." : "Problems"}
    </button>

    {questions.length > 0 && (
      <div className="generatedQuestions">
        {questions.map((question, index) => (
          <div key={index}>
            <div>
              <h3>Question #{question.questionNumber}</h3>
              <a href={question.url} target="_blank" rel="noopener noreferrer">
                solve Problem !
              </a>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
}