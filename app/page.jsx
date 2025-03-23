"use client";

import { useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import Sidebar from "./components/Sidebar";
import PromptBox from "./components/PromptBox";
import Message from "./components/Message";

export default function Home() {
  const [expand, setExpand] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
            <div>
              <Message role='user' content='What is Next Js'/>
            </div>
          )}
        </div>

        <PromptBox isLoading={isLoading} setIsLoading={setIsLoading}/>
        <p className="text-xs absolute bottom-1 text-gray-500">
          AI-generated, for reference only
        </p>
      </div>
    </div>
  );
}
