"use client";
import { Box, Stack, TextField, Button } from "@mui/material";
import { useState } from "react";
import Image from "next/image";
import "boxicons"; 
import walle from "../public/walle.jpg";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! How can I help you today?",
    },
  ]);

  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    setMessages((messages) => [
      ...messages,
      {
        role: "user",
        content: message,
      },
      { role: "assistant", content: "" },
    ]);

    setMessage(""); 

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([...messages, { role: "user", content: message }]),
    });

    if (!response.ok) {
      console.error("Failed to fetch the chat response");
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let result = "";
    return reader.read().then(function processText({ done, value }) {
      if (done) {
        return result;
      }
      const text = decoder.decode(value || new Int8Array(), { stream: true });
      setMessages((messages) => {
        let lastMessage = messages[messages.length - 1];
        let otherMessages = messages.slice(0, messages.length - 1);
        return [
          ...otherMessages,
          {
            ...lastMessage,
            content: lastMessage.content + text,
          },
        ];
      });
      return reader.read().then(processText);
    });
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="#f0f0f0" 
    >
      <Box
        width="40vw"
        height="70vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        border="1px solid #ccc" 
        borderRadius={12} 
        boxShadow="0px 4px 15px rgba(0, 0, 0, 0.1)" // Soft shadow to give a paper-like feel
        bgcolor="white" 
      >
        <Stack
          direction="column"
          width="100%" 
          height="100%" 
          p={3}
          spacing={3}
        >
          <Stack
            direction="column"
            spacing={2}
            flexGrow={1}
            overflow="auto"
            maxHeight="100%"
          >
            {messages.map((msg, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={
                  msg.role === "assistant" ? "flex-start" : "flex-end"
                }
                alignItems="center" 
              >
                {msg.role === "assistant" && (
                  <Box
                    width={50} 
                    height={50} 
                    borderRadius="50%"
                    overflow="hidden"
                    mr={2} 
                  >
                    <Image
                      src={walle}
                      alt="WALL-E"
                      width={50}
                      height={50}
                      objectFit="cover"
                    />
                  </Box>
                )}
                {msg.role === "user" && (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    width={50} 
                    height={50} 
                    borderRadius="50%"
                    bgcolor="grey"
                    color="white"
                    mr={2} 
                  >
                    <box-icon name="user" type="solid"></box-icon>
                  </Box>
                )}
                <Box
                  bgcolor={msg.role === "assistant" ? "primary.main" : "grey"}
                  color="white"
                  p={3} 
                  borderRadius={16}
                  maxWidth="75%"
                >
                  {msg.content}
                </Box>
              </Box>
            ))}
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Message"
              value={message}
              fullWidth
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                },
              }}
            />
            <Button
              variant="contained"
              sx={{ backgroundColor: "#adcae6", borderRadius: "10px" }} 
              onClick={sendMessage}
            >
              <box-icon name="send" color="white"></box-icon>
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
