// Server entry used only at build time (see scripts/seoPostBuild.js).
// Renders a public route to HTML so crawlers get real content without JS.
// Effects never run here, so data fetched in useEffect shows its initial state.
import { prerenderToNodeStream } from "react-dom/static";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from "react-router-dom";
import { routes } from "./router";

const handler = createStaticHandler(routes);

export async function render(pathname) {
  const request = new Request(`https://vahoha.com${pathname}`);
  const context = await handler.query(request);
  if (context instanceof Response) return { redirect: true, html: "" };

  const router = createStaticRouter(handler.dataRoutes, context);
  // prerenderToNodeStream waits for every lazy() page and Suspense boundary.
  const { prelude } = await prerenderToNodeStream(
    <StaticRouterProvider router={router} context={context} hydrate={false} />,
  );
  let html = "";
  for await (const chunk of prelude) html += chunk;
  return { status: context.statusCode, html };
}
