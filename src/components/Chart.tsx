"use client";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Data = { name: string; total: number }[];

// Graphique en barres simple (Recharts)
// horizontal = barres couchées, pratique quand les noms sont longs
export default function Chart({ title, data, horizontal = false }: { title: string; data: Data; horizontal?: boolean }) {
  return (
    <div className="card">
      <h2 className="mb-2 font-semibold">{title}</h2>
      <ResponsiveContainer width="100%" height={250}>
        {horizontal ? (
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="name" width={150} fontSize={12} />
            <Tooltip />
            <Bar dataKey="total" fill="#0f766e" />
          </BarChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" fontSize={12} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="total" fill="#0f766e" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
