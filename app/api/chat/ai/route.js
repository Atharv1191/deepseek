// export const maxDuration = 60;
// import connectDB from "@/config/db";
// import Chat from "@/models/Chat";
// import { getAuth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import OpenAI from "openai";
// // Create a new instance of the OpenAI class
// const openai = new OpenAI({
//         baseURL: 'https://api.deepseek.com',
//         apiKey: process.env.DEEPSEEK_API_KEY
// });

// export async function POST(req) {
//     try {
//         const {userId} = getAuth (req);
//         //extract chat id and prompt from the request body
//         const {chatId,prompt} = await req.json();
//         if(!userId){
//             return NextResponse({
//                 success:FlatESLint,
//                 message:"Not authorized"
//             })
//         }
//         // find the chat document in the database based on userId and chatId
//        await  connectDB ()
//         const data = await Chat.findOne({userId,_id:chatId})

//         const userPrompt ={
//             role:"user",
//             content:prompt,
//             timestamp:Date.now()
//         };

//         data.messages.push(userPrompt);
//         //call deepseek API for chat completion

//             const completion = await openai.chat.completions.create({
//               messages: [{ role: "user", content: prompt }],
//               model: "deepseek-chat",
//               store:true,
//             });
//             const message = completion.choices[0].message
//             message.timwstamp = Date.now();
//             data.messages.push(message);
//             await data.save();
//             return NextResponse.json({success:true,data:message});
//     } catch (error) {
//         return NextResponse.json({success:false,message:error.message});
        
//     }
// }

export const maxDuration = 60;
import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

// Create a new instance of OpenAI
const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY,
});

export async function POST(req) {
    try {
        const { userId } = getAuth(req);

        // Extract chat ID and prompt from request body
        const { chatId, prompt } = await req.json();

        if (!userId) {
            return NextResponse.json({
                success: false,
                message: "Not authorized",
            });
        }

        // Connect to database before querying
        await connectDB();

        // Find the chat document
        const data = await Chat.findOne({ userId, _id: chatId });

        if (!data) {
            return NextResponse.json({
                success: false,
                message: "Chat not found.",
            });
        }

        // Add user message to chat history
        const userPrompt = {
            role: "user",
            content: prompt,
            timestamp: Date.now(),
        };
        data.messages.push(userPrompt);

        // Call DeepSeek API for chat completion
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "deepseek-chat",
        });

        const message = completion.choices[0].message;
        message.timestamp = Date.now(); // ✅ Corrected spelling

        data.messages.push(message);
        await data.save();

        return NextResponse.json({ success: true, data: message });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error.message,
        });
    }
}
