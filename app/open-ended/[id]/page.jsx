"use client";
import { use, useState, useEffect } from "react";
import { Loading } from "@/app/components/loading";
import Cookies from "js-cookie";

export default function OpenEnded({ params }) {
    const { id } = use(params);

    const [topic, setTopic] = useState("");
    const [course, setCourse] = useState("");
    const [studyGuideURL, setStudyGuideURL] = useState("");
    const [problems, setProblems] = useState([""]);
    const [answer, setAnswer] = useState("");
    const [grade, setGrade] = useState("");
    const [explanation, setExplanation] = useState("");
    const [counter, setCounter] = useState(0);// Used to force new problem generation
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const difficulty = Cookies.get("difficulty");

    useEffect(() => {
          fetch("/api/getSessionDetails", {
            "method": "POST",
            "headers": {
              "content-type": "application/json"
            },
            "body": JSON.stringify({ id: id })
          })
          .then(response => response.json())
          .then(data => {
            setTopic(data.topic);
            setCourse(data.course);
            setStudyGuideURL(data.studyGuide);  
          });
        }, []);
    useEffect(() => {
        setExplanation("");
        setGrade("");
        setGenerating(true);
        fetch("/api/createOpenEndProblem", {
            "method": "POST",
            "headers": {
                "content-type": "application/json",
            },
            "body": JSON.stringify({ topic: topic, course: course, studyGuide: studyGuideURL, problems: problems, difficulty: difficulty}),
        })
            .then((response) => response.json())
            .then((data) => {
                setProblems([...problems, data.problem]);
                setGenerating(false);
            })
            .then(() => console.log(problems));
    }, [topic, course, studyGuideURL, counter]);

    const handleAnswerInput = async (e) => {
        const fieldValue = e.target.value;

        await setAnswer(fieldValue);
    };

    async function submitHandler(e) {
      e.preventDefault();
      setLoading(true);
      fetch("/api/gradeProblem", {
        "method": "POST",
        "headers": {
            "content-type": "application/json",
        },
        "body": JSON.stringify({ problem: problems.at(-1), answer: answer, course: course, difficulty: difficulty}),
    })
        .then((response) => response.json())
        .then((data) => {
            setGrade(data.grade);
            setExplanation(data.explanation);
            setLoading(false);
            setAnswer("");
        });
    }

    return (
      <>
        <nav className="flex justify-between items-center">
          <div>
            <a href="/">
              <h1 className="font-bold text-3xl ml-4">Home</h1>
            </a>
          </div>
          <div className="flex flex-row gap-6 mr-4">
            <a href={"/multiple-choice/"+id}>Multiple Choice</a>
          </div>
        </nav>
        <div className="flex flex-col gap-6 row-start-2 items-center">
          <h1 className="font-bold text-3xl">Open Ended Practice</h1>
          <h2 className="font-bold text-xl">Problem</h2>
          {!generating ? <p className="w-3/4 ml-4">{problems.at(-1)}</p> : <Loading/>}
          { explanation ? 
            <div>
            <p className="font-bold">Your grade: {grade}</p>
            <p>Feedback: {explanation}</p>
            <button type="button" onClick={() => setCounter(counter+1)} className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Next Problem?</button>
            </div> :
            <form onSubmit={submitHandler}>
            <label>Response:</label>
            <br/>
            <textarea value={answer} onChange={handleAnswerInput} className="text-slate-900 w-full h-32"/>
            <br/>
            <div className="flex flex-row justify-end gap-3">
              {loading ? <Loading/> : null}
              <button 
              type="submit"
              className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-3.5 text-center mt-2">
                
                Grade Answer
              </button>
              
            </div>
            
            </form>
          }
        </div>
      </>
    );
}