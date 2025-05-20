import React from "react";
import { RadialBarChart } from "recharts/types/chart/RadialBarChart";
import { ResponsiveContainer } from "recharts/types/component/ResponsiveContainer";


interface CompletionChartProps {
  completion: number;
}

const CompletionChart: React.FC<CompletionChartProps> = ({ completion }) => {
  const data = [
    {
      name: "Completion",
      value: completion,
      fill: "#82ca9d",
    },
  ];

  return (
    <div style={{ width: 80, height: 80 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="60%"
          outerRadius="80%"
          data={data}
          startAngle={90}
          endAngle={-270}
        >
        
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CompletionChart;
