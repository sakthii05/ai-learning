"use client";
import React, { useEffect, useRef, useState } from "react";
import { Spinner, Textarea } from "@heroui/react";
import { FaArrowUpLong, FaStop } from "react-icons/fa6";
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from "ai";
import { RxReload } from "react-icons/rx";
import { StreamingMarkdown } from "@/components/chatUI/StreamingText";



const AIChat = () => {
    const [promptText, setPromtText] = useState("");
    const { messages, sendMessage, status, stop, error, regenerate, } = useChat({
        transport: new DefaultChatTransport({
            api: '/api/chat',
        }),
        // resume: true
    });
    const containerRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
   

    // Auto-scroll to bottom when messages update
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, status]);

    const handleAskAI = () => {
        if (promptText.trim()) {
            sendMessage({ text: promptText });
            setPromtText('');
        }
    };
    console.log(messages, status, error)
    return (
        <main ref={containerRef} className="flex justify-center relative h-screen overflow-y-auto">
            <div className="max-w-4xl w-full p-5 space-y-4 pb-32">

                {messages.map(message => (
                    <div key={message.id} className={`${message.role === 'user' ? "flex justify-end" : "flex justify-start"}`}>
                        {message.role === 'user' ? (

                            <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-2xl max-w-[95%] md:max-w-[60%]">
                                {message.parts.map((part, index) =>
                                    part.type === 'text' ? (
                                        <span key={index} className="text-gray-900 dark:text-gray-100 text-[15px]">
                                            {part.text}
                                        </span>
                                    ) : null
                                )}
                            </div>
                        ) : (
                            // Assistant message — render structured blocks
                            <div className="w-full max-w-[95%]">
                                {message.parts.map((part, index) =>
                                    part.type === 'text' ? (
                                        <StreamingMarkdown content={part.text} key={index} status={status} />
                                    ) : null
                                )}

                            </div>
                        )}
                    </div>
                ))}

                {error && (

                    <div className="flex justify-center items-center gap-2">
                        <div className="text-danger text-center">An error occurred. </div>
                        <div className="flex gap-2 items-center cursor-pointer hover:underline" onClick={() => regenerate()}>
                            Retry <RxReload />
                        </div>
                    </div>

                )}
                {(status === 'submitted' || status === 'streaming') && (
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <Spinner size="sm" />
                        <span className="text-sm">Thinking...</span>
                    </div>
                )}
                <div className="h-24 w-full"></div>
                <div ref={messagesEndRef} />
            </div>

            <div className={`fixed max-w-2xl w-full space-y-7 px-3 ${messages.length === 0 ? 'bottom-[50%]' : 'bottom-5'} transition-all duration-300`}>
                {messages.length === 0 && <div className="text-center text-3xl font-medium ">What&apos;s on the agenda today?</div>}
                <Textarea
                    value={promptText}
                    onChange={(e) => setPromtText(e.target.value)}
                    endContent={
                        <div>
                            {promptText === "" ? <div></div> : <div onClick={handleAskAI} className="w-8 h-8 -mr-2 rounded-full bg-black flex justify-center items-center text-white cursor-pointer"><FaArrowUpLong /></div>}
                            {(status === 'submitted' || status === 'streaming') && (
                                <div onClick={stop} className="w-8 h-8 -mr-2 rounded-full bg-black flex justify-center items-center text-white cursor-pointer"><FaStop /></div>
                            )}
                        </div>
                    }
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey && status === 'ready') {
                            e.preventDefault();
                            handleAskAI();
                        }
                    }}
                    minRows={1}
                    placeholder="Ask anything"
                    size="lg"
                    radius="full"
                    className=" drop-shadow-xl"
                />
            </div>
        </main>
    );
};



export default AIChat;
