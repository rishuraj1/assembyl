"use server";

import { EXAMPLE_PROMPTS } from "@/lib/prompt";

export const getRandomSamplePrompts = async () => {
  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
        method: "POST",
        body: JSON.stringify({
          model: process.env.LLM_MODEL,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: EXAMPLE_PROMPTS,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching prompts: ${response.statusText}`);
    }
    const data = await response.json();
    return data.choices[0].message.content || [];
  } catch (error) {
    console.error("Error fetching random sample prompts:", error);
    throw new Error("Failed to fetch random sample prompts");
  }
};
