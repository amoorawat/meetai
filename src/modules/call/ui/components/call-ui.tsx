"use client"
import { useRef, useState } from "react";
import { StreamTheme, useCall } from "@stream-io/video-react-sdk";

import { CallLobby } from "./call-lobby";
import { CallActive } from "./call-active";
import { CallEnded } from "./call-ended";


interface Props {
  meetingName: string;
};

export const CallUI = ({ meetingName }: Props) => {
  const call = useCall();
  const [show, setShow] = useState<"lobby" | "call" | "ended">("lobby");
  const isJoiningRef = useRef(false);

  const handleJoin = async () => {
    if (!call || isJoiningRef.current || show !== "lobby") return;
    isJoiningRef.current = true;

    try {
      await call.join();
      setShow("call");
    } catch (error) {
      isJoiningRef.current = false;
      throw error;
    }
  };

  const handleLeave = () => {
    if (!call) return;

    call.endCall();
    setShow("ended");
  };

  return (
    <StreamTheme className="h-full">
      {show === "lobby" && <CallLobby onJoin={handleJoin} />}
      {show === "call" && <CallActive onLeave={handleLeave} meetingName={meetingName} />}
      {show === "ended" && <CallEnded />}
    </StreamTheme>
  )
};
