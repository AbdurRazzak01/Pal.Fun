"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserCircle2, Bot } from "lucide-react";

export default function ChatMessenger({ open, onClose }) {
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hi! Welcome to Pal.Fun support chat." }
  ]);
  const [input, setInput] = useState("");
  const chatBottom = useRef(null);

  // Scroll to bottom when new message
  useEffect(() => {
    chatBottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(msgs => [...msgs, { from: "user", text: input }]);
    setTimeout(() => {
      setMessages(msgs =>
        [...msgs, { from: "bot", text: "Echo: " + input }]
      );
    }, 700);
    setInput("");
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1, transition: { type: "spring", duration: 0.5 } }}
          exit={{ x: "100%", opacity: 0, transition: { duration: 0.2 } }}
          className="fixed top-0 right-0 h-screen w-full max-w-md z-[500] bg-white dark:bg-gray-950 shadow-2xl border-l border-fuchsia-200 dark:border-fuchsia-900 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-fuchsia-200 dark:border-fuchsia-800 bg-fuchsia-50 dark:bg-fuchsia-950 rounded-tr-2xl">
            <span className="font-bold text-fuchsia-700 dark:text-fuchsia-100 text-lg">Messenger</span>
            <button onClick={onClose} className="rounded-full p-1 hover:bg-fuchsia-100 dark:hover:bg-fuchsia-800">
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-end ${msg.from === "user" ? "justify-end" : "justify-start"}`}
              >
                {/* Avatar */}
                {msg.from === "bot" && (
                  <div className="mr-2">
                    <Bot className="w-8 h-8 text-fuchsia-400 bg-fuchsia-50 dark:bg-fuchsia-900 rounded-full p-1" />
                  </div>
                )}
                <div
                  className={`
                    max-w-[75%] px-4 py-2 rounded-2xl shadow 
                    text-sm
                    ${msg.from === "user"
                      ? "ml-auto bg-gradient-to-r from-fuchsia-400 to-amber-300 text-white rounded-br-2xl rounded-tr-none"
                      : "bg-gray-100 dark:bg-gray-900 text-fuchsia-800 dark:text-fuchsia-100 rounded-bl-2xl rounded-tl-none"
                    }
                  `}
                >
                  {msg.text}
                </div>
                {/* Avatar for user */}
                {msg.from === "user" && (
                  <div className="ml-2">
                    <UserCircle2 className="w-8 h-8 text-blue-400 bg-blue-50 dark:bg-blue-900 rounded-full p-1" />
                  </div>
                )}
              </div>
            ))}
            <div ref={chatBottom} />
          </div>
          {/* Input */}
          <form
            onSubmit={sendMessage}
            className="flex gap-2 p-4 border-t border-fuchsia-200 dark:border-fuchsia-800 bg-white dark:bg-gray-950 rounded-b-2xl"
          >
            <input
              type="text"
              className="flex-1 rounded-xl border border-fuchsia-200 dark:border-fuchsia-700 px-3 py-2 outline-none bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-fuchsia-400 transition"
              placeholder="Type your message…"
              value={input}
              onChange={e => setInput(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-fuchsia-500 to-amber-400 text-white px-5 py-2 rounded-xl font-bold shadow hover:brightness-110 disabled:opacity-60"
              disabled={!input.trim()}
            >
              Send
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
