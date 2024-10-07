"use-client";

"use client";

import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const chartData = [
  { day: "M", revenue: 300 },
  { day: "T", revenue: 450 },
  { day: "W", revenue: 200 },
  { day: "T", revenue: 400 },
  { day: "F", revenue: 300 },
  { day: "S", revenue: 200 },
  { day: "S", revenue: 100 },
];

const Analytics = () => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-medium">Revenue</CardTitle>
          <p className="text-xs text-gray-500">15 April - 21 April</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">$16,900</p>
          <p className="text-sm text-gray-500">
            User
            <br />
            40
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF9999" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#FF9999" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis hide={true} domain={[0, 500]} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#FF6666"
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default Analytics;
