'use client';
import { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import DOMPurify from 'dompurify'; // npm i dompurify for extra safety

import { LuCopy, LuCheck } from "react-icons/lu";

interface Props { content: string; }

const CopyButton = ({ text }: { text: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-2 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white transition-all border border-gray-700 flex items-center gap-2 text-xs backdrop-blur-sm opacity-0 group-hover:opacity-100 focus:opacity-100"
            title="Copy code"
        >
            {copied ? (
                <>
                    <LuCheck className="w-4 h-4 text-green-400" />
                    <span className="text-green-400">Copied!</span>
                </>
            ) : (
                <>
                    <LuCopy className="w-4 h-4" />
                    <span>Copy</span>
                </>
            )}
        </button>
    );
};

export function StreamingMarkdown({ content }: Props) {

    const sanitizedHtml = DOMPurify.sanitize(content);

    return (

        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
                code({ node, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    const isInline = !match;
                    const codeString = String(children).replace(/\n$/, '');

                    return isInline ? (
                        <code className="bg-gray-800/50 px-1.5 py-0.5 rounded text-sm text-blue-300 font-mono">{children}</code>
                    ) : (
                        <div className="relative group my-4">
                            <CopyButton text={codeString} />
                            <pre className="bg-gray-950 p-4 rounded-xl overflow-x-auto border border-gray-800 font-mono shadow-2xl">
                                <code className={className}>{children}</code>
                            </pre>
                        </div>
                    );
                },
                table({ children }) {
                    return (
                        <div className="overflow-x-auto my-6 rounded-lg border border-gray-800">
                            <table className="w-full border-collapse text-sm text-left text-gray-300">
                                {children}
                            </table>
                        </div>
                    );
                },
                thead({ children }) {
                    return <thead className="bg-gray-900/50 text-gray-100 uppercase text-xs">{children}</thead>;
                },
                th({ children }) {
                    return <th className="px-6 py-3 border-b border-gray-800 font-bold text-center">{children}</th>;
                },
                td({ children }) {
                    return <td className="px-6 py-4 border-b border-gray-800 text-center">{children}</td>;
                },
                tr({ children }) {
                    return <tr className="hover:bg-gray-800/30 transition-colors">{children}</tr>;
                }
            }}
        >
            {sanitizedHtml}
        </ReactMarkdown>

    );
}
