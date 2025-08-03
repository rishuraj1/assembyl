import { getRandomSamplePrompts } from "@/actions/home.actions";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { RANDOM_PROMPT } from "@/types";

export const homeRouter = createTRPCRouter({
  getPrompts: baseProcedure.query(async ({ input, ctx }) => {
    const prompts = await getRandomSamplePrompts();
    // console.log("Fetched Prompts:", prompts);
    const result: RANDOM_PROMPT[] = JSON.parse(prompts);
    console.log("Parsed Prompts:", result);
    return result;
  }),
});
