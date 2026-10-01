import { useCallback, useContext, useEffect } from "react";
import { ConnectorContext } from "./connectorContextObject";

export const useConnectorContext = () => {
  const ctx = useContext(ConnectorContext);
  if (!ctx) throw new Error("Connector components must be used inside a ConnectorProvider");
  return ctx;
};

// Ref callback for any card that participates in a connector. Attach to the
// card's root DOM node: connectorRef("layer-abc") -> (el) => void
export const useConnectorNode = (id) => {
  const { registerNode } = useConnectorContext();
  return useCallback((el) => registerNode(id, el), [registerNode, id]);
};

// Declares one edge between two registered node ids. Re-registers whenever
// the connection's shape changes (e.g. isDone flips its color/dash style).
export const useConnection = (id, conn) => {
  const { registerConnection } = useConnectorContext();
  const key = JSON.stringify(conn);
  useEffect(() => {
    if (!conn.fromId || !conn.toId) return undefined;
    return registerConnection(id, conn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, key, registerConnection]);
};
