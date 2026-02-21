'use client';
import { useState, useRef, useEffect } from 'react';
import { LuMic, LuMicOff } from "react-icons/lu";
import { addToast, Button } from "@heroui/react";

interface SpeechToTextProps {
    onTranscript: (text: string) => void;
    onStart?: () => void;
}

export default function SpeechToText({ onTranscript, onStart }: SpeechToTextProps) {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        // Automatically use the browser's language setting
        recognition.lang = navigator.language || 'en-US';

        recognition.onresult = (event: any) => {
            let interim = '';
            let final = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    final += result[0].transcript;
                } else {
                    interim += result[0].transcript;
                }
            }
            if (final || interim) {
                onTranscript(final + interim);
            }
        };

        recognition.onerror = (event: any) => {
            addToast({
                title: "Speech recognition error",
                description: event.error,
                color: "danger",
            });
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;
    }, [onTranscript]);

    const toggleListening = () => {
        const recognition = recognitionRef.current;
        if (!recognition) {
            addToast({
                title: "Speech recognition error",
                description: "Speech recognition is not supported in this browser.",
                color: "danger",
            });
            return;
        }

        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
            setIsListening(true);
            onStart?.();
        }
    };

    return (
        <div className="relative w-6 h-6 flex items-center justify-center">
            {isListening && (
                <span className="absolute inset-0 rounded-full bg-blue-300 animate-ping" />
            )}
            <Button
                isIconOnly
                radius="full"
                variant="light"
                onPress={toggleListening}
                className={`${isListening ? 'text-blue-600 bg-blue-100' : 'text-default-500 hover:bg-default-100'} transition-all duration-300 z-10`}
                size="sm"
            >
                {<LuMic className='text-lg' />}
            </Button>
        </div>
    );
}
