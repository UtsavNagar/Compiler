import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid'; // You'll need to install this package

// Type definitions
type Message = {
    id: string;
    content: string;
    sender: 'user' | 'gemini';
    timestamp: Date;
};

type Chat = {
    id: string;
    title: string;
    messages: Message[];
    createdAt: Date;
};

// Function to format code in the response
const formatCodeBlocks = (text: string): React.ReactNode => {
    if (!text.includes('```')) return text;

    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
        if (part.startsWith('```')) {
            // Extract language and code
            const match = part.match(/```(\w*)\n([\s\S]*?)```/);
            if (!match) return <span key={index}>{part}</span>;

            const [, language, code] = match;

            return (
                <div key={index} className="my-4 rounded-lg overflow-hidden">
                    {language && (
                        <div className="bg-gray-800 px-4 py-2 text-xs text-gray-400 flex justify-between">
                            <span>{language}</span>
                            <button
                                className="text-blue-400 hover:text-blue-300"
                                onClick={() => navigator.clipboard.writeText(code)}
                            >
                                Copy
                            </button>
                        </div>
                    )}
                    <pre className="bg-gray-900 p-4 overflow-x-auto">
                        <code className="text-gray-200 text-sm font-mono">{code}</code>
                    </pre>
                </div>
            );
        }
        return <span key={index}>{part}</span>;
    });
};

// Mock Gemini API function
const fetchGeminiResponse = async (prompt: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAXGGPGdUIx8nrr3auhN_xn99rXA8311wg', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error fetching response:', error);
        return `Sorry, there was an error processing your request. In a real implementation, this would be handled more gracefully.`;
    }
};

