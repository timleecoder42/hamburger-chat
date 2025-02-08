'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Send, Loader2, Check, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const slideUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    opacity: 0,
    y: -50,
    transition: {
      duration: 0.2,
    },
  },
};

const checkmarkAnimation = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: 'easeInOut',
    },
  },
};

const options = [
  {
    token: 'USDC',
    description: 'Fast & Low Fees',
    icon: 'https://i.imgur.com/ODfWvjq.jpeg',
  },
];

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  isImage?: boolean;
}

const BurgerMessage = () => (
  <div className="space-y-2">
    <div className="relative w-full h-48 rounded-lg overflow-hidden">
      <Image
        src="https://i.imgur.com/8mfbu8f.jpeg"
        alt="Deluxe Cheeseburger"
        fill
        className="object-cover"
      />
    </div>
    <p className="text-sm">
      Our signature Deluxe Cheeseburger comes with a juicy beef patty, melted
      cheese, fresh lettuce, and tomatoes. Only $12.99!
    </p>
  </div>
);

const initialMessages: Message[] = [
  {
    id: 1,
    text: '👋 Hi! Your AI assistant here. Save 20% On Your Takeouts with Crypto! Process crypto payments for you via chatbot. 10x cash back than credit cards!',
    isBot: true,
  },
  {
    id: 2,
    text: '',
    isBot: true,
    isImage: true,
  },
];

type OrderStage = 'chat' | 'invoice' | 'success';

