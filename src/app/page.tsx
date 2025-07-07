"use client";

import CustomInput from "@/components/inputs/CustomInput";
import useDebounce from "@/hooks/useDebounce";
import { getTranscript, getVideoInfo } from "@/utils/common";
import { addToast, Button } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Home() {
  const [transcript, setTranscript] = useState<{ transcript: string } | null>(
    null
  );
  const [info, setInfo] = useState({
    duration: "",
    title: "",
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
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
      setTranscript(res);
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

    if (minutes > 60) {
      setError("link", {
        type: "custom",
        message: "Video is longer than 60 minutes",
      });
      return;
    }

    transcriptMutation.mutate({
      id: value.link,
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12">
      <h1 className="text-5xl font-bold mb-2 text-center font-mono">
        Transformers.js
      </h1>
      <h2 className="text-2xl mb-4 text-center">
        Next.js template (server-side)
      </h2>
      <form onSubmit={handleSubmit(onSummarize)} className="w-[50%] space-y-5">
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

      <pre className="bg-gray-100 text-black p-2 rounded whitespace-pre-wrap w-[50%] break-words break-all h-96 overflow-y-auto">
        {transcriptMutation.isPending
          ? "Loading..."
          : transcript
          ? transcript.transcript
          : ""}
      </pre>
    </main>
  );
}
