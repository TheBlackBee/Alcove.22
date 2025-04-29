import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useTranslation } from "react-i18next";
import { LanguageStat } from "@/types";

interface LanguageDistributionProps {
  data: LanguageStat[];
}

export default function LanguageDistribution({ data }: LanguageDistributionProps) {
  const { t } = useTranslation();
  
  // Sum up the total percentage to calculate actual percentages
  const total = data.reduce((acc, curr) => acc + curr.percentage, 0);
  
  return (
    <div className="w-full h-full">
      <div className="h-48 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={2}
              dataKey="percentage"
              nameKey="language"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${index + 1}))`} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`${(value / total * 100).toFixed(0)}%`, t("percentage")]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="w-full space-y-2">
        {data.map((item, index) => (
          <div key={item.language} className="flex items-center justify-between">
            <div className="flex items-center">
              <div 
                className="w-3 h-3 rounded-sm mr-2" 
                style={{ backgroundColor: `hsl(var(--chart-${index + 1}))` }}
              ></div>
              <span className="text-sm">{item.language}</span>
            </div>
            <span className="text-sm font-medium">{(item.percentage / total * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
