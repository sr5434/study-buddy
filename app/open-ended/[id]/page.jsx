"use client";
import { use, useState, useEffect } from "react";

export default function OpenEnded({ params }) {
    const { id } = use(params);

    const [topic, setTopic] = useState("");
    const [course, setCourse] = useState("");
    const [studyGuideURL, setStudyGuideURL] = useState("");
    const [problem, setProblem] = useState("");
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
        fetch("/api/createProblem", {
            "method": "POST",
            "headers": {
                "content-type": "application/json",
            },
            "body": JSON.stringify({ topic: topic, course: course, studyGuide: studyGuideURL }),
        })
            .then((response) => response.json())
            .then((data) => {
                setProblem(data.problem);
            });
    }, [topic, course, studyGuideURL]);
    return <p>{problem}</p>
}