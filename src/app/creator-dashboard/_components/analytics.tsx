"use-client";

"use client";

import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const chartData = [
  { month: "Jan", revenue: 300 },
  { month: "Feb", revenue: 450 },
  { month: "Mar", revenue: 200 },
  { month: "Apr", revenue: 400 },
  { month: "May", revenue: 300 },
  { month: "Jun", revenue: 200 },
  { month: "July", revenue: 100 },
];

const Analytics = () => {
  return (
    <Card className="w-full">
      <CardHeader className="m-10 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-medium">Revenue</CardTitle>
          <p className="text-2xl font-bold">$16,900</p>
          <p className="text-sm text-muted-foreground">User : 40</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">15 April - 21 April</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex h-[300px] w-full items-center justify-center">
          <div className="h-full w-full px-8">
            <ResponsiveContainer width="100%" height={250} className="">
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
                  dataKey="month"
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Analytics;
