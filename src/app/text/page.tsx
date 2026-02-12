'use client'
import React, { useState } from 'react'

const TextSummary = () => {
    const [text, setText] = useState("");
    const [summary, setSummary] = useState<{ summary: string, keyPoints: string[], title: string } | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSummarize() {
        setLoading(true);
        setSummary(null);

        const res = await fetch("/api/summarize-text", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
        });

        const data = await res.json();
        const parsedData = JSON.parse(data.summary.kwargs.content.replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim())
        
        setSummary(parsedData);
        setLoading(false);
    }


    return (
        <main className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Text Summarizer </h1>

            <textarea
                className="w-full border p-2 rounded-lg"
                rows={2}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste text here..."
            />

            <button
                onClick={handleSummarize}
                className="mt-3 bg-black text-white px-4 py-2 rounded"
                disabled={loading}
            >
                {loading ? "Summarizing..." : "Summarize"}
            </button>

            {summary && (
                <div className="mt-4 p-3 border rounded bg-gray-50">
                    <h2 className="whitespace-pre-wrap text-lg font-semibold">{summary.title}</h2>
                    <p className="whitespace-pre-wrap mt-2">{summary.summary}</p>
                    <h3 className="whitespace-pre-wrap mt-2 font-semibold">Key Points:</h3>
                    <ul className="whitespace-pre-wrap mt-2 list-disc">
                        {summary.keyPoints.map((point, index) => (
                            <li key={index}>{point}</li>
                        ))}
                    </ul>
                </div>
            )}
        </main>
    );
}

export default TextSummary