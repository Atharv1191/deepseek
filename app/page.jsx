"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import Sidebar from "./components/Sidebar";
import PromptBox from "./components/PromptBox";
import Message from "./components/Message";
import { useAppContext } from "@/context/AppContext"; // ✅ Corrected context import

export default function Home() {
  const [expand, setExpand] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { selectedChat } = useAppContext(); // ✅ Fixed incorrect argument

  const containerRef = useRef(null);

  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="h-screen flex bg-[#292a2d] text-white">
      {/* Sidebar */}
      <Sidebar expand={expand} setExpand={setExpand} />

      {/* Right Section - Main Content */}
      <div className="flex flex-1 flex-col items-center justify-center relative">
        {/* Mobile Menu Toggle */}
        <div className="absolute top-6 px-4 flex items-center justify-between w-full md:hidden">
          <Image
            onClick={() => setExpand(!expand)}
            className="rotate-180 cursor-pointer"
            src={assets.menu_icon}
            alt="Menu"
            width={32}
            height={32}
            unoptimized
          />
          <Image
            className="opacity-70"
            src={assets.chat_icon}
            alt="Chat"
            width={32}
            height={32}
            unoptimized
          />
        </div>

        {/* Chat Area - Centered Content */}
        <div className="flex flex-col items-center text-center">
          {messages.length === 0 ? (
            <>
              <Image
                src={assets.logo_icon}
                alt="Logo"
                width={64}
                height={64}
                className="mb-4"
                unoptimized
              />
              <p className="text-2xl font-medium">Hi, I'm DeepSeek.</p>
              <p className="text-sm mt-2">How can I help you today?</p>
            </>
          ) : (
            <div
              className="relative flex flex-col items-center justify-start w-full mt-20 h-[calc(100vh-100px)] overflow-y-auto"
              ref={containerRef}
            >
              <p className="fixed top-8 border-transparent hover:border-gray-500/50 py-1 px-2 rounded-lg font-semibold mb-6">
                {selectedChat.name}
              </p>

              {/* ✅ Fix: Corrected `map` function */}
              {messages.map((msg, index) => (
                <Message key={index} role={msg.role} content={msg.content} />
              ))}

              {isLoading && (
                <div className="flex gap-4 max-w-3xl w-full py-3">
                  <Image
                    className="h-9 w-9 p-1 border border-white/15 rounded-full"
                    alt="Loader Icon" // ✅ Fix: Added alt attribute
                    src={assets.logo_icon}
                  />
                  <div className="loader flex justify-center items-center gap-1 animate-pulse">
                    <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                    <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                    <div className="w-1 h-1 rounded-full bg-white animate-bounce"></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <PromptBox isLoading={isLoading} setIsLoading={setIsLoading} />
        <p className="text-xs absolute bottom-0.5 text-gray-500">
          AI-generated, for reference only
        </p>
      </div>
    </div>
  );
}
