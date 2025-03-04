"use client";
import { use, useState, useEffect } from "react";
import { Loading } from "@/app/components/loading";
import Cookies from "js-cookie";

export default function MultipleChoice({ params }) {
    const { id } = use(params);
    const [topic, setTopic] = useState("");
    const [course, setCourse] = useState("");
    const [studyGuideURL, setStudyGuideURL] = useState("");
    const [problems, setProblems] = useState([""]);
    const [options, setOptions] = useState({});// The possible answers for the question.
    const [solutions, setSolutions] = useState([""]);// The correct answer
    const [answer, setAnswer] = useState("");// The user's answer
    const [answers, setAnswers] = useState([""]);// The user's previous answers
    const [explanation, setExplanation] = useState("");
    const [counter, setCounter] = useState(0);// Used to force new problem generation
    const [loading, setLoading] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);

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
        setAnswers([...answers, answer+") "+options[answer]]);
        setAnswer("");
        setShowAnswer(false);
        setOptions({});
        setLoading(true);
        if (!topic || !course) return;
        fetch("/api/createMultipleChoiceProblem", {
            "method": "POST",
            "headers": {
                "content-type": "application/json",
            },
            "body": JSON.stringify({ topic: topic, course: course, studyGuide: studyGuideURL, problems: problems, answers: answers, solutions: solutions, difficulty: difficulty}),
        })
            .then((response) => response.json())
            .then((data) => {
                setProblems([...problems, data.question]);
                setSolutions([...solutions, data.correct_answer+") "+data.options[data.correct_answer]]);
                setOptions(data.options);
                setExplanation(data.explanation);
                setLoading(false);
            });
    }, [topic, course, studyGuideURL, counter]);

    const handleAnswerInput = async (e) => {
        const fieldValue = e.target.id;
        await setAnswer(fieldValue);
    };

    return (
        <>
            <nav className="flex justify-between items-center">
                <div>
                <a href="/">
                    <h1 className="font-bold text-3xl ml-4">Home</h1>
                </a>
                </div>
                <div className="flex flex-row gap-6 mr-4">
                <a href={"/open-ended/"+id}>Open Ended Choice</a>
                </div>
            </nav>
            <div className="flex flex-col gap-6 row-start-2 items-center">
                <h1 className="font-bold text-3xl">Multiple Choice Practice</h1>
                {!loading ? <h2 className="font-bold text-xl">Problem</h2> : null}
                {!loading ? <p className="w-3/4 ml-4">{problems.at(-1)}</p> : <Loading/>}
                { showAnswer ? 
                <div className="flex flex-col gap-6 items-center">
                    <p className="font-bold">Your answer: {answer+") "+options[answer]}</p>
                    {answer !== solutions.at(-1) ? <p className="font-bold">Correct answer: {solutions.at(-1)+") "+options[solutions.at(-1)]}</p> : <p>You were correct!</p>}
                    <p>Explanation: {explanation}</p>
                    <button type="button" onClick={() => setCounter(counter+1)} className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Next Problem?</button>
                </div> :
                <form onSubmit={()=> setShowAnswer(true)}>
                    {!loading ? <label>Response:</label> : null}
                    <br/>
                    {Object.keys(options).length > 0 ? Object.entries(options).map(([key, value]) => (
                        <div key={key}>
                            <input type="radio" id={key} name="answer" value={value} onChange={handleAnswerInput}/>
                            <label htmlFor={key}>{" "+key+") "+value}</label>
                        </div>
                    )) : null}
                    <br/>
                    {!loading ? <button 
                        type="submit"
                        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-3.5 text-center mt-2">
                        Grade Answer
                    </button> : null}
                </form>
                }
            </div>
        </>
    )
}