const ChatWithAI: React.FC = () => {
    const [chats, setChats] = useState<Chat[]>([]);
    const [activeChat, setActiveChat] = useState<Chat | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Load chats from localStorage on initial render
    useEffect(() => {
        const savedChats = localStorage.getItem('geminiChats');
        if (savedChats) {
            try {
                // Parse JSON and convert date strings back to Date objects
                const parsedChats = JSON.parse(savedChats).map((chat: any) => ({
                    ...chat,
                    createdAt: new Date(chat.createdAt),
                    messages: chat.messages.map((msg: any) => ({
                        ...msg,
                        timestamp: new Date(msg.timestamp)
                    }))
                }));
                setChats(parsedChats);

                // Set the most recent chat as active if any exist
                if (parsedChats.length > 0) {
                    setActiveChat(parsedChats[0]);
                }
            } catch (error) {
                console.error('Error parsing saved chats:', error);
            }
        }
    }, []);

    // Save chats to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('geminiChats', JSON.stringify(chats));
    }, [chats]);

    // Scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeChat?.messages]);

    const createNewChat = () => {
        const newChat: Chat = {
            id: uuidv4(),
            title: 'New Chat',
            messages: [],
            createdAt: new Date()
        };

        setChats(prev => [newChat, ...prev]);
        setActiveChat(newChat);
    };

    const updateChatTitle = (chatId: string, firstMessage: string) => {
        const words = firstMessage.split(/\s+/).slice(0, 4).join(' '); // Get first 4 words
        const newTitle = words.length > 25 ? words.substring(0, 25) + '...' : words;

        setChats(prev => prev.map(chat =>
            chat.id === chatId ? { ...chat, title: newTitle } : chat
        ));
    };


    const deleteChat = (chatId: string) => {
        setChats(prev => prev.filter(chat => chat.id !== chatId));

        // If the deleted chat was active, set a new active chat
        if (activeChat?.id === chatId) {
            const remainingChats = chats.filter(chat => chat.id !== chatId);
            setActiveChat(remainingChats.length > 0 ? remainingChats[0] : null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // Create new chat if none exists
        if (!activeChat) {
            createNewChat();
        }

        const currentChat = activeChat || {
            id: uuidv4(),
            title: 'New Chat',
            messages: [],
            createdAt: new Date()
        };

        // Add user message
        const userMessage: Message = {
            id: uuidv4(),
            content: inputValue,
            sender: 'user',
            timestamp: new Date(),
        };

        const updatedMessages = [...currentChat.messages, userMessage];
        const updatedChat = { ...currentChat, messages: updatedMessages };

        // Update the chat
        setChats(prev => prev.map(chat =>
            chat.id === updatedChat.id ? updatedChat : chat
        ));
        setActiveChat(updatedChat);

        // Update chat title if this is the first message
        if (currentChat.messages.length === 0) {
            updateChatTitle(updatedChat.id, inputValue);
        }

        setInputValue('');
        setIsLoading(true);

        try {
            // Get response from Gemini API
            const response = await fetchGeminiResponse(inputValue);

            // Add Gemini's response
            const geminiMessage: Message = {
                id: uuidv4(),
                content: response,
                sender: 'gemini',
                timestamp: new Date(),
            };

            const finalMessages = [...updatedMessages, geminiMessage];
            const finalChat = { ...updatedChat, messages: finalMessages };

            setChats(prev => prev.map(chat =>
                chat.id === finalChat.id ? finalChat : chat
            ));
            setActiveChat(finalChat);
        } catch (error) {
            console.error('Error fetching response:', error);

            // Add error message
            const errorMessage: Message = {
                id: uuidv4(),
                content: 'Sorry, there was an error processing your request.',
                sender: 'gemini',
                timestamp: new Date(),
            };

            const finalMessages = [...updatedMessages, errorMessage];
            const finalChat = { ...updatedChat, messages: finalMessages };

            setChats(prev => prev.map(chat =>
                chat.id === finalChat.id ? finalChat : chat
            ));
            setActiveChat(finalChat);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen bg-gray-900 text-gray-200">
            {/* Sidebar for chat history */}
            <div className={`bg-gray-800 ${isSidebarOpen ? 'w-64' : 'w-0'} transition-width duration-300 flex flex-col h-full`}>
                <div className="p-4 border-b border-gray-700">
                    <button
                        onClick={createNewChat}
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        New Chat
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {chats.map(chat => (
                        <div
                            key={chat.id}
                            className={`p-3 cursor-pointer flex justify-between items-center hover:bg-gray-700 ${activeChat?.id === chat.id ? 'bg-gray-700' : ''}`}
                            onClick={() => setActiveChat(chat)}
                        >
                            <input
                                type="text"
                                value={chat.title}
                                onChange={(e) => {
                                    const newTitle = e.target.value;
                                    setChats(prev => prev.map(c =>
                                        c.id === chat.id ? { ...c, title: newTitle } : c
                                    ));
                                }}
                                onBlur={() => {
                                    if (!chat.title.trim()) {
                                        updateChatTitle(chat.id, chat.messages[0]?.content || 'New Chat');
                                    }
                                }}
                                className="bg-transparent border-none outline-none flex-1 truncate text-white"
                            />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteChat(chat.id);
                                }}
                                className="text-gray-400 hover:text-red-500"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    ))}

                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="p-4 bg-gray-800 shadow flex items-center justify-between">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-md hover:bg-gray-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-bold text-center flex-1">
                        {activeChat ? activeChat.title : 'Gemini Chat'}
                    </h1>
                    <div className="w-7"></div> {/* Empty div for layout balance */}
                </header>

                {/* Local Storage Warning */}
                {activeChat && (
                    <div className="bg-blue-900 p-2 text-sm flex justify-between items-center">
                        <p>Chats are stored only on this device</p>
                        <button
                            className="text-blue-300 hover:text-blue-100"
                            onClick={() => deleteChat(activeChat.id)}
                        >
                            Delete Chat
                        </button>
                    </div>
                )}

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {!activeChat || activeChat.messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold mb-4">Welcome to Gemini Chat</h2>
                                <p>Start a conversation or select a chat from the sidebar</p>
                            </div>
                        </div>
                    ) : (
                        activeChat.messages.map(message => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-3/4 p-3 rounded-lg ${message.sender === 'user'
                                            ? 'bg-blue-600 text-white rounded-br-none'
                                            : 'bg-gray-700 rounded-bl-none'
                                        }`}
                                >
                                    {message.sender === 'gemini' ? (
                                        <div className="whitespace-pre-wrap">
                                            {formatCodeBlocks(message.content)}
                                        </div>
                                    ) : (
                                        <p className="whitespace-pre-wrap">{message.content}</p>
                                    )}
                                    <p className="text-xs opacity-75 mt-1">
                                        {new Date(message.timestamp).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-700 p-3 rounded-lg rounded-bl-none">
                                <div className="flex space-x-2">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="p-4 bg-gray-800">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 p-2 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !inputValue.trim()}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
                        >
                            Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChatWithAI;