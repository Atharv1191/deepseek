import { assets } from '@/assets/assets';
import { useAppContext } from '@/context/AppContext';
import axios from 'axios';
import Image from 'next/image';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const PromptBox = ({ setIsLoading, isLoading }) => {
    const [prompt, setPrompt] = useState('');
    const { user, chats, setChats, selectedChat, setSelectedChat } = useAppContext();

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendPrompt(e);
        }
    };

    const sendPrompt = async (e) => {
        e.preventDefault();

        if (!user) return toast.error('You need to be logged in to send a message');
        if (!selectedChat) return toast.error('No chat selected. Please refresh or start a new chat.');
        if (isLoading) return toast.error('Wait for the previous prompt response');
        if (!prompt.trim()) return toast.error('Cannot send an empty message');

        setIsLoading(true);
        setPrompt('');

        const userPrompt = {
            role: 'user',
            content: prompt,
            timestamp: Date.now(),
        };

        try {
            setChats((prevChats) =>
                prevChats.map((chat) =>
                    chat._id === selectedChat._id
                        ? { ...chat, messages: [...(chat.messages || []), userPrompt] }
                        : chat
                )
            );

            setSelectedChat((prev) => ({
                ...prev,
                messages: prev?.messages ? [...prev.messages, userPrompt] : [userPrompt],
            }));

            const { data } = await axios.post('/api/chat/ai', { chatId: selectedChat._id, prompt });

            if (data.success) {
                const aiMessage = {
                    role: 'assistant',
                    content: data.data.content,
                    timestamp: Date.now(),
                };

                setChats((prevChats) =>
                    prevChats.map((chat) =>
                        chat._id === selectedChat._id
                            ? { ...chat, messages: [...(chat.messages || []), aiMessage] }
                            : chat
                    )
                );

                setSelectedChat((prev) => ({
                    ...prev,
                    messages: prev?.messages ? [...prev.messages, aiMessage] : [aiMessage],
                }));
            } else {
                toast.error(data.message);
                setPrompt(prompt);
            }
        } catch (error) {
            toast.error(error.message);
            setPrompt(prompt);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
            onSubmit={sendPrompt}
            className="w-[95%] sm:w-[90%] md:w-3/4 lg:w-1/2 bg-[#404045] p-3 md:p-4 rounded-xl fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10 shadow-md flex flex-col"
        >
            <textarea
                onKeyDown={handleKeyDown}
                className="w-full resize-none bg-transparent outline-none text-sm md:text-base p-3 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[40px] md:min-h-[50px] max-h-[150px] overflow-y-auto"
                rows={2}
                placeholder="Message DeepSeek..."
                onChange={(e) => setPrompt(e.target.value)}
                value={prompt}
                style={{ minHeight: '40px', maxHeight: '150px' }}
            />
            <div className="flex items-center justify-between text-xs md:text-sm mt-2 md:mt-3">
                <div className="flex items-center gap-2 flex-wrap">
                    <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
                        <Image className="w-5 h-5" src={assets.deepthink_icon} alt="Deepthink Icon" />
                        Deepthink (R1)
                    </p>
                    <p className="flex items-center gap-2 text-xs border border-gray-300/40 px-3 py-1.5 rounded-full cursor-pointer hover:bg-gray-500/20 transition">
                        <Image className="w-5 h-5" src={assets.search_icon} alt="Search Icon" />
                        Search
                    </p>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                    <Image className="w-5 cursor-pointer hover:opacity-80 transition" src={assets.pin_icon} alt="Pin Icon" />
                    <button
                        type="submit"
                        className={`${prompt ? "bg-blue-500 hover:bg-blue-600" : "bg-[#71717a]"} rounded-full p-2 md:p-3 transition`}
                        disabled={!prompt.trim() || isLoading}
                    >
                        <Image
                            className="w-4 aspect-square"
                            src={prompt ? assets.arrow_icon : assets.arrow_icon_dull}
                            alt="Send Icon"
                        />
                    </button>
                </div>
            </div>
        </form>
    );
};

export default PromptBox;
