"use client";
import { use, useState, useEffect } from "react";
import { Loading } from "@/app/components/loading";

export default function MultipleChoice({ params }) {
    const { id } = use(params);
    const [topic, setTopic] = useState("");
    const [course, setCourse] = useState("");
    const [studyGuideURL, setStudyGuideURL] = useState("");
    const [problem, setProblem] = useState("");
    const [options, setOptions] = useState({});// The possible answers for the question.
    const [solution, setSolution] = useState("");// The correct answer
    const [answer, setAnswer] = useState("");// The user's answer
    const [explanation, setExplanation] = useState("");
    const [counter, setCounter] = useState(0);// Used to force new problem generation
    const [loading, setLoading] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);

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
        setProblem("");
        setAnswer("");
        setShowAnswer(false);
        setOptions({});
        if (!topic || !course || !studyGuideURL) return;
        fetch("/api/createMultipleChoiceProblem", {
            "method": "POST",
            "headers": {
                "content-type": "application/json",
            },
            "body": JSON.stringify({ topic: topic, course: course, studyGuide: studyGuideURL }),
        })
            .then((response) => response.json())
            .then((data) => {
                setProblem(data.question);
                setSolution(data.correct_answer);
                setOptions(data.options);
                setExplanation(data.explanation);
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
                <a href="/open-ended">Open Ended Choice</a>
                </div>
            </nav>
            <div className="flex flex-col gap-6 row-start-2 items-center">
                <h1 className="font-bold text-3xl">Open Ended Practice</h1>
                <h2 className="font-bold text-xl">Problem</h2>
                {problem ? <p className="w-3/4 ml-4">{problem}</p> : <Loading/>}
                { showAnswer ? 
                <div className="flex flex-col gap-6 items-center">
                    <p className="font-bold">Your answer: {answer+") "+options[answer]}</p>
                    {answer !== solution ? <p className="font-bold">Correct answer: {solution+") "+options[solution]}</p> : <p>You were correct!</p>}
                    <p>Explanation: {explanation}</p>
                    <button type="button" onClick={() => setCounter(counter+1)} className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Next Problem?</button>
                </div> :
                <form onSubmit={()=> setShowAnswer(true)}>
                    {problem ? <label>Response:</label> : null}
                    <br/>
                    {Object.keys(options).length > 0 ? Object.entries(options).map(([key, value]) => (
                        <div key={key}>
                            <input type="radio" id={key} name="answer" value={value} onChange={handleAnswerInput}/>
                            <label htmlFor={key}>{" "+key+") "+value}</label>
                        </div>
                    )) : null}
                    <br/>
                    <button 
                        type="submit"
                        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-3.5 text-center mt-2">
                        Grade Answer
                    </button>
                </form>
                }
            </div>
        </>
    )
}