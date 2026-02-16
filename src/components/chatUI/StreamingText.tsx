'use client';
import { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import DOMPurify from 'dompurify'; // npm i dompurify for extra safety
import { Streamdown } from 'streamdown';


import { LuCopy, LuCheck } from "react-icons/lu";

interface Props { content: string; status: string }

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

export function StreamingMarkdown({ content, status }: Props) {

    const sanitizedHtml = DOMPurify.sanitize(content);

    return (
        
        <ReactMarkdown
        //     mode='static'
        //    animated={{
        //         duration:300,
        //         animation:"blurIn",
        //         easing:"ease-out",
        //         sep:"char"
        //     }}
        //     isAnimating={status==="streaming"}
    
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
            p({ children }) {
                return <p className="mb-2 last:mb-0 text-[15px] leading-relaxed">{children}</p>;
            },
            h1({ children }) {
                return <h1 className="text-2xl font-bold mt-4 mb-2 first:mt-0">{children}</h1>;
            },
            h2({ children }) {
                return <h2 className="text-xl font-bold mt-4 mb-2 first:mt-0">{children}</h2>;
            },
            h3({ children }) {
                return <h3 className="text-lg font-bold mt-4 mb-2 first:mt-0">{children}</h3>;
            },
            h4({ children }) {
                return <h4 className="text-base font-bold mt-3 mb-1 first:mt-0">{children}</h4>;
            },
            h5({ children }) {
                return <h5 className="text-sm font-bold mt-3 mb-1 first:mt-0">{children}</h5>;
            },
            h6({ children }) {
                return <h6 className="text-xs font-bold mt-3 mb-1 first:mt-0">{children}</h6>;
            },
            hr() {
                return <hr className="my-4 border-gray-200 dark:border-gray-800" />;
            },
            ul({ children }) {
                return <ul className="list-disc ml-6 mb-2 space-y-1">{children}</ul>;
            },
            ol({ children }) {
                return <ol className="list-decimal ml-6 mb-2 space-y-1">{children}</ol>;
            },
            li({ children }) {
                return <li className="text-[15px]">{children}</li>;
            },
            code({ node, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                const isInline = !match;
                const codeString = String(children).replace(/\n$/, '');

                return isInline ? (
                    <code className="bg-default-50 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
                ) : (
                    <div className="relative group my-3">
                        <CopyButton text={codeString} />
                        <pre className="bg-default-50 p-4 rounded-xl overflow-x-auto font-mono shadow-md border border-gray-200 dark:border-gray-800">
                            <code className={className}>{children}</code>
                        </pre>
                    </div>
                );
            },
            table({ children }) {
                return (
                    <div className="overflow-x-auto my-4 rounded-lg border border-gray-200 dark:border-gray-800">
                        <table className="w-full border-collapse text-sm text-left">
                            {children}
                        </table>
                    </div>
                );
            },
            thead({ children }) {
                return <thead className="bg-gray-50 dark:bg-gray-900/50 uppercase text-xs font-semibold">{children}</thead>;
            },
            th({ children }) {
                return <th className="px-6 py-3 border-b border-gray-200 dark:border-gray-800 text-center font-bold">{children}</th>;
            },
            td({ children }) {
                return <td className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 text-center">{children}</td>;
            },
            tr({ children }) {
                return <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">{children}</tr>;
            }
        }}
        >
            {sanitizedHtml}
        </ReactMarkdown>

    );
}