export default function ChatToSuccess() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [orderStage, setOrderStage] = useState<OrderStage>('chat');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleBack = () => {
    if (orderStage === 'invoice') {
      setOrderStage('chat');
    } else if (orderStage === 'success') {
      setOrderStage('invoice');
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: inputValue, isBot: false },
    ]);
    setInputValue('');
    setIsLoading(true);

    // Wait for animation to complete before scrolling
    setTimeout(() => {
      scrollToBottom();
    }, 100);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: "Great choice! I'll prepare your order right away.",
          isBot: true,
        },
      ]);
      setIsLoading(false);
      // Wait for bot message animation before scrolling
      setTimeout(() => {
        scrollToBottom();
        setTimeout(() => setOrderStage('invoice'), 200);
      }, 100);
    }, 300);
  };

  const handlePayment = async () => {
    try {
      setPaymentProcessing(true);
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 500));
      setOrderStage('success');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const discountAmount = 12.99 * 0.2; // 20% discount
  const totalAmount = 12.99 - discountAmount;

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
      <div className="w-[390px] mx-auto">
        <div className="rounded-[55px] bg-[#1D1D1F] p-[12px] shadow-xl relative mx-auto">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[35px] w-[126px] bg-black rounded-b-[18px] z-30" />

          <div className="rounded-[44px] bg-white overflow-hidden relative h-[800px]">
            <div className="sticky top-0 left-0 right-0 z-20 bg-[rgb(255,196,0)] px-6 pt-14 pb-4">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
              >
                {orderStage !== 'chat' && (
                  <button className="flex items-center" onClick={handleBack}>
                    <ArrowLeft className="w-5 h-5 text-white" />
                    <span className="text-white text-sm ml-1">Back</span>
                  </button>
                )}
                {orderStage === 'chat' && (
                  <button className="flex items-center">
                    <ArrowLeft className="w-5 h-5 text-white" />
                    <span className="text-white text-sm ml-1">Back</span>
                  </button>
                )}
                <div className="text-center flex-1">
                  <h1 className="text-xl font-medium text-white">
                    Foodie AI Agent
                  </h1>
                  <p className="text-sm text-white/70">31,124 monthly users</p>
                </div>
                <div className="relative w-12 h-12 bg-white rounded-full p-1">
                  <Image
                    src="https://i.imgur.com/5N3hfW7.png"
                    alt="Foodie AI Agent"
                    fill
                    className="object-contain"
                  />
                </div>
              </motion.div>
            </div>

            <AnimatePresence mode="wait">
              {orderStage === 'chat' && (
                <motion.div
                  key="chat"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={slideUp}
                  className="flex flex-col h-[calc(100%-76px)]"
                >
                  <div className="flex-1 overflow-y-auto p-4 pt-20 space-y-4 overscroll-contain bg-gray-100">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${
                          message.isBot ? 'justify-start' : 'justify-end'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] p-3 ${
                            message.isBot
                              ? 'bg-white rounded-tl-none rounded-tr-2xl rounded-br-2xl rounded-bl-2xl shadow-sm'
                              : 'bg-[rgb(255,196,0)] text-white rounded-tl-2xl rounded-tr-none rounded-br-2xl rounded-bl-2xl'
                          }`}
                        >
                          {message.isImage ? <BurgerMessage /> : message.text}
                        </div>
                      </motion.div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white p-4 rounded-tl-none rounded-tr-2xl rounded-br-2xl rounded-bl-2xl shadow-sm">
                          <Loader2 className="w-5 h-5 animate-spin text-[rgb(255,196,0)]" />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="sticky bottom-0 left-0 right-0 px-6 pt-2 pb-8 bg-white border-t border-gray-200 w-full">
                    <div className="flex gap-2 items-center">
                      <Input
                        placeholder="Type your message..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        className="rounded-xl border-gray-200"
                      />
                      <Button
                        onClick={handleSend}
                        className="rounded-xl bg-[rgb(255,196,0)] hover:bg-[rgb(255,216,20)] w-16 h-10 flex-shrink-0"
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {orderStage === 'invoice' && (
                <motion.div
                  key="invoice"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={slideUp}
                  className="p-4 pt-20 bg-white h-[calc(100%-76px)] overflow-y-auto"
                >
                  <Card className="border-0 shadow-sm mb-4 bg-white">
                    <div className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden">
                          <Image
                            src="https://i.imgur.com/8mfbu8f.jpeg"
                            alt="Deluxe Cheeseburger"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            Deluxe Cheeseburger
                          </h3>
                          <p className="text-sm text-gray-500">
                            Classic beef patty with cheese
                          </p>
                          <p className="text-lg font-bold text-gray-900 mt-1">
                            $12.99
                          </p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Subtotal</span>
                          <span className="text-gray-900">$12.99</span>
                        </div>
                        <motion.div
                          className="flex justify-between text-sm"
                          initial={{ scale: 1 }}
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            repeatDelay: 2,
                          }}
                        >
                          <span className="text-gray-500">Discount (20%)</span>
                          <span className="text-[rgb(255,196,0)]">{`-$${discountAmount.toFixed(
                            2
                          )}`}</span>
                        </motion.div>
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-gray-900">Total</span>
                          <span className="text-gray-900">{`$${totalAmount.toFixed(
                            2
                          )}`}</span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-3"
                  >
                    {options.map((option, index) => (
                      <motion.button
                        key={option.token}
                        variants={item}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full group"
                        onClick={handlePayment}
                        disabled={paymentProcessing}
                      >
                        <Card className="relative w-full p-4 hover:shadow-lg transition-shadow duration-200 border border-gray-100 bg-white">
                          <div className="flex items-center gap-4">
                            <div className="relative h-12 w-12 rounded-2xl overflow-hidden">
                              <Image
                                src={option.icon}
                                alt={option.token}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="font-semibold text-gray-900">
                                {option.token}
                              </p>
                              <p className="text-sm text-gray-500">
                                {option.description}
                              </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[rgb(255,196,0)] transition-colors" />
                          </div>
                        </Card>
                      </motion.button>
                    ))}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4"
                  >
                    <Button
                      className="w-full bg-[rgb(255,196,0)] hover:bg-[rgb(255,216,20)] text-white rounded-xl h-12 text-base font-semibold"
                      size="lg"
                      onClick={handlePayment}
                      disabled={paymentProcessing}
                    >
                      {paymentProcessing ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        'Pay with Crypto'
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              )}

              {orderStage === 'success' && (
                <motion.div
                  key="success"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={slideUp}
                  className="p-4 h-[calc(100%-76px)] flex flex-col items-center justify-center text-center"
                >
                  <motion.div
                    className="mb-8 relative"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 20,
                    }}
                  >
                    <div className="w-24 h-24 rounded-full bg-[rgb(255,196,0)]/10 flex items-center justify-center">
                      <motion.div
                        className="w-16 h-16 rounded-full bg-[rgb(255,196,0)] flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <motion.svg
                          className="w-8 h-8 text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <motion.path
                            d="M20 6L9 17L4 12"
                            variants={checkmarkAnimation}
                            initial="hidden"
                            animate="visible"
                          />
                        </motion.svg>
                      </motion.div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4"
                  >
                    <h2 className="text-2xl font-bold text-gray-900">
                      Payment Successful!
                    </h2>
                    <p className="text-gray-500 max-w-[260px] mx-auto">
                      Your order has been confirmed. You'll receive updates
                      about your delivery.
                    </p>

                    <div className="bg-white rounded-xl p-4 mt-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                          <Image
                            src="https://i.imgur.com/8mfbu8f.jpeg"
                            alt="Deluxe Cheeseburger"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">
                            Order #2412
                          </p>
                          <p className="text-sm text-gray-500">
                            Deluxe Cheeseburger
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 text-left">
                        Estimated delivery: 25-35 mins
                      </div>
                    </div>

                    <Button
                      className="mt-6 bg-[rgb(255,196,0)] hover:bg-[rgb(255,216,20)] text-white rounded-xl h-12 text-base font-semibold"
                      size="lg"
                      onClick={() => setOrderStage('chat')}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Order More
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
