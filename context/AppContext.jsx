// "use client"; // Ensure this is at the top

// import { useAuth, useUser } from "@clerk/nextjs";
// import axios from "axios";
// import { createContext, useContext, useEffect, useState } from "react";
// import toast from "react-hot-toast";

// export const AppContext = createContext();

// export const useAppContext = () => {
//     return useContext(AppContext);
// };

// export const AppContextProvider = ({ children }) => {
//     const { user } = useUser();
//     const { getToken } = useAuth();

//     const [chats, setChats] = useState([]);
//     const [selectedChat, setSelectedChat] = useState(null);

//     const createNewChat = async () => {
//         try {
//             if (!user) return null;

//             const token = await getToken();
//             const { data } = await axios.post('/api/chat/create', {}, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             fetchUsersChats();
//         } catch (error) {
//             toast.error(error.message);
//         }
//     };

//     const fetchUsersChats = async () => {
//         try {
//             const token = await getToken();
//             const { data } = await axios.get('/api/chat/get', {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             if (data.success) {
//                 console.log(data.data);
//                 setChats(data.data);

//                 // If the user has no chats, create one
//                 if (data.data.length === 0) {
//                     await createNewChat();
//                     return fetchUsersChats();
//                 } else {
//                     // Sort chats by updated date
//                     data.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
//                     setSelectedChat(data.data[0]);
//                     console.log(data.data[0]);
//                 }
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             toast.error(error.message);
//         }
//     };

//     useEffect(() => {
//         if (user) {
//             fetchUsersChats();
//         }
//     }, [user]);

//     const value = {
//         user,
//         chats,
//         setChats,
//         selectedChat,
//         setSelectedChat,
//         fetchUsersChats,
//         createNewChat
//     };

//     return (
//         <AppContext.Provider value={value}>
//             {children}
//         </AppContext.Provider>
//     );
// };


"use client"; // Ensure this is at the top

import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext);
};

export const AppContextProvider = ({ children }) => {
    const { user } = useUser();
    const { getToken } = useAuth();

    const [chats, setChats] = useState([]); 
    const [selectedChat, setSelectedChat] = useState(null);

    const createNewChat = async () => {
        try {
            if (!user) return null;

            const token = await getToken();
            const { data } = await axios.post('/api/chat/create', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data?.success) {
                return data.data; // ✅ Return new chat for immediate use
            } else {
                toast.error("Failed to create chat.");
                return null;
            }
        } catch (error) {
            toast.error(error?.message || "Error creating chat.");
            return null;
        }
    };

    const fetchUsersChats = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get('/api/chat/get', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data?.success && Array.isArray(data?.data)) {
                setChats(data.data);

                if (data.data.length === 0) {
                    console.log("No chats found, creating a new one...");
                    const newChat = await createNewChat();
                    if (newChat) {
                        setChats([newChat]);
                        setSelectedChat(newChat);
                        console.log("New chat created and selected:", newChat);
                    } else {
                        toast.error("No chats found!");
                    }
                } else {
                    console.log("Chats found, selecting the most recent one...", data.data);
                    const sortedChats = data.data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

                    setChats(sortedChats);
                    setSelectedChat(sortedChats[0]);  
                    console.log("Selected chat:", sortedChats[0]);  
                }
            } else {
                console.warn("Unexpected API response:", data);
                setChats([]);
                setSelectedChat(null);
            }
        } catch (error) {
            toast.error(error?.message || "Error fetching chats.");
            setChats([]);
            setSelectedChat(null);
        }
    };

    useEffect(() => {
        if (user) {
            fetchUsersChats();
        }
    }, [user]);

    const value = {
        user,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        fetchUsersChats,
        createNewChat
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
