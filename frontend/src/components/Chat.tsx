import { useEffect, useState, useRef } from 'react';
import { useAppSelector } from '../hooks';
import client from '../api/client';
import { Chat, Message } from '../types';
import toast from 'react-hot-toast';

interface ChatProps {
  propertyId: string;
  chatId?: string;
  onClose: () => void;
  onMessageSent?: () => void;
}

const ChatComponent = ({ propertyId, chatId, onClose, onMessageSent }: ChatProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatId) {
      // Nếu có chatId, load trực tiếp chat đó
      setLoading(true);
      client.get<Chat>(`/chat/${chatId}`)
        .then(({ data }) => {
          setChat(data);
          setLoading(false);
        })
        .catch((error: any) => {
          toast.error(error.response?.data?.message ?? 'Không thể tải chat');
          onClose();
          setLoading(false);
        });
    } else if (propertyId) {
      // Nếu không có chatId, tạo hoặc lấy chat từ propertyId
      loadChat();
    }
  }, [propertyId, chatId]);

  useEffect(() => {
    if (chat) {
      loadMessages();
      // Polling để lấy messages mới mỗi 2 giây
      const interval = setInterval(loadMessages, 2000);
      return () => clearInterval(interval);
    }
  }, [chat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChat = async () => {
    try {
      const { data } = await client.get<Chat>(`/chat/property/${propertyId}`);
      setChat(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? 'Không thể tải chat');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    if (!chat) return;
    try {
      const { data } = await client.get<Message[]>(`/chat/${chat._id}/messages`);
      setMessages(data);
    } catch (error: any) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chat) return;

    try {
      const { data } = await client.post<Message>(`/chat/${chat._id}/messages`, {
        content: newMessage.trim()
      });
      setMessages((prev) => [...prev, data]);
      setNewMessage('');
      // Cập nhật lastMessage của chat
      setChat((prev) => prev ? { ...prev, lastMessage: data.content, lastMessageAt: data.createdAt } : null);
      // Gọi callback để cập nhật danh sách chat
      if (onMessageSent) {
        onMessageSent();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? 'Không thể gửi tin nhắn');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-xl p-6">Đang tải...</div>
      </div>
    );
  }

  if (!chat) return null;

  const otherParticipant = chat.participants.find((p) => p.id !== user?.id);

  return (
    <div className="w-full h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            {otherParticipant?.avatar ? (
              <img
                src={otherParticipant.avatar}
                alt={otherParticipant.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                {otherParticipant?.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-semibold">{otherParticipant?.name}</p>
              <p className="text-xs text-slate-500">{chat.property.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Messages */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-3"
        >
          {messages.length === 0 ? (
            <p className="text-center text-slate-500 text-sm">Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</p>
          ) : (
            messages.map((message) => {
              const isOwn = message.sender.id === user?.id;
              return (
                <div
                  key={message._id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      isOwn
                        ? 'bg-primary text-white'
                        : 'bg-slate-100 text-slate-900'
                    }`}
                  >
                    {!isOwn && (
                      <p className="text-xs font-semibold mb-1 opacity-80">
                        {message.sender.name}
                      </p>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 ${isOwn ? 'text-white/70' : 'text-slate-500'}`}>
                      {new Date(message.createdAt).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-1 form-input"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Gửi
            </button>
          </div>
        </form>
      </div>
  );
};

export default ChatComponent;

