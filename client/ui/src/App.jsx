import React, { useState,useEffect } from 'react';
import axios from 'axios';
import "./App.css";

function App() {
  const [fileName, setFileName] = useState("");
  const [question, setQuestion] = useState("")
  const [chats, setChats] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [isWriting, setIsWriting] = useState(false);

  useEffect(()=>{
    console.log(question)
  },[question])

  useEffect(() => {
    let timer;
    if (success) {
      timer = setTimeout(() => {
        setSuccess(false);
      }, 5000); 
    }
    return () => clearTimeout(timer);
  }, [success]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      setError('No file selected.');
      return;
    }
    if (selectedFile.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      return;
    }
    const MAX_SIZE = 10 * 1024 * 1024; 
    if (selectedFile.size > MAX_SIZE) {
      setError('File size exceeds 10 MB.');
      return;
    }
    setError('');
    setSuccess(''); 
    handleSubmit(selectedFile);
  };

  const handleSubmit = (file) => {
    if (!file) {
      setError('No file selected for upload.');
      return;
    }
    setIsLoading(true);
    console.log(file)
    const formData = new FormData();
    formData.append('pdf', file);
    console.log(formData)

    axios.post('http://localhost:4000/upload',formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then(response => {
      setIsLoading(false);
      setSuccess('File uploaded successfully!');
      console.log('File uploaded successfully:', response.data.filename);
      setFileName(response.data.filename)
    })
    .catch(error => {
      setIsLoading(false);
      setError('Error uploading file.');
      console.error('Error uploading file:', error);
    });
  };

  const handleClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleAskQuestion = async () => {
    if (!question) return;
    console.log(question)
    setIsWriting(true);
    setError('');
    setChats(p=>[...p, {chat: question, by:"User"}]);
    try {
      const response = await axios.post('http://localhost:4000/ask', {
        question,
        fileName,
      });

      const answer = response.data.answer; // Assuming the server response contains an 'answer' field
      setChats(p=>[...p, { chat: answer, by: "AI" }]);
    } catch (err) {
      setError('Error asking question');
      console.error('Error:', err);
    } finally {
      setIsWriting(false);
      setQuestion('');
    }
  };

  return (
    <div className="app w-screen h-screen m-0 flex flex-col box-content">
      <div className="navbar shadow-primary-shadow w-screen h-20 m-0 p-3 flex items-center justify-between md:px-5">
        <img src="/assets/AI-Planet-Logo.svg" alt="Logo" />
        <div className="fileDesc flex gap-5 md:gap-10">
           <div className="currentFile flex gap-1 items-center">
            <img src="/assets/File-Icon.svg" alt="File Icon" className="w-6" />
            {fileName ? <span className="fileName text-primary-clr font-normal text-sm" title={fileName}>{fileName.slice(0,10)}...pdf</span> :  <span className="fileName text-primary-clr font-normal text-sm" >No File Uploaded</span>}
          </div>
          <div
            className="uploadNew border border-secondary-clr rounded flex items-center justify-center h-7 min-w-7 cursor-pointer"
            onClick={handleClick}
          >
            <img src="/assets/Add-Icon.svg" alt="Add Icon" />
          </div>
          <input
            id="fileInput"
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>
      <div className="chat flex flex-col items-center justify-start px-5 py-10 gap-10 h-90vh">
        <div className="msgs overflow-y-scroll h-full w-full flex flex-col gap-5 md:w-4/5 md:gap-10">
         {chats.map((c,i)=><div key={i} className="msg flex gap-5 items-center">
            {c.by=="User" ? <div className="user w-10 h-10 rounded-full p-1 border-2 border-pink-400 text-white flex items-center justify-center self-start">
              <span className="text-xl w-full h-full rounded-full bg-pink-400 flex items-center justify-center">
                <span className="text-xl">Y</span>
              </span>
            </div> : <div className="bot w-10 h-10 rounded-full flex items-center justify-center self-start">
              <img className="w-10 h-10" src="/assets/Bot-Logo.svg" alt="Bot" />
            </div>}
            <p className="msgContent text-secondary-clr text-sm">{c.chat}</p>
          </div>)}
          {/* <div className="msg flex gap-5 items-center">
            <div className="bot w-10 h-10 rounded-full flex items-center justify-center self-start">
              <img className="w-10 h-10" src="/assets/Bot-Logo.svg" alt="Bot" />
            </div>
            <p className="msgContent text-secondary-clr text-sm text-wrap w-full">
              Our own Large Language Model (LLM) is a type of AI that can learn from data. We have trained it on 7 billion parameters which makes it better than other LLMs. We are featured on aiplanet.com and work with leading enterprises to help them use AI securely and privately. We have a Generative AI Stack which helps reduce the hallucinations in LLMs and allows enterprises to use AI in their applications.
            </p>
          </div> */}
        </div>
        <div className="inputbox w-full relative md:w-2/3">
          <input disabled={!fileName} className="h-10 p-4 pr-10 outline-none rounded border border-quarternary-clr w-full text-secondary-clr" type="text" placeholder="Send a message..." value={question} onChange={(e)=>{setQuestion(e.target.value)}} />
          <img className="absolute top-0 right-2 bottom-0 mt-auto mb-auto cursor-pointer" src="/assets/Send-Icon.svg" alt="Send" onClick={handleAskQuestion}/>
        </div>
      </div>
      {error && <p className="text-red-500 m-2">{error}</p>}
      {success && <p className="text-green-500 m-2">{success}</p>}
      {isLoading && <p className="text-blue-500 m-2">Uploading...</p>}
    </div>
  );
}

export default App;
