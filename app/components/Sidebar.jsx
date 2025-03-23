import { assets } from '@/assets/assets';
import Image from 'next/image';
import React, { useState } from 'react';
import { useClerk,UserButton } from '@clerk/nextjs';
import { AppContext, useAppContext } from '@/context/AppContext';
import Chatlabel from './Chatlabel';
const Sidebar = ({ expand, setExpand }) => {
    const {openSignIn} = useClerk()
    const {user} = useAppContext(AppContext)
    const [openMenu,setOpenMenu ] = useState({id:0, open:false})
    return (
        <div className={`fixed md:relative flex flex-col justify-between bg-[#292a2d] pt-7 transition-all z-50 h-screen ${expand ? 'p-4 w-64' : 'md:w-20 w-16 max-md:w-0 overflow-hidden'}`}>
            <div>
                {/* Sidebar Header */}
                <div className={`flex ${expand ? "flex-row gap-10" : "flex-col items-center gap-8"}`}>
                    <Image className={expand ? "w-36" : "w-10"} src={expand ? assets.logo_text : assets.logo_icon} alt="Logo" />

                    {/* Sidebar Toggle Button */}
                    <div 
                        onClick={() => setExpand(!expand)} 
                        className="relative flex items-center justify-center hover:bg-gray-500/20 transition-all duration-300 h-9 w-9 rounded-lg cursor-pointer group"
                    >
                        <Image src={assets.menu_icon} alt="Menu Icon" className="md:hidden" />
                        <Image src={expand ? assets.sidebar_close_icon : assets.sidebar_icon} alt="Sidebar Toggle Icon" className="hidden md:block w-7" />

                        {/* Tooltip */}
                        <div className="absolute bg-black text-white text-xs rounded px-2 py-1 -top-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            {expand ? "Close sidebar" : "Open sidebar"}
                            <div className={`w-3 h-3 absolute bg-black rotate-45 ${expand ? "left-1/2 -top-1.5 -translate-x-1/2" : "left-4 -bottom-1.5"}`}></div>
                        </div>
                    </div>
                </div>

                {/* New Chat Button */}
                <button className={`mt-8 flex items-center justify-center cursor-pointer ${expand ? "bg-blue-500 hover:opacity-90 rounded-2xl gap-2.5 px-4 py-2" : "group relative h-9 w-9 mx-auto hover:bg-gray-500/30 rounded-lg"}`}>
                    <Image
                        src={expand ? assets.chat_icon : assets.chat_icon_dull}
                        alt=''
                        className={expand ? 'w-6' : 'w-7'}
                    />
                    <div className="absolute w-max left-1/2 transform -translate-x-1/2 -top-10 opacity-0 group-hover:opacity-100 transition bg-black text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none">
                        New Chat
                        <div className="w-3 h-3 absolute bg-black rotate-45 left-1/2 transform -translate-x-1/2 -bottom-1.5"></div>
                    </div>
                    {expand && <p className="text-white text-sm font-medium">New chat</p>}
                </button>

                {/* Recent Chats Label */}
                <div className={`mt-8 text-white/25 text-sm ${expand ? "block" : "hidden"}`}>
                    <p className="my-1">Recents</p>
                    {/* --------chatLabel----------- */}
                    <Chatlabel openMenu={openMenu} setOpenMenu={setOpenMenu}/>
                </div>
            </div>

            {/* Get App Section */}
            <div className="mt-8">
                <div className={`flex items-center group relative ${expand ? "gap-2 text-white/80 text-sm p-2.5 border border-primary rounded-lg hover:bg-white/10" : "h-10 w-10 mx-auto hover:bg-gray-500/30 rounded-lg"}`}>
                    <Image src={expand ? assets.phone_icon : assets.phone_icon_dull} alt="Phone Icon" className={expand ? "w-5" : "w-6 mx-auto"} />

                    {/* Tooltip & QR Code */}
                    <div className={`absolute -top-60 pb-8 opacity-0 group-hover:opacity-100 transition ${!expand ? "-right-40" : "left-1/2 transform -translate-x-1/2"}`}>
                        <div className="relative w-max bg-black text-white text-sm p-3 rounded-lg shadow-lg">
                            <Image src={assets.qrcode} alt="QR Code" className="w-44" />
                            <p>Scan to get DeepSeek App</p>
                            <div className={`w-3 h-3 absolute bg-black rotate-45 ${expand ? "right-1/2" : "left-4"} -bottom-1.5`}></div>
                        </div>
                    </div>

                    {/* Get App Label */}
                    {expand && (
                        <>
                            <span>Get App</span>
                            <Image alt="New Icon" src={assets.new_icon} />
                        </>
                    )}
                </div>
                <div onClick={user? null: openSignIn} className={`flex items-center ${expand?"hover:bg-white/10 rounded-lg":'justify-center w-full'} gap-3 text-white/60 text-sm p-2 mt-2 cursor-pointer`}>
                {
                    user ? <UserButton/>:<Image src={assets.profile_icon} alt='' className='w-7'/>
                }
                    
                    {expand && <span>My Profile</span>}
                </div>

            </div>
        </div>
    );
};

export default Sidebar;
