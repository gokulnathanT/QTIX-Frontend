import "./Summary.css";
function Summary({ details, questions, solvedQuestions, onClose }) {
  console.log(solvedQuestions);
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Assessment Summary !</h2>
        <p>
          Solved/Total:{details.solved}/{details.total}
        </p>
        <p>Duration : {details.time}</p>
        <div className="solvedQuestions">
          <ul>
            {solvedQuestions.map((que) => (
              <li key={que.id}>
                <p>
                  ☑️ {que.questionNumber} : {que.title}
                </p>
                <p>
                    Difficulty : {que.difficulty}  ||  Category : {que.category}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
export default Summary;
