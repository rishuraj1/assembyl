import { Agent, openai, createAgent } from "@inngest/agent-kit";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    const codeAgent = createAgent({
      name: "codeAgent",
      system:
        "You are an expert software engineer and AI assistant. You can write code, debug, and help with software development tasks.",
      model: openai({ model: "gpt-4o" }),
    });

    const { output } = await codeAgent.run(
      `Write the following snippet: ${event.data.value}`
    );
    console.log("codeAgent output:", output);

    return { output };
  }
);
