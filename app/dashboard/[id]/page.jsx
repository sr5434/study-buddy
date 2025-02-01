"use client";
import { useEffect, useState, use } from "react";
import Cookies from "js-cookie";
import toast, { Toaster } from 'react-hot-toast';

export default function Dashboard({ params }) {
    const { id } = use(params);
    Cookies.set("sessionId", id, { expires: 14 });
    const [topic, setTopic] = useState("");
    const [course, setCourse] = useState("");
    const [studyGuideURL, setStudyGuideURL] = useState("");
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
        Cookies.set("topic", data.topic, { expires: 7 });
        setCourse(data.course);
        setStudyGuideURL(data.studyGuide);
      });
    }, []);
    return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <Toaster />
        <main className="flex flex-col gap-8 row-start-2 items-center">
          <h1 className="font-bold text-3xl">Study Buddy</h1>
          <p>Class: {course}</p>
          <p>Studying: {topic}</p>
          {studyGuideURL ? (
          <a href={studyGuideURL} className="underline-offset-4 underline text-blue-500 visited:text-blue-500">
            Study Guide
          </a>
          ) : null}
          <a
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('Copied to clipboard!');
            }}
            className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            Copy session URL
          </a>
          <div className="flex flex-row ml-5">
            <a href={`/open-ended/${id}`} className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Open-Ended</a>
            <a href={`/multiple-choice/${id}`} className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Multiple Choice</a>
          </div>
        </main>
      </div>
    );
  }
  