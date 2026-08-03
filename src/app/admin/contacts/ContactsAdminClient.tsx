"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Search, Trash2, Reply, Send, Clock, Filter, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  details: string;
  status: string;
  createdAt: string;
};

export default function ContactsAdminClient({ initialContacts }: { initialContacts: ContactSubmission[] }) {
  const [contacts, setContacts] = useState<ContactSubmission[]>(initialContacts);
  const [activeId, setActiveId] = useState<string | null>(initialContacts.length > 0 ? initialContacts[0].id : null);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sessionReplies, setSessionReplies] = useState<Record<string, string[]>>({});
  const [previewMode, setPreviewMode] = useState(false);

  const activeContact = contacts.find(c => c.id === activeId);
  
  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transmission?")) return;
    try {
      await fetch("/api/admin/contacts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      setContacts(contacts.filter(c => c.id !== id));
      if (activeId === id) setActiveId(null);
    } catch (e) {
      alert("Failed to delete");
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch("/api/admin/contacts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "READ" })
      });
      setContacts(contacts.map(c => c.id === id ? { ...c, status: "READ" } : c));
    } catch (e) {
      console.error(e);
    }
  };

  const handleReply = async () => {
    if (!activeContact || !replyText.trim()) return;
    setIsSending(true);
    try {
      const res = await fetch("/api/admin/contacts/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: activeContact.email, message: replyText })
      });
      
      if (!res.ok) throw new Error("Failed to send reply");
      
      setSessionReplies(prev => ({
        ...prev,
        [activeContact.id]: [...(prev[activeContact.id] || []), replyText]
      }));
      
      setIsReplying(false);
      setReplyText("");
      
      // Auto-mark as read if replied
      if (activeContact.status === "UNREAD") {
        await handleMarkAsRead(activeContact.id);
      }
    } catch (e: any) {
      alert(e.message || "Failed to send email.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-2 text-white flex items-center gap-3">
            <Mail className="text-[#007fd4]" /> Transmissions
          </h1>
          <p className="text-gray-400 font-light text-sm">Secure Communications & Client Intake</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search comms..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#007fd4] w-64 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        
        {/* Email List Panel */}
        <div className="w-1/3 bg-white/5 border border-white/10 rounded-2xl flex flex-col overflow-hidden backdrop-blur-md">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Inbox ({contacts.filter(c=>c.status === "UNREAD").length} Unread)</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredContacts.length === 0 && (
               <div className="p-8 text-center text-gray-500 italic text-sm">No transmissions found.</div>
            )}
            {filteredContacts.map((contact) => (
              <div 
                key={contact.id} 
                onClick={() => { 
                  setActiveId(contact.id); 
                  setIsReplying(false); 
                  setPreviewMode(false);
                  if (contact.status === "UNREAD") handleMarkAsRead(contact.id);
                }}
                className={`p-5 border-b border-white/5 cursor-pointer transition-all ${activeId === contact.id ? 'bg-[#007fd4]/10 border-l-4 border-l-[#007fd4]' : 'hover:bg-white/5 border-l-4 border-l-transparent'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-bold truncate pr-4 ${contact.status === "UNREAD" ? 'text-white' : 'text-gray-300'}`}>{contact.name}</h3>
                  <span className="text-[10px] text-[#007fd4] font-mono whitespace-nowrap pt-1">
                    {formatDistanceToNow(new Date(contact.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className={`text-xs truncate ${contact.status === "UNREAD" ? 'text-gray-200 font-semibold' : 'text-gray-400'}`}>{contact.email}</h4>
                  {contact.status === "UNREAD" && <div className="w-2 h-2 rounded-full bg-[#007fd4] shrink-0"></div>}
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{contact.details}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Email Reader / Replier Panel */}
        <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl flex flex-col overflow-hidden backdrop-blur-md relative">
          {activeContact ? (
            <>
              {/* Toolbar */}
              <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-black/40">
                <div className="flex items-center gap-4">
                  <button onClick={() => handleDelete(activeContact.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                  {activeContact.status === "UNREAD" && (
                    <button onClick={() => handleMarkAsRead(activeContact.id)} className="text-gray-400 hover:text-green-500 transition-colors tooltip" title="Mark as Read">
                      <CheckCircle2 size={16} />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => setIsReplying(!isReplying)} className="flex items-center gap-2 bg-[#007fd4] hover:bg-[#008cf2] text-white px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors">
                    <Reply size={14} /> Reply
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {/* Email Header */}
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#007fd4] to-[#9c27b0] flex items-center justify-center text-xl font-black text-white shadow-lg uppercase">
                      {activeContact.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">New Transmission</h2>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-gray-300 font-medium">{activeContact.name}</span>
                        <span className="text-gray-600">&lt;{activeContact.email}&gt;</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400 flex items-center gap-1.5 justify-end mb-2">
                      <Clock size={14} /> {new Date(activeContact.createdAt).toLocaleString()}
                    </div>
                    <div className={`border px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest inline-block ${activeContact.status === "UNREAD" ? "bg-green-500/20 border-green-500/30 text-green-400" : "bg-gray-500/20 border-gray-500/30 text-gray-400"}`}>
                      {activeContact.status}
                    </div>
                  </div>
                </div>

                {/* Email Body */}
                <div className="prose prose-invert max-w-none text-gray-300 font-light leading-loose whitespace-pre-wrap">
                  {activeContact.details}
                </div>

                {/* Simulated Replies Thread */}
                {sessionReplies[activeContact.id]?.map((reply, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }}
                    key={i} 
                    className="mt-8 relative"
                  >
                    {/* Connecting line */}
                    <div className="absolute left-[-20px] top-[-20px] bottom-0 w-px bg-white/10"></div>
                    <div className="absolute left-[-20px] top-4 w-5 h-px bg-white/10"></div>
                    
                    <div className="bg-[#007fd4]/10 border border-[#007fd4]/20 rounded-2xl p-6 ml-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-[#007fd4] flex items-center justify-center text-white font-bold text-xs shadow-[0_0_10px_#007fd4]">
                          OF
                        </div>
                        <div>
                          <span className="text-white font-bold text-sm block">OneFrame Support</span>
                          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Just now</span>
                        </div>
                      </div>
                      <div className="text-gray-300 font-light leading-loose whitespace-pre-wrap text-sm">
                        {reply}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Reply Interface */}
                <AnimatePresence>
                  {isReplying && (
                    <motion.div 
                      key="reply-interface"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="mt-8 border border-white/10 rounded-2xl overflow-hidden bg-black/40 shadow-2xl"
                    >
                      <div className="px-4 py-3 bg-[#111] border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Reply size={14} className="text-[#007fd4]" />
                          <span className="text-xs text-gray-400 font-mono">Replying to <span className="text-white font-bold">{activeContact.email}</span></span>
                        </div>
                        <div className="flex items-center bg-black/50 border border-white/10 rounded-lg overflow-hidden">
                          <button onClick={() => setPreviewMode(false)} className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${!previewMode ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}>Write</button>
                          <button onClick={() => setPreviewMode(true)} className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${previewMode ? 'bg-[#007fd4] text-white' : 'text-gray-500 hover:text-gray-300'}`}>Preview</button>
                        </div>
                      </div>
                      
                      {!previewMode && (
                        <div className="bg-[#111] border-b border-white/5 pb-2 text-white quill-wrapper">
                           <ReactQuill 
                              theme="snow" 
                              value={replyText} 
                              onChange={setReplyText} 
                              placeholder={`Dear ${activeContact.name},\n\nThank you for reaching out to OneFrame Studios...`}
                              modules={{
                                toolbar: [
                                  [{ 'header': [1, 2, false] }],
                                  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                  [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                                  ['link'],
                                  ['clean']
                                ],
                              }}
                           />
                        </div>
                      )}

                      {previewMode && (
                        <div className="w-full bg-[#f9f9f9] text-black p-8 min-h-[200px] leading-relaxed">
                           {/* Email Client Preview Wrapper */}
                           <div className="max-w-2xl mx-auto bg-white border border-gray-200 shadow-sm p-8 rounded">
                             <div className="mb-6 border-b border-gray-100 pb-4">
                               <img src="/logo.png" alt="OneFrame Logo" className="h-6 mb-4 opacity-50" />
                               <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Secure Transmission</p>
                             </div>
                             <div className="whitespace-pre-wrap text-[15px] font-sans text-gray-800 ql-editor" dangerouslySetInnerHTML={{ __html: replyText || '<span class="text-gray-300 italic">No content to preview...</span>' }}>
                             </div>
                             <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-gray-400">
                               <p><strong>OneFrame Studios</strong><br/>Post-Production & Finishing</p>
                             </div>
                           </div>
                        </div>
                      )}
                      
                      <div className="px-4 py-3 bg-[#111] border-t border-white/10 flex justify-between items-center">
                        <button onClick={() => { setIsReplying(false); setPreviewMode(false); }} className="text-xs text-gray-500 hover:text-white uppercase tracking-widest font-bold px-3 py-2 transition-colors">
                          Discard
                        </button>
                        <button 
                          onClick={handleReply}
                          disabled={isSending || !replyText.trim()}
                          className="flex items-center gap-2 bg-white text-black hover:bg-[#007fd4] hover:text-white px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-colors disabled:opacity-50"
                        >
                          {isSending ? "Transmitting..." : "Send"} <Send size={14} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <Mail size={48} className="mb-4 opacity-20" />
              <p className="uppercase tracking-widest text-sm font-bold">Select a transmission to decrypt</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
