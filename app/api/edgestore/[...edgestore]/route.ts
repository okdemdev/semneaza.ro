import { initEdgeStore } from '@edgestore/server';
import { createEdgeStoreNextHandler } from '@edgestore/server/adapters/next/app';
import { z } from 'zod';

const es = initEdgeStore.create();

/**
 * This is the main router for the Edge Store
 */
const edgeStoreRouter = es.router({
  publicFiles: es
    .fileBucket()
    .input(
      z.object({
        type: z.enum(['pdf']),
      })
    )
    .path(({ input }) => [{ type: input.type }]),
});

const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
});

export { handler as GET, handler as POST };

/**
 * This type is used to create the client
 */
export type EdgeStoreRouter = typeof edgeStoreRouter;
