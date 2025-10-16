import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import Layout from "@/components/Layout/Layout";

export async function render(url: string) {
  // For SSR, we'll render a simple layout without the complex routing
  // The actual routing will be handled by the client-side router
  const layout = (
    <StaticRouter location={url}>
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      </Layout>
    </StaticRouter>
  );

  return renderToString(layout);
}
