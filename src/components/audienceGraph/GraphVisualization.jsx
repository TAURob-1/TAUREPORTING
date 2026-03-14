import React, { useMemo } from 'react';
import { MECHANISMS, ATTRIBUTE_CLASSES } from '../../data/audienceGraph/scores.js';

/**
 * Simple network graph visualization using SVG (no Cytoscape dependency).
 * Shows: center audience node → attribute ring → mechanism ring with weighted edges.
 */
export default function GraphVisualization({ rows, ranked, selectedAttributes }) {
  const graph = useMemo(() => {
    if (!rows || rows.length === 0 || !ranked) return null;

    const cx = 250, cy = 250;
    const attrRadius = 100;
    const mechRadius = 200;
    const nodes = [];
    const edges = [];

    // Center node
    nodes.push({ id: 'audience', x: cx, y: cy, label: 'Audience', color: '#3b82f6', radius: 24 });

    // Attribute ring
    const attrCount = selectedAttributes.length;
    selectedAttributes.forEach(({ classKey, attrKey }, i) => {
      const cls = ATTRIBUTE_CLASSES[classKey];
      const attr = cls?.attributes[attrKey];
      if (!attr) return;
      const angle = (2 * Math.PI * i) / attrCount - Math.PI / 2;
      const x = cx + attrRadius * Math.cos(angle);
      const y = cy + attrRadius * Math.sin(angle);
      const id = `${classKey}.${attrKey}`;
      nodes.push({ id, x, y, label: attr.label, color: cls.color, radius: 14 });
      edges.push({ from: 'audience', to: id, width: 2, color: cls.color });
    });

    // Mechanism ring
    const mechCount = ranked.length;
    ranked.forEach((mech, i) => {
      const angle = (2 * Math.PI * i) / mechCount - Math.PI / 2;
      const x = cx + mechRadius * Math.cos(angle);
      const y = cy + mechRadius * Math.sin(angle);
      nodes.push({ id: mech.key, x, y, label: mech.short, color: mech.color, radius: 16 });

      // Edges from each attribute to mechanism weighted by W
      rows.forEach((row) => {
        const W = row.scores[mech.key]?.W || 0;
        if (W <= 0) return;
        const attrId = `${row.classKey}.${row.attrKey}`;
        const attrNode = nodes.find((n) => n.id === attrId);
        if (!attrNode) return;
        edges.push({
          from: attrId,
          to: mech.key,
          width: Math.max(0.5, W / 5),
          color: MECHANISMS[mech.key]?.color || '#999',
          opacity: Math.min(1, 0.2 + W / 25),
        });
      });
    });

    return { nodes, edges };
  }, [rows, ranked, selectedAttributes]);

  if (!graph) {
    return (
      <div className="text-center text-gray-400 dark:text-slate-500 py-8 text-sm">
        Select attributes to generate the network graph
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2">Network Graph</h3>
      <svg viewBox="0 0 500 500" className="w-full max-w-lg mx-auto" style={{ aspectRatio: '1/1' }}>
        {/* Edges */}
        {graph.edges.map((edge, i) => {
          const from = graph.nodes.find((n) => n.id === edge.from);
          const to = graph.nodes.find((n) => n.id === edge.to);
          if (!from || !to) return null;
          return (
            <line
              key={i}
              x1={from.x} y1={from.y} x2={to.x} y2={to.y}
              stroke={edge.color}
              strokeWidth={edge.width}
              strokeOpacity={edge.opacity || 0.4}
            />
          );
        })}
        {/* Nodes */}
        {graph.nodes.map((node) => (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r={node.radius} fill={node.color} opacity={0.9} />
            <text
              x={node.x} y={node.y + node.radius + 12}
              textAnchor="middle"
              className="text-[8px] fill-gray-600 dark:fill-slate-400"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
