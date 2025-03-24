import React, { useEffect } from 'react'
import Image from 'next/image'
import { assets } from '@/assets/assets'
import Markdown from 'react-markdown'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import toast from 'react-hot-toast'

const Message = ({ role, content }) => {
    useEffect(() => {
        Prism.highlightAll()
    }, [content])

    const copyMessage = () => {
        navigator.clipboard.writeText(content)
        toast.success('Message copied to clipboard')
    }

    // ✅ Custom Code Block Component for Syntax Highlighting
    const CodeBlock = ({ value, language }) => {
        useEffect(() => {
            Prism.highlightAll()
        }, [value])
        
        return (
            <pre className="bg-gray-900 p-3 rounded-lg overflow-auto">
                <code className={`language-${language}`}>{value}</code>
            </pre>
        )
    }

    return (
        <div className="flex flex-col items-center w-full max-w-3xl text-sm">
            <div className={`flex flex-col w-full mb-8 ${role === 'user' && 'items-end'}`}>
                <div className={`group relative flex max-w-2xl py-3 rounded-xl ${role === 'user' ? 'bg-[#414158] px-5' : 'gap-3'}`}>
                    
                    {/* ✅ Action Buttons */}
                    <div className={`opacity-0 group-hover:opacity-100 absolute ${role === 'user' ? '-left-10 md:-left-16 top-2.5' : 'left-9 -bottom-6'} transition-all`}>
                        <div className="flex items-center gap-2 opacity-70">
                            {role === 'user' ? (
                                <>
                                    <Image onClick={copyMessage} src={assets.copy_icon} alt="Copy" className="w-4 cursor-pointer" />
                                    <Image src={assets.pencil_icon} alt="Edit" className="w-[18px] cursor-pointer" />
                                </>
                            ) : (
                                <>
                                    <Image onClick={copyMessage} src={assets.copy_icon} alt="Copy" className="w-[18px] cursor-pointer" />
                                    <Image src={assets.regenerate_icon} alt="Regenerate" className="w-4 cursor-pointer" />
                                    <Image src={assets.like_icon} alt="Like" className="w-4 cursor-pointer" />
                                    <Image src={assets.dislike_icon} alt="Dislike" className="w-4 cursor-pointer" />
                                </>
                            )}
                        </div>
                    </div>

                    {/* ✅ Message Content */}
                    {role === 'user' ? (
                        <span className="text-white/90">{content}</span>
                    ) : (
                        <>
                            <Image src={assets.logo_icon} alt="Bot" className="h-9 w-9 p-1 border border-white/15 rounded-full" />
                            <div className="space-y-4 w-full overflow-auto">
                                <Markdown 
                                    components={{
                                        code: ({ node, inline, className, children, ...props }) => {
                                            const match = /language-(\w+)/.exec(className || '');
                                            return !inline && match ? (
                                                <CodeBlock value={String(children).replace(/\n$/, '')} language={match[1]} />
                                            ) : (
                                                <code className="bg-gray-800 px-1 py-0.5 rounded">{children}</code>
                                            )
                                        }
                                    }}
                                >
                                    {content}
                                </Markdown>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Message
