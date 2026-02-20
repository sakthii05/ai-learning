"use client";
import React, { useEffect, useRef, useState } from "react";
import { Spinner, Textarea } from "@heroui/react";
import { FaArrowUpLong, FaStop } from "react-icons/fa6";
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from "ai";
import { LuCopy, LuCheck, LuPencil, LuRefreshCw } from "react-icons/lu";
import { StreamingMarkdown } from "@/components/chatUI/StreamingText";

const AIChat = () => {
    const [promptText, setPromtText] = useState("");
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState("");

    const { messages, sendMessage, status, stop, error, regenerate, setMessages } = useChat({
        transport: new DefaultChatTransport({
            api: '/api/chat',
        }),
        experimental_throttle:300
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

    const handleCopy = (messageId: string, text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(messageId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleEdit = (messageId: string, text: string) => {
        setEditingMessageId(messageId);
        setEditingText(text);
    };

    const handleCancelEdit = () => {
        setEditingMessageId(null);
        setEditingText("");
    };

    const handleSendEdit = (messageId: string) => {
        if (!editingText.trim()) return;
        const index = messages.findIndex(m => m.id === messageId);
        if (index !== -1) {
            // const newMessages = messages.slice(0, index);
            // setMessages(newMessages);
            sendMessage({ text: editingText, messageId: messageId });
            handleCancelEdit();
        }
    };



    const getMessageText = (message: any) => {
        return message.parts
            .filter((part: any) => part.type === 'text')
            .map((part: any) => part.text)
            .join("");
    };

    console.log(messages, status, error)
    return (
        <main ref={containerRef} className="flex justify-center relative h-screen overflow-y-auto">
            <div className="max-w-4xl w-full p-5 space-y-4 pb-32">

                {messages.map(message => (
                    <div key={message.id} className={`flex flex-col group ${message.role === 'user' ? "items-end" : "items-start"}`}>
                        <div className={`w-full flex ${message.role === 'user' ? "justify-end" : "justify-start"}`}>
                            {message.role === 'user' ? (
                                editingMessageId === message.id ? (
                                    <div className="w-full flex flex-col items-end gap-2 max-w-[95%] md:max-w-[60%]">
                                        <Textarea
                                            value={editingText}
                                            onChange={(e) => setEditingText(e.target.value)}
                                            minRows={2}
                                            size="lg"
                                            className="w-full"
                                            variant="flat"
                                            radius="lg"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleCancelEdit}
                                                className="px-3 py-1 text-sm rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => handleSendEdit(message.id)}
                                                className="px-3 py-1 text-sm rounded-full bg-black dark:bg-white text-white dark:text-black hover:opacity-80 transition-opacity"
                                            >
                                                Send
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="max-w-[95%] md:max-w-[60%] space-y-2 group">
                                        <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-2xl ">
                                            {message.parts.map((part, index) =>
                                                part.type === 'text' ? (
                                                    <span key={index} className="text-gray-900 dark:text-gray-100 text-[15px]">
                                                        {part.text}
                                                    </span>
                                                ) : null
                                            )}
                                        </div>
                                        <div className="hidden group-hover:flex justify-end gap-3 h-5 ">
                                            <button
                                                onClick={() => handleEdit(message.id, getMessageText(message))}
                                                className="text-default-500 transition-colors p-1"
                                                title="Edit message"
                                            >
                                                <LuPencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleCopy(message.id, getMessageText(message))}
                                                className="text-default-500 transition-colors p-1"
                                                title="Copy message"
                                            >
                                                {copiedId === message.id ? <LuCheck size={16} className="text-green-500" /> : <LuCopy size={16} />}
                                            </button>
                                        </div>
                                        <div className="group-hover:hidden h-5 "></div>
                                    </div>
                                )
                            ) : (
                                // Assistant message — render structured blocks
                                <div className="w-full max-w-[95%]">
                                    {message.parts.map((part, index) =>
                                        part.type === 'text' ? (
                                            <StreamingMarkdown content={part.text} key={index} status={status} />
                                        ) : null
                                    )}
                                    <>
                                        <button
                                            onClick={() => handleCopy(message.id, getMessageText(message))}
                                            className="text-default-500 dark:hover:text-gray-300 transition-colors p-1"
                                            title="Copy message"
                                        >
                                            {copiedId === message.id ? <LuCheck size={16} className="text-green-500" /> : <LuCopy size={16} />}
                                        </button>
                                        <button
                                            onClick={() => regenerate({ messageId: message.id })}
                                            className="text-default-500 transition-colors p-1"
                                            title="Regenerate response"
                                        >
                                            <LuRefreshCw size={16} />
                                        </button>
                                    </>

                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {error && (

                    <div className="flex justify-center items-center gap-2">
                        <div className="text-danger text-center">An error occurred. </div>
                        <div className="flex gap-2 items-center cursor-pointer hover:underline" onClick={() => regenerate()}>
                            Retry <LuRefreshCw size={16} />
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
