"use client";
import React, { useEffect, useRef, useState } from "react";
import { Spinner, Textarea } from "@heroui/react";
import { FaArrowUpLong, FaStop } from "react-icons/fa6";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { LuCopy, LuCheck, LuPencil, LuRefreshCw } from "react-icons/lu";
import { StreamingMarkdown } from "@/components/chatUI/StreamingText";
import { IoMdAdd } from "react-icons/io";
import { IoCloseCircle } from "react-icons/io5";
import Image from "next/image";
import SpeechToText from "@/components/chatUI/SpeechToText";
import { set } from "zod/v4";

const readyMadePrompts = [
  "JS code to find first prime number",
  "Top 5 tips to improve my LinkedIn profile",
  "Best LLM for web search in 2025",
  "How Imporve Prompt Engineering Skills?",
];

const AIChat = () => {
  const [promptText, setPromtText] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [basePrompt, setBasePrompt] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    sendMessage,
    status,
    stop,
    error,
    regenerate,
    setMessages,
  } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    experimental_throttle: 1000,
    // resume: true
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, status]);

  const handleAskAI = () => {
    if (promptText.trim()) {
      const dataTransfer = new DataTransfer();
      selectedFiles.forEach((file) => dataTransfer.items.add(file));

      sendMessage({
        text: promptText,
        files: selectedFiles.length > 0 ? dataTransfer.files : undefined,
      });

      setPromtText("");
      setSelectedFiles([]);
      setPreviewUrls((prev) => {
        prev.forEach((url) => URL.revokeObjectURL(url));
        return [];
      });
      setUploadError(null);
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
    const index = messages.findIndex((m) => m.id === messageId);
    if (index !== -1) {
      sendMessage({ text: editingText, messageId: messageId });
      handleCancelEdit();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadError(null);

    const validFiles: File[] = [];
    const newPreviewUrls: string[] = [];

    for (const file of files) {
      // Validate image file type
      if (!file.type.startsWith("image/")) {
        setUploadError("Please select only image files.");
        continue;
      }

      // Validate file size (< 1MB)
      if (file.size > 1024 * 1024) {
        setUploadError(`File ${file.name} is too large. Max size is 1MB.`);
        continue;
      }

      validFiles.push(file);
      newPreviewUrls.push(URL.createObjectURL(file));
    }

    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    }

    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTranscript = (transcript: string) => {
    setPromtText(basePrompt + (basePrompt ? " " : "") + transcript);
  };

  const getMessageText = (message: any) => {
    return message.parts
      .filter((part: any) => part.type === "text")
      .map((part: any) => part.text)
      .join("");
  };

  console.log(messages, status, error);
  return (
    <main
      ref={containerRef}
      className="flex justify-center relative h-screen overflow-y-auto"
    >
      <div className="max-w-4xl w-full p-5 space-y-4 pb-32">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex flex-col group ${message.role === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`w-full flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "user" ? (
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
                  <div className=" space-y-2">
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case "text":
                          return (
                            <div key={i} className="relative group space-y-2">
                              <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-2xl">
                                <span className="text-gray-900 dark:text-gray-100 text-[15px]">
                                  {part.text}
                                </span>
                              </div>
                              <div className="h-5 flex justify-end">
                                <div className="hidden absolute group-hover:flex  gap-3 h-5 ">
                                  <button
                                    onClick={() =>
                                      handleEdit(
                                        message.id,
                                        getMessageText(message),
                                      )
                                    }
                                    className="text-default-500 transition-colors p-1"
                                    title="Edit message"
                                  >
                                    <LuPencil size={16} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleCopy(
                                        message.id,
                                        getMessageText(message),
                                      )
                                    }
                                    className="text-default-500 transition-colors p-1"
                                    title="Copy message"
                                  >
                                    {copiedId === message.id ? (
                                      <LuCheck
                                        size={16}
                                        className="text-green-500"
                                      />
                                    ) : (
                                      <LuCopy size={16} />
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        case "file":
                          return (
                            <Image
                              key={(part.filename || "image") + i}
                              src={part.url}
                              alt={part.filename ?? "image"}
                              height={400}
                              width={400}
                            />
                          );
                        default:
                          return null;
                      }
                    })}
                  </div>
                )
              ) : (
                // Assistant message — render structured blocks
                <div className="w-full max-w-[95%] space-y-2">
                  {message.parts.map((part, index) =>
                    part.type === "text" ? (
                      <StreamingMarkdown
                        content={part.text}
                        key={index}
                        status={status}
                      />
                    ) : null,
                  )}
                  <>
                    <button
                      onClick={() =>
                        handleCopy(message.id, getMessageText(message))
                      }
                      className="text-default-500 dark:hover:text-gray-300 transition-colors p-1"
                      title="Copy message"
                    >
                      {copiedId === message.id ? (
                        <LuCheck size={16} className="text-green-500" />
                      ) : (
                        <LuCopy size={16} />
                      )}
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
            <div
              className="flex gap-2 items-center cursor-pointer hover:underline"
              onClick={() => regenerate()}
            >
              Retry <LuRefreshCw size={16} />
            </div>
          </div>
        )}
        {(status === "submitted" || status === "streaming") && (
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Spinner size="sm" />
            <span className="text-sm">Thinking...</span>
          </div>
        )}
        <div className="h-24 w-full"></div>
        <div ref={messagesEndRef} />
      </div>

      <div
        className={`fixed max-w-2xl w-full space-y-7 px-3 ${messages.length === 0 ? "bottom-[50%]" : "bottom-5"} transition-all duration-300`}
      >
        {messages.length === 0 && (
          <div className="text-center text-3xl font-medium ">
            What&apos;s on the agenda today?
          </div>
        )}
        <div className="flex flex-wrap gap-2 mb-2">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative group">
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <Image
                  src={url}
                  alt="Preview"
                  width={70}
                  height={70}
                  className="object-cover w-full h-full"
                />
              </div>
              <button
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 bg-white dark:bg-black rounded-full text-danger opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <IoCloseCircle size={20} />
              </button>
            </div>
          ))}
        </div>

        {uploadError && (
          <div className="text-danger text-xs px-2 mb-1 animate-pulse">
            {uploadError}
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <Textarea
          startContent={
            <div className="flex items-center gap-2 -ml-2 flex-none">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-6 h-6 rounded-full bg-default-400 flex justify-center items-center text-white cursor-pointer hover:bg-default-500 transition-colors"
                title="Add files"
              >
                <IoMdAdd size={18} />
              </div>
              {status === "ready" && (
                <SpeechToText
                  onTranscript={handleTranscript}
                  onStart={() => setBasePrompt(promptText)}
                />
              )}
            </div>
          }
          value={promptText}
          onChange={(e) => setPromtText(e.target.value)}
          endContent={
            <div>
              {promptText.trim() !== "" && status === "ready" ? (
                <div
                  onClick={handleAskAI}
                  className="w-6 h-6 -mr-2 rounded-full bg-black flex justify-center items-center text-white cursor-pointer"
                >
                  <FaArrowUpLong className="text-sm" />
                </div>
              ) : (
                (status === "submitted" || status === "streaming") && (
                  <div
                    onClick={stop}
                    className="w-6 h-6 -mr-2 rounded-full bg-black flex justify-center items-center text-white cursor-pointer"
                  >
                    <FaStop className="text-sm" />
                  </div>
                )
              )}
            </div>
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && status === "ready") {
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
        {messages.length === 0 && (
          <div className="flex gap-4 flex-wrap">
            {readyMadePrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => {
                  setPromtText(prompt);
                  handleAskAI()
                }}
                className="px-3 py-1 rounded-full border text-sm hover:border-orange-400  transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default AIChat;
