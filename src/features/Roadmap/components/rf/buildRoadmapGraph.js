// Converts the roadmap JSON layer array into ReactFlow nodes + edges

const LAYER_X = 0;
const LAYER_W = 260;
const LAYER_H = 110;
const LAYER_GAP = 60;       // vertical gap between layers

const SUB_X_OFFSET = 320;   // distance from center to sub column
const SUB_H = 82;
const SUB_GAP = 12;         // vertical gap between subs on same side

const DETAIL_X_OFFSET = 260; // further from sub column
const DETAIL_H = 60;
const DETAIL_GAP = 8;

export function buildRoadmapGraph(layers, layerProgress) {
  const nodes = [];
  const edges = [];

  let spineY = 0;

  layers.forEach((layer, li) => {
    const resolvedStatus = layerProgress[layer.id] ?? layer.status ?? "locked";
    const isDone = resolvedStatus === "done";
    const isActive = resolvedStatus === "in-progress";
    const layerNodeId = `layer-${layer.id}`;
    const _layerCenterY = spineY + LAYER_H / 2;

    nodes.push({
      id: layerNodeId,
      type: "layerNode",
      position: { x: LAYER_X - LAYER_W / 2, y: spineY },
      data: { layer, resolvedStatus },
      draggable: false,
    });

    // vertical spine connector to next layer
    if (li < layers.length - 1) {
      edges.push({
        id: `spine-${li}`,
        source: layerNodeId,
        target: `layer-${layers[li + 1].id}`,
        type: "glowEdge",
        data: { active: isDone || isActive, variant: "bezier" },
      });
    }

    // ---- LEFT SUBS ----
    const leftNodes = layer.sideLeft ?? [];
    const totalLeftH = leftNodes.reduce((s, n) => s + SUB_H + (n.children?.length ?? 0) * (DETAIL_H + DETAIL_GAP) + SUB_GAP, 0) - SUB_GAP;
    let leftSubY = spineY + LAYER_H / 2 - totalLeftH / 2;

    leftNodes.forEach((sub, si) => {
      const subNodeId = `sub-left-${layer.id}-${si}`;
      const subCenterY = leftSubY + SUB_H / 2;

      nodes.push({
        id: subNodeId,
        type: "subNode",
        position: { x: LAYER_X - LAYER_W / 2 - SUB_X_OFFSET - 175, y: leftSubY },
        data: { title: sub.title, resources: sub.children?.[0]?.resources ?? [], isDone, side: "left", childCount: sub.children?.length ?? 0 },
        draggable: false,
      });

      edges.push({
        id: `edge-left-${layer.id}-${si}`,
        source: subNodeId,
        target: layerNodeId,
        sourceHandle: "detail-in",
        type: "glowEdge",
        data: { active: isDone, variant: "smoothstep" },
      });

      // detail chips
      const details = sub.children ?? [];
      const totalDetailH = details.length * (DETAIL_H + DETAIL_GAP) - DETAIL_GAP;
      let detailY = subCenterY - totalDetailH / 2;

      details.forEach((det, di) => {
        const detNodeId = `det-left-${layer.id}-${si}-${di}`;
        nodes.push({
          id: detNodeId,
          type: "detailNode",
          position: {
            x: LAYER_X - LAYER_W / 2 - SUB_X_OFFSET - 175 - DETAIL_X_OFFSET - 210,
            y: detailY,
          },
          data: { title: det.title, resources: det.resources ?? [], isDone, side: "left" },
          draggable: false,
        });

        edges.push({
          id: `edge-det-left-${layer.id}-${si}-${di}`,
          source: detNodeId,
          target: subNodeId,
          type: "glowEdge",
          data: { active: isDone, variant: "smoothstep" },
        });

        detailY += DETAIL_H + DETAIL_GAP;
      });

      leftSubY += SUB_H + SUB_GAP + (details.length > 0 ? details.length * (DETAIL_H + DETAIL_GAP) : 0);
    });

    // ---- RIGHT SUBS ----
    const rightNodes = layer.sideRight ?? [];
    const totalRightH = rightNodes.reduce((s, n) => s + SUB_H + (n.children?.length ?? 0) * (DETAIL_H + DETAIL_GAP) + SUB_GAP, 0) - SUB_GAP;
    let rightSubY = spineY + LAYER_H / 2 - totalRightH / 2;

    rightNodes.forEach((sub, si) => {
      const subNodeId = `sub-right-${layer.id}-${si}`;
      const subCenterY = rightSubY + SUB_H / 2;

      nodes.push({
        id: subNodeId,
        type: "subNode",
        position: { x: LAYER_X + LAYER_W / 2 + SUB_X_OFFSET, y: rightSubY },
        data: { title: sub.title, resources: sub.children?.[0]?.resources ?? [], isDone, side: "right", childCount: sub.children?.length ?? 0 },
        draggable: false,
      });

      edges.push({
        id: `edge-right-${layer.id}-${si}`,
        source: layerNodeId,
        target: subNodeId,
        sourceHandle: "right-out",
        type: "glowEdge",
        data: { active: isDone, variant: "smoothstep" },
      });

      const details = sub.children ?? [];
      const totalDetailH = details.length * (DETAIL_H + DETAIL_GAP) - DETAIL_GAP;
      let detailY = subCenterY - totalDetailH / 2;

      details.forEach((det, di) => {
        const detNodeId = `det-right-${layer.id}-${si}-${di}`;
        nodes.push({
          id: detNodeId,
          type: "detailNode",
          position: {
            x: LAYER_X + LAYER_W / 2 + SUB_X_OFFSET + 175 + DETAIL_X_OFFSET,
            y: detailY,
          },
          data: { title: det.title, resources: det.resources ?? [], isDone, side: "right" },
          draggable: false,
        });

        edges.push({
          id: `edge-det-right-${layer.id}-${si}-${di}`,
          source: subNodeId,
          target: detNodeId,
          sourceHandle: "detail-out",
          type: "glowEdge",
          data: { active: isDone, variant: "smoothstep" },
        });

        detailY += DETAIL_H + DETAIL_GAP;
      });

      rightSubY += SUB_H + SUB_GAP + (details.length > 0 ? details.length * (DETAIL_H + DETAIL_GAP) : 0);
    });

    // advance spine
    const leftSideH = leftNodes.reduce((s, n) => s + SUB_H + SUB_GAP + (n.children?.length ?? 0) * (DETAIL_H + DETAIL_GAP), 0);
    const rightSideH = rightNodes.reduce((s, n) => s + SUB_H + SUB_GAP + (n.children?.length ?? 0) * (DETAIL_H + DETAIL_GAP), 0);
    const layerBlock = Math.max(LAYER_H, leftSideH, rightSideH);
    spineY += layerBlock + LAYER_GAP;
  });

  return { nodes, edges };
}
