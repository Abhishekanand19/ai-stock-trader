import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { GoogleGenerativeAI } from "@google/generative-ai"; 
import dotenv from "dotenv";
import readline from "readline";

dotenv.config();

// 1. Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// 2. Define the System Instruction with the EXACT required structure
const systemInstruction = {
  role: "system",
  parts: [{ text: "You are a stock trading assistant. Use the tools provided to check prices, buy/sell stocks, and manage the user's portfolio. Always confirm order details clearly." }]
};

// 3. Create the model with the instruction linked
// 1. Update the model name to the 'Lite' version
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash-lite", 
  systemInstruction: systemInstruction 
});

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

async function main() {
  // Connect to your Stock MCP Server
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["tsx", "src/mcp-server/stock-server.ts"],
  });

  const mcpClient = new Client(
    { name: "stock-trader-client", version: "1.0.0" },
    { capabilities: {} }
  );

  await mcpClient.connect(transport);
  console.log("✅ Server Connected");

  // Fetch tools from server
  const { tools: mcpTools } = await mcpClient.listTools();
  const geminiTools = {
    function_declarations: mcpTools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      parameters: tool.inputSchema,
    })),
  };

  // Start chat session
  const chat = model.startChat({
    tools: [geminiTools] as any,
  });

  console.log("🤖 Gemini is ready. (Type 'exit' to quit)");

  const ask = () => {
    rl.question("You: ", async (input) => {
      if (input.toLowerCase() === "exit") process.exit(0);

      try {
        let result = await chat.sendMessage(input);
        
        // Loop to handle tool/function calls
        let callParts = result.response.candidates?.[0]?.content?.parts?.filter(p => p.functionCall);

        while (callParts && callParts.length > 0) {
          const toolResponses = [];

          for (const part of callParts) {
            const call = part.functionCall!;
            console.log(`⚙️ Executing: ${call.name}`);
            
            const toolResult = await mcpClient.callTool({
              name: call.name,
              arguments: call.args as any,
            });

            toolResponses.push({
              functionResponse: {
                name: call.name,
                response: toolResult,
              },
            });
          }

          // Feed tool data back into the chat
          const nextStep = await chat.sendMessage(toolResponses);
          callParts = nextStep.response.candidates?.[0]?.content?.parts?.filter(p => p.functionCall);
          result = nextStep;
        }

        console.log(`🤖 Gemini: ${result.response.text()}`);

      } catch (error: any) {
        console.error("❌ Error:", error.message);
      }
      ask();
    });
  };

  ask();
}

main().catch(console.error);