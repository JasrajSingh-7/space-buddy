import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

const GurudevChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Namaste! I am Gurudev, your cosmic guide. Ask me about stars, planets, galaxies, or any celestial wonder!",
      sender: 'bot'
    }
  ]);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const getBotResponse = async (query: string): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('gurudev-chat', {
        body: { message: query }
      });

      if (error) {
        console.error("Edge function error:", error);
        throw new Error(error.message);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      return data?.reply || "The cosmos whispers... please ask again.";
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Connection lost",
        description: "Unable to reach Gurudev. Please try again.",
        variant: "destructive"
      });
      return "Apologies, the cosmic connection is disrupted. Please try again in a moment.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue;
    setMessages(prev => [...prev, { id: Date.now(), text: userText, sender: 'user' }]);
    setInputValue('');
    setIsTyping(true);

    const responseText = await getBotResponse(userText);
    
    setMessages(prev => [...prev, { id: Date.now() + 1, text: responseText, sender: 'bot' }]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end font-sans md:bottom-6 md:right-6">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[calc(100vw-2rem)] max-w-[350px] h-[450px] md:h-[500px] flex flex-col rounded-2xl overflow-hidden border border-moon-rock/50 shadow-2xl backdrop-blur-xl bg-deep-void/95 animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-pale-nebula/20 to-moon-rock/30 p-4 flex justify-between items-center border-b border-moon-rock/50">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pale-nebula" />
              <h2 className="text-starlight font-bold text-lg tracking-wide">Gurudev</h2>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-starlight/60 hover:text-starlight transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-moon-rock scrollbar-track-transparent">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-br from-pale-nebula to-pale-nebula/80 text-deep-void rounded-br-sm shadow-lg shadow-pale-nebula/10' 
                      : 'bg-moon-rock/60 text-starlight border border-moon-rock/50 rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-moon-rock/60 p-3 rounded-2xl rounded-bl-sm border border-moon-rock/50 flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-pale-nebula rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-pale-nebula rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-pale-nebula rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-deep-void border-t border-moon-rock/50">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about the cosmos..."
                disabled={isTyping}
                className="flex-1 bg-moon-rock/40 border border-moon-rock/60 text-starlight placeholder-starlight/40 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-pale-nebula focus:ring-1 focus:ring-pale-nebula transition-all disabled:opacity-50"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-pale-nebula hover:bg-pale-nebula/90 disabled:bg-moon-rock disabled:cursor-not-allowed text-deep-void p-2.5 rounded-full transition-all shadow-lg shadow-pale-nebula/20 active:scale-95 flex items-center justify-center"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 ${
          isOpen 
            ? 'rotate-90 bg-moon-rock hover:bg-moon-rock/80' 
            : 'bg-gradient-to-r from-pale-nebula to-pale-nebula/80 hover:from-pale-nebula/90 hover:to-pale-nebula/70 glow-accent'
        }`}
      >
        {isOpen ? (
          <X className="text-starlight w-7 h-7" />
        ) : (
          <MessageCircle className="text-deep-void w-7 h-7" />
        )}
      </button>
    </div>
  );
};

export default GurudevChatbot;
