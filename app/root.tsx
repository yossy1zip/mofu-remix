import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import NotFound from "~/components/NotFound";
import styles from "~/styles/global.css?url";

export const links = () => [
  { rel: "stylesheet", href: styles },
  { 
    rel: "stylesheet", 
    href: "https://fonts.googleapis.com/css2?family=Raleway:wght@400;600&family=Noto+Sans+JP:wght@400;600&display=swap" 
  },
];

export default function App() {
  return (
    <html lang="ja" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full font-sans">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  return (
    <html>
      <head>
        <title>404 - Not Found</title>
        <meta charSet="utf-8" />
        <Meta />
        <Links />
      </head>
      <body>
        <NotFound />
        <Scripts />
      </body>
    </html>
  );
}