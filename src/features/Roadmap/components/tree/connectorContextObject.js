import { createContext } from "react";

// Split into its own file (not exported alongside components) purely so
// react-refresh/only-export-components doesn't disable Fast Refresh for
// ConnectorContext.jsx and connectorHooks.js.
export const ConnectorContext = createContext(null);
