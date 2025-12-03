import { useEffect, useState } from 'react';
import { useAppSelector } from '../hooks';
import client from '../api/client';
import { Chat } from '../types';
import ChatComponent from './Chat';
import toast from 'react-hot-toast';

interface ChatListProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatList = ({ isOpen, onClose }: ChatListProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && user) {
      loadChats();
      // Polling để cập nhật danh sách chat mỗi 3 giây
      const interval = setInterval(loadChats, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen, user]);

  const loadChats = async () => {
    try {
      const { data } = await client.get<Chat[]>('/chat/me');
      setChats(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message ?? 'Không thể tải danh sách chat');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const getOtherParticipant = (chat: Chat) => {
    return chat.participants.find((p) => p.id !== user?.id);
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />
      <div className="fixed right-4 bottom-4 z-50 w-96 bg-white rounded-xl shadow-2xl flex flex-col h-[600px]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Tin nhắn</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-slate-500">Đang tải...</div>
          ) : chats.length === 0 ? (
            <div className="p-4 text-center text-slate-500">
              <p>Chưa có cuộc trò chuyện nào</p>
              <p className="text-sm mt-2">Bắt đầu chat từ trang chi tiết bất động sản</p>
            </div>
          ) : (
            <div className="divide-y">
              {chats.map((chat) => {
                const otherParticipant = getOtherParticipant(chat);
                return (
                  <button
                    key={chat._id}
                    onClick={() => setSelectedChat(chat._id)}
                    className="w-full p-4 hover:bg-slate-50 transition text-left"
                  >
                    <div className="flex items-start gap-3">
                      {otherParticipant?.avatar ? (
                        <img
                          src={otherParticipant.avatar}
                          alt={otherParticipant.name}
                          className="w-12 h-12 rounded-full flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                          {otherParticipant?.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-sm truncate">
                            {otherParticipant?.name}
                          </p>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {chat.unreadCount && chat.unreadCount > 0 && (
                              <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                                {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                              </span>
                            )}
                            {chat.lastMessageAt && (
                              <p className="text-xs text-slate-400">
                                {formatTime(chat.lastMessageAt)}
                              </p>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 truncate mb-1">
                          {chat.property.title}
                        </p>
                        {chat.lastMessage && (
                          <p className={`text-sm truncate ${chat.unreadCount && chat.unreadCount > 0 ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>
                            {chat.lastMessage}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Chat Window - Overlay */}
      {selectedChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSelectedChat(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl h-[600px] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <ChatComponent
              propertyId=""
              chatId={selectedChat}
              onClose={() => {
                setSelectedChat(null);
                loadChats(); // Reload để cập nhật lastMessage và unreadCount
              }}
              onMessageSent={loadChats}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatList;

