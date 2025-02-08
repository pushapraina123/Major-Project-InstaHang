import { useState, useEffect } from "react";
import React from "react";

const contacts = [
  { id: 1, name: "Sahil" },
  { id: 2, name: "Adithya" },
  { id: 3, name: "Mohit" },
  {id:4,name: "Pushap"}
];

export default function ChatApp() {
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [messages, setMessages] = useState(() => {
    return JSON.parse(localStorage.getItem("chatMessages") || "{}");
  });
  const [input, setInput] = useState("");

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessage = { text: input, sender: "user" };
    setMessages((prev) => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), newMessage],
    }));
    setInput("");
    
    setTimeout(() => {
      const botReply = { text: "Hello! How can I help?", sender: "bot" };
      setMessages((prev) => ({
        ...prev,
        [selectedContact.id]: [...(prev[selectedContact.id] || []), botReply],
      }));
    }, 1000);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 font-sans">
      {/* Contacts List */}
      <div className="w-1/4 p-6 bg-white border-r border-gray-200 shadow-xl overflow-hidden">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-8">
          Contacts
        </h2>
        <div className="space-y-3">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`p-4 cursor-pointer rounded-xl transition-all duration-300 transform hover:scale-105 ${
                selectedContact.id === contact.id
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                  : "hover:bg-gray-100 text-gray-700 hover:shadow-md"
              }`}
              onClick={() => setSelectedContact(contact)}
            >
              <span className="font-semibold">{contact.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col p-8 overflow-hidden">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-8">
          Chat with {selectedContact.name}
        </h2>
        <div className="flex-1 overflow-auto p-6 bg-white rounded-2xl shadow-inner mb-6">
          {(messages[selectedContact.id] || []).map((msg, index) => (
            <div
              key={index}
              className={`p-4 my-3 rounded-2xl max-w-xs text-white transition-all duration-300 ${
                msg.sender === "user"
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 self-end ml-auto shadow-lg"
                  : "bg-gradient-to-r from-gray-600 to-gray-700 shadow-lg"
              }`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center space-x-4">
          <input
            className="flex-1 p-4 border-2 border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-700"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
          />
          <button
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}