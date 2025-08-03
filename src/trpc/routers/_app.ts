import { messageRouter } from "@/modules/messages/server/procedures";
import { createTRPCRouter } from "../init";
import { projectsRouter } from "@/modules/projects/server/procedures";
import { usageRouter } from "@/modules/usage/server/procedures";
import { homeRouter } from "@/modules/home/server/procedure";
export const appRouter = createTRPCRouter({
  messages: messageRouter,
  projects: projectsRouter,
  usage: usageRouter,
  home: homeRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;
