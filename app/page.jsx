"use client";
import { useState } from "react";
import Cookies from "js-cookie";


export default function Home() {
  const [fileName, setFileName] = useState("");
  const [downloadURL, setDownloadURL] = useState("");
  const [course, setCourse] = useState("");
  const [topic, setTopic] = useState("");
  const lastSessionId = Cookies.get("sessionId");
  const lastTopic = Cookies.get("topic");
  const handleCourseInput = async (e) => {
    const fieldValue = e.target.value;

    await setCourse(fieldValue);
  }

  const handleTopicInput = async (e) => {
    const fieldValue = e.target.value;

    await setTopic(fieldValue);
  }

  async function upload(event) {
    // Get the signed URL
    const response = await fetch("/api/createUploadURL");
    const { url, previewURL } = await response.json();
    // await setUploadURL(url);
    await setDownloadURL(previewURL);
    // Upload the file to the signed URL
    console.log(url)
    await fetch(url, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/pdf"
      },
      body: event.target.files[0],
    });
  }
  async function submitHandler(e) {
    e.preventDefault();
    const response = await fetch("/api/createStudyGuide", {
      method: "POST",
      body: JSON.stringify({
        course: course,
        topic: topic,
        studyGuide: downloadURL,
      }),
    });
    const data = await response.json();
    const link = data.link;
    window.location.replace(link);
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <h1 className="font-bold text-3xl">Study Buddy</h1>
        {lastTopic ? <a href={`/dashboard/${lastSessionId}`} className="underline-offset-4 underline text-blue-500 visited:text-blue-500">Continue studying {lastTopic}?</a> : null}
        <form onSubmit={submitHandler} className="flex flex-col gap-0">
          <label>Class</label>
          <br/>
          <input type="text" placeholder="Honors Bio" value={course} onChange={handleCourseInput} className="text-slate-900"/>
          <br/>
          <label>Topic</label>
          <br/>
          <input type="text" placeholder="the cell cycle" value={topic} onChange={handleTopicInput} className="text-slate-900"/>
          <br/>
          <label>Study Guide/Notes</label>
          <br/>
          <input
              type="file" 
              accept="image/pdf" 
              onChange={(e) => {
                setFileName(e.target.files?.[0]?.name || "");
                upload(e);
              }}
          />
          <br/>
          <button 
          type="submit"
          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-3.5 text-center mt-2">
            Start Studying
          </button>
        </form>
      </main>
    </div>
  );
}
