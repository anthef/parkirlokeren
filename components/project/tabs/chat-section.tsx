"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { RiSendPlaneLine } from "react-icons/ri";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message, Project } from "../types";
import { useToast } from "@/components/ui/use-toast";
import ReactMarkdown from "react-markdown";
import { createClient } from "@/utils/supabase/client";

interface ChatSectionProps {
  readonly projectId?: string;
}

export default function ChatSection({ projectId }: Readonly<ChatSectionProps>) {
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  // Initialize Supabase client
  const supabase = createClient();

  // Fetch project details and set welcome message
  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!projectId) {
        setIsLoading(false);
        setMessages([createDefaultWelcomeMessage()]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("project")
          .select("*")
          .eq("id", projectId)
          .single();

        if (error) {
          console.error("Error fetching project details:", error);
          toast({
            title: "Error",
            description:
              "Failed to load project details. Using default assistant.",
            variant: "destructive",
          });
          setMessages([createDefaultWelcomeMessage()]);
        } else if (data) {
          setProject(data as Project);
          setMessages([createProjectSpecificWelcomeMessage(data as Project)]);
        }
      } catch (error) {
        console.error("Error in fetchProjectDetails:", error);
        setMessages([createDefaultWelcomeMessage()]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId, supabase, toast]);

  // Create a default welcome message
  const createDefaultWelcomeMessage = (): Message => {
    return {
      role: "assistant",
      content:
        "## Welcome to your Business Advisor Assistant\n\nI'm here to help you with your business project. I can assist with:\n\n- Business planning and strategy\n- Market analysis and competitor research\n- Financial projections and investment advice\n- Operational requirements and scaling strategies\n- Marketing and sales approaches\n\nWhat would you like to discuss?",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      metadata: {
        isWelcomeMessage: true,
      },
    };
  };
  // Create a project-specific welcome message
  const createProjectSpecificWelcomeMessage = (project: Project): Message => {
    // Helper function to check if project has specific data
    const hasProjectData = (fields: (keyof Project)[]): boolean => {
      return fields.some((field) => {
        const value = project[field];
        return value !== undefined && value !== null && value !== "";
      });
    };

    // Build a more detailed welcome message with project specifics
    let welcomeContent = `## Welcome to your Business Advisor Assistant\n\n`;
    welcomeContent += `I'm here to help you with your **${project.title}** project. `;

    // Add project details
    if (project.description) {
      welcomeContent += `\n\n### About Your Project\n${project.description}\n\n`;
    }

    // Add key project metrics if available
    const hasMetrics =
      project.investment_required ??
      project.time_commitment ??
      project.risk_level ??
      project.potential_returns;

    if (hasMetrics) {
      welcomeContent += `### Key Project Metrics\n`;
      if (project.investment_required)
        welcomeContent += `- Investment Required: ${project.investment_required}\n`;
      if (project.time_commitment)
        welcomeContent += `- Time Commitment: ${project.time_commitment}\n`;
      if (project.risk_level)
        welcomeContent += `- Risk Level: ${project.risk_level}\n`;
      if (project.potential_returns)
        welcomeContent += `- Potential Returns: ${project.potential_returns}\n`;
      welcomeContent += `\n`;
    }

    // Add market information if available
    if (hasProjectData(["market_size", "target_audience"])) {
      welcomeContent += `### Market Information\n`;
      if (project.market_size)
        welcomeContent += `- Market Size: ${project.market_size}\n`;
      if (project.target_audience)
        welcomeContent += `- Target Audience: ${project.target_audience}\n`;
      welcomeContent += `\n`;
    }

    // Add financial information if available
    if (
      hasProjectData([
        "initial_investment",
        "break_event_point",
        "profit_margin",
      ])
    ) {
      welcomeContent += `### Financial Highlights\n`;
      if (project.initial_investment)
        welcomeContent += `- Initial Investment: ${project.initial_investment}\n`;
      if (project.break_event_point)
        welcomeContent += `- Break Even Point: ${project.break_event_point} months\n`;
      if (project.profit_margin)
        welcomeContent += `- Profit Margin: ${project.profit_margin}%\n`;
      welcomeContent += `\n`;
    }

    // Add assistance areas
    welcomeContent += `### How I Can Help\nI can assist with:\n\n`;
    welcomeContent += `- Business planning and strategy\n`;
    welcomeContent += `- Market analysis and competitor research\n`;
    welcomeContent += `- Financial projections and investment advice\n`;
    welcomeContent += `- Operational requirements and scaling strategies\n`;
    welcomeContent += `- Marketing and sales approaches\n\n`;

    // Add prompt for user to start the conversation
    welcomeContent += `What specific aspect of ${project.title} would you like to discuss today?`;

    return {
      role: "assistant",
      content: welcomeContent,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      metadata: {
        isWelcomeMessage: true,
      },
    };
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    };

    // Add a small delay to ensure DOM has updated
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [messages, isTyping]);
  const sendMessageToAPI = async (chatHistory: Message[]) => {
    try {
      // For Perplexity API, the first message after system should be from user
      // Reformat chat history to ensure correct order and filter out welcome message
      const formattedChatHistory = chatHistory
        .filter((msg) => !msg.metadata?.isWelcomeMessage) // Filter out welcome message
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chatHistory: formattedChatHistory,
          projectId: projectId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const statusCode = response.status;

        // Different error handling based on status code
        if (statusCode === 429) {
          throw new Error(
            "Rate limit exceeded. Please wait a moment before sending another message."
          );
        } else if (statusCode >= 500) {
          throw new Error(
            "Server error. Our AI service is temporarily unavailable. Please try again in a few minutes."
          );
        } else if (statusCode === 403 || statusCode === 401) {
          throw new Error(
            "Authentication error with AI service. Please contact support if this persists."
          );
        } else if (statusCode === 400) {
          throw new Error(
            "The message could not be processed. Please try rephrasing your question."
          );
        } else if (statusCode === 404) {
          throw new Error(
            "The AI service endpoint could not be found. Please contact support."
          );
        } else {
          throw new Error(
            errorData.error ?? "Failed to get response. Please try again."
          );
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error sending message to API:", error);

      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes("fetch")) {
        setError(
          "Network error. Please check your internet connection and try again."
        );
      } else if (error instanceof SyntaxError) {
        setError(
          "Received invalid data from the server. Please try again or contact support."
        );
      } else {
        setError(
          (error as Error).message ||
            "An unknown error occurred while processing your message."
        );
      }

      toast({
        title: "Error",
        description:
          (error as Error).message ||
          "Failed to get response from AI assistant. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };
  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || isTyping) return;
    setError(null);

    // Format current timestamp
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Add user message
    const userMessage: Message = {
      role: "user",
      content: newMessage,
      timestamp: timestamp,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setNewMessage("");

    // Start typing indicator with processing information
    setIsTyping(true);

    // Create a timer to update processing message
    const startTime = Date.now();
    const processingTimer = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      if (elapsedSeconds > 10) {
        clearInterval(processingTimer);
      }
    }, 1000);

    try {
      // Send message to API
      const currentMessages = [...messages, userMessage];
      const response = await sendMessageToAPI(currentMessages);

      // Clear the timer and stop typing indicator
      clearInterval(processingTimer);
      setIsTyping(false);

      if (response) {
        // Add AI response
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: "assistant",
            content: response.response,
            timestamp: response.timestamp,
            metadata: response.metadata,
          },
        ]);
      }
    } catch (error) {
      setIsTyping(false);
      setError(
        "An error occurred while sending your message. Please try again."
      );
      toast({
        title: "Error",
        description: "Failed to get a response from the AI assistant.",
        variant: "destructive",
      });
    }
  };
  return (
    <Card className="flex-1 flex flex-col">
      <CardHeader className="p-4">
        <CardTitle className="text-xl">GapMap AI Assistant</CardTitle>
        <CardDescription>
          Ask questions about your business opportunity
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="flex-1 p-0 flex flex-col">
        {isLoading ? (
          <div className="flex-1 p-4 space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                <div className="h-20 bg-muted rounded animate-pulse" />
                <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
              </div>
            </div>
            <div className="w-full h-px bg-border" />
            <div className="flex justify-end items-start space-x-3">
              <div className="space-y-2 flex-1 flex flex-col items-end">
                <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                <div className="h-10 w-3/4 bg-muted rounded animate-pulse" />
              </div>
              <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                <div className="h-16 bg-muted rounded animate-pulse" />
                <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
              </div>
            </div>
          </div>
        ) : (
          <ScrollArea
            className="flex-1 p-4 max-h-[50vh] overflow-y-auto"
            type="always"
            ref={scrollAreaRef}
          >
            <div
              className="space-y-4 min-h-full"
              style={{ paddingBottom: "20px" }}
            >
              {messages.map((message, index) => (
                <div
                  key={`message-${message.timestamp}-${index}`}
                  className={`flex ${
                    message.role === "assistant"
                      ? "justify-start"
                      : "justify-end"
                  }`}
                >
                  <div
                    className={`flex gap-3 max-w-[80%] ${
                      message.role === "assistant" ? "" : "flex-row-reverse"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <Avatar>
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                    )}
                    {message.role === "user" && (
                      <Avatar>
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <div
                        className={`rounded-lg p-4 ${
                          message.role === "assistant"
                            ? "bg-muted"
                            : "bg-primary text-primary-foreground"
                        }`}
                      >
                        <div className="prose dark:prose-invert prose-sm max-w-none prose-headings:mb-2 prose-headings:mt-2 prose-p:my-1 prose-li:my-0.5 prose-ul:my-1 prose-ol:my-1 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:text-xs prose-pre:p-2 prose-pre:rounded">
                          {message.role === "assistant" ? (
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          ) : (
                            message.content
                              .split("\n")
                              .map((line: string, i: number) => (
                                <div key={`msg-${index}-line-${i}`}>{line}</div>
                              ))
                          )}
                        </div>
                      </div>{" "}
                      <div
                        className={`text-xs text-muted-foreground mt-1 ${
                          message.role === "assistant"
                            ? "text-left"
                            : "text-right"
                        }`}
                      >
                        {message.timestamp}
                        {message.role === "assistant" &&
                          message.metadata?.model && (
                            <span className="ml-2 opacity-70">
                              • {message.metadata.model}
                            </span>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}{" "}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[80%]">
                    <Avatar>
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg p-4 bg-muted">
                      <div className="flex flex-col">
                        <div className="flex space-x-2 mb-1">
                          <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"></div>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Generating response...
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {error && (
                <div className="p-4 my-2 text-sm bg-red-50 dark:bg-red-950 rounded-md border border-red-200 dark:border-red-800">
                  <p className="text-red-500 dark:text-red-300 mb-2 font-medium">
                    Error
                  </p>
                  <p className="text-red-500 dark:text-red-300 mb-3">{error}</p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setError(null);
                        if (
                          messages.length > 0 &&
                          messages[messages.length - 1].role === "user"
                        ) {
                          handleSendMessage();
                        }
                      }}
                      className="text-xs"
                    >
                      Retry
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setError(null)}
                      className="text-xs"
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-1" />
            </div>
          </ScrollArea>
        )}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Textarea
              placeholder="Ask a question about your business opportunity..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="min-h-[60px]"
              disabled={isTyping || isLoading}
            />
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="shrink-0"
              disabled={isTyping || isLoading || newMessage.trim() === ""}
            >
              <RiSendPlaneLine className="h-4 w-4" />
            </Button>
          </div>

          {/* Admin Controls */}
          <div className="mt-4 text-xs text-muted-foreground flex justify-between items-center">
            {" "}
            <div>
              {messages.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (
                      confirm(
                        "Are you sure you want to clear this conversation?"
                      )
                    ) {
                      // Use project-specific welcome message if project exists, or default if not
                      if (project) {
                        setMessages([
                          createProjectSpecificWelcomeMessage(project),
                        ]);
                      } else {
                        setMessages([createDefaultWelcomeMessage()]);
                      }
                    }
                  }}
                  className="text-xs"
                >
                  Clear Conversation
                </Button>
              )}
            </div>
            <div className="flex space-x-3">
              {/* Display token usage if available from the last assistant message */}
              {messages.length > 0 &&
                messages.filter(
                  (m) => m.role === "assistant" && m.metadata?.tokens
                ).length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {" "}
                    {messages
                      .filter(
                        (m) => m.role === "assistant" && m.metadata?.tokens
                      )
                      .reduce(
                        (total, m) => total + (m.metadata?.tokens ?? 0),
                        0
                      )}{" "}
                    tokens used
                  </span>
                )}
              <span className="mr-2">{messages.length} messages</span>
              <span>
                {messages.filter((m) => m.role === "user").length} questions
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
