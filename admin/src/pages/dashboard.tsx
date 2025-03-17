import { useEffect, useState } from "react";
import {
  ShoppingBag,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { OrderService } from "@/services/order-service";
import CustomTooltip from "@/components/ui/custom-tooltip";
import { ChartsResponse, TopProductsResponse } from "@/types/api";
import { ProductService } from "@/services/product-service";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    trends: {
      totalRevenue: { trend: "up", trendValue: 0 },
      totalOrders: { trend: "up", trendValue: 0 },
      totalProducts: { trend: "up", trendValue: 0 },
      totalCustomers: { trend: "up", trendValue: 0 },
    },
  });

  const [charts, setCharts] = useState<ChartsResponse>({
    revenueData: [],
    ordersData: [],
  });

  const [topProducts, setTopProducts] = useState<TopProductsResponse[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await OrderService.getStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
      setIsLoading(false);
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        const data = await OrderService.getCharts();
        setCharts(data);
      } catch (error) {
        console.error("Error fetching dashboard charts:", error);
      }
      setIsLoading(false);
    };

    fetchCharts();
  }, []);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const data = await ProductService.getTopProducts();
        setTopProducts(data);
      } catch (error) {
        console.error("Error fetching dashboard charts:", error);
      }
      setIsLoading(false);
    };

    fetchTopProducts();
  }, []);

  const StatCard = ({ title, value, icon: Icon, trend, trendValue }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {title === "Total Revenue"
            ? `$${value.toLocaleString()}`
            : value.toLocaleString()}
        </div>
        <p className="flex items-center text-xs text-muted-foreground mt-1">
          {trend === "up" ? (
            <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
          ) : (
            <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
          )}
          <span className={trend === "up" ? "text-green-500" : "text-red-500"}>
            {trendValue}%
          </span>
          <span className="ml-1">from last month</span>
        </p>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={stats.totalRevenue}
          icon={DollarSign}
          trend={stats.trends.totalRevenue.trend}
          trendValue={stats.trends.totalRevenue.trendValue.toFixed(2)}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          trend={stats.trends.totalOrders.trend}
          trendValue={stats.trends.totalOrders.trendValue.toFixed(2)}
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={ShoppingBag}
          trend={stats.trends.totalProducts.trend}
          trendValue={stats.trends.totalProducts.trendValue.toFixed(2)}
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers}
          icon={Users}
          trend={stats.trends.totalCustomers.trend}
          trendValue={stats.trends.totalCustomers.trendValue.toFixed(2)}
        />
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="revenue" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>
                Monthly revenue for the current year
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={charts.revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="orders" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Orders Overview</CardTitle>
              <CardDescription>
                Monthly orders for the current year
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts.ordersData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="value"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Top Products */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
          <CardDescription>
            Products with the highest sales this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Product</th>
                  <th className="text-right py-3 px-4 font-medium">Sales</th>
                  <th className="text-right py-3 px-4 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="py-3 px-4">{product.name}</td>
                    <td className="text-right py-3 px-4">{product.sales}</td>
                    <td className="text-right py-3 px-4">${product.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
