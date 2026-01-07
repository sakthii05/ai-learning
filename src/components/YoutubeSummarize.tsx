"use client";
import CustomDrawer from "@/components/common/CustomDrawer";
import CustomInput from "@/components/inputs/CustomInput";
import useDebounce from "@/hooks/useDebounce";
import { getVideoInfo } from "@/utils/common";
import { addToast, Button, Spinner, Tab, Tabs } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Key, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import YouTube, { YouTubeEvent } from "react-youtube";

export default function Home() {
    const [ytData, setYTData] = useState<{
        transcript: string | null;
        summary: string | null;
    }>({
        transcript: null,
        summary: null,
    });
    const [selected, setSelected] = useState<any>("summary");
    const [info, setInfo] = useState({
        duration: "",
        title: "",
    });
    const [notesDrawerOpen, setNotesDrawerOpen] = useState(false);
    const [notes, setnotes] = useState<{ time: number; note: string }[]>([]);

    const {
        control,
        formState: { errors },
        handleSubmit,
        setError,
        watch,
    } = useForm<any>();

    const summarizeMutation = useMutation({
        mutationFn: async (data: { transcript: string }) => {
            const result = await fetch(`/api/summarize`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ transcript: data.transcript }),
            });
            return result.json();
        },
        onSuccess: (res) => {
            console.log(res);
            setYTData({ ...ytData, summary: res.summary_text });
            addToast({
                color: "success",
                title: "Success",
                description: "",
            });
        },
        onError: (error: any) => {
            console.log(error);
            addToast({
                color: "danger",
                title: "Error",
                description: error.error,
            });
        },
    });

    const transcriptMutation = useMutation({
        mutationFn: async (data: { id: string }) => {
            const result = await fetch(
                `/api/transcript?url=${encodeURIComponent(data.id)}`,
                { method: "POST" }
            );
            if (!result.ok) {
                throw new Error("Network response was not ok");
            }
            return result.json();
        },
        onSuccess: (res) => {
            setYTData({ ...ytData, transcript: res.transcript });
            summarizeMutation.mutate({ transcript: res.transcript });
        },
        onError: (error: any) => {
            console.log(error);
            addToast({
                color: "danger",
                title: "Error",
                description: error.error,
            });
        },
    });

    function extractVideoId(url: string): string | null {
        const regex =
            /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/watch\?v=|\/v\/))([\w-]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    function getMinutesFromDuration(duration: string): number {
        const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
        const hours = parseInt(match?.[1] || "0");
        const minutes = parseInt(match?.[2] || "0");
        return hours * 60 + minutes;
    }

    const formatTime = (timeInSeconds: number) => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = Math.floor(timeInSeconds % 60);

        const pad = (num: number) => String(num).padStart(2, "0");

        if (hours > 0) {
            return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`; // hh:mm:ss
        } else {
            return `${pad(minutes)}:${pad(seconds)}`; // mm:ss
        }
    };

    const videoId: any = watch("link")
        ? extractVideoId(watch("link"))
        : undefined;

    const onSummarize = async (value: { link: string }) => {
        const videoId = extractVideoId(value.link);
        if (!videoId) {
            setError("link", {
                type: "custom",
                message: "Could not extract video ID",
            });
            return;
        }
        const info = await getVideoInfo(videoId);
        if (info) {
            setInfo(info);
        }
        const minutes = getMinutesFromDuration(info.duration);

        if (minutes > 30) {
            setError("link", {
                type: "custom",
                message: "Video is longer than 30 minutes",
            });
            return;
        }

        transcriptMutation.mutate({
            id: value.link,
        });
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-5 md:p-12 ">
            <div className="w-[95%] md:w-[80%] lg:w-[70%] xl:w-[50%]">
                <h1 className=" text-2xl md:text-5xl font-bold mb-2 text-center font-mono  text-redColor">
                    YouTube Brief{" "}
                    <span className="text-xs text-gray-500">{`(Beta)`}</span>
                </h1>
                <h2 className="text-sm mb-4 text-center">
                    Paste a valid YouTube video link (English only) with a maximum
                    duration of 30 minutes. Ensure the video is public and you can use to
                    take notes and view transcript.
                </h2>
                <form onSubmit={handleSubmit(onSummarize)} className="w-full space-y-5">
                    <CustomInput
                        name="link"
                        label="Youtube link to summarize"
                        control={control}
                        errors={errors}
                        isrequired={false}
                        rules={{
                            required: "link is required",
                            pattern: {
                                value: /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/,
                                message: "Please paste Youtube link",
                            },
                        }}
                    />
                    <Button type="submit" color="primary">
                        Summarize
                    </Button>
                </form>
                {(summarizeMutation.isPending || transcriptMutation.isPending) && (
                    <div className=" flex justify-center items-center h-40">
                        <Spinner />
                    </div>
                )}
                {ytData.transcript && ytData.summary && (
                    <div className=" p-2 rounded whitespace-pre-wrap  break-words break-all space-y-5">
                        <YouTube
                            videoId={videoId}
                            onPlay={(e) => {
                                console.log(e);
                            }}
                            onPause={(e: YouTubeEvent) => {
                                setNotesDrawerOpen(true);
                                console.log(formatTime(e.target.getCurrentTime()));
                            }}
                            opts={{
                                height: "390",
                                width: "100%",
                            }}
                        />
                        <div className="text-lg font-semibold">{info.title}</div>
                        <Tabs
                            fullWidth
                            aria-label="Tabs form"
                            selectedKey={selected}
                            size="md"
                            onSelectionChange={setSelected}
                        >
                            <Tab key="summary" title="Summary">
                                <div className="h-96 overflow-y-auto p-3">{ytData.summary}</div>
                            </Tab>
                            <Tab key="script" title="Transcript">
                                <div className="whitespace-pre-wrap p-3 h-96 overflow-y-auto">
                                    {ytData.transcript}
                                </div>
                            </Tab>
                        </Tabs>
                        {transcriptMutation.isPending ? "Loading..." : true ? "" : ""}
                    </div>
                )}
                <CustomDrawer
                    open={notesDrawerOpen}
                    onClose={() => {
                        setNotesDrawerOpen(false);
                    }}
                    title="YT Notes"
                >
                    <></>
                </CustomDrawer>
            </div>
        </main>
    );
}
