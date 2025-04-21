import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getTransactionStats,
  getUserStats,
  // transactionHistory,
  type TransactionStats,
  type UserStats,
  // type TransactionHistory,
} from "@/utils/stats";
import { 
  getTotalSystemBalance,
  //  getTotalUserBalance 
  } from "@/utils/balance";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  Users,
  DollarSign,
  AlertCircle,
  Loader,
} from "lucide-react";

const AdminDashboard = () => {
  const [transactionStats, setTransactionStats] =
    useState<TransactionStats | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loadingUserStats, setLoadingUserStats] = useState(true)
  const [loadingTxStats, setLoadingTxStats] = useState(true)
  const [loadingSysBalance, setLoadingSysBalance] = useState(true)
  
  // const [errorUserStats, setErrorUserStats] = useState(true)
  // const [transactions, setTransactions] = useState<TransactionHistory | null>(
  //   null
  // );
  const [systemBalance, setSystemBalance] = useState<number>(0);
  // const [userBalance, setUserBalance] = useState<number>(0);
  // const [loading, setLoading] = useState(true);

  useEffect(()=> {
    const fetchDashboardData = async () => {
      try {
        setLoadingTxStats(true);
        const uStats = await getUserStats()
        setUserStats(uStats);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoadingTxStats(false);
      }
    };

    fetchDashboardData();
  },[])

  useEffect(()=> {
    const fetchDashboardData = async () => {
      try {
        setLoadingUserStats(true);
        const txStats = await getTransactionStats()
        setTransactionStats(txStats)

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoadingUserStats(false);
      }
    };

    fetchDashboardData();
  },[])

  useEffect(()=> {
    const fetchDashboardData = async () => {
      try {
        setLoadingSysBalance(true);
        const sysBalance = await getTotalSystemBalance()
        setSystemBalance(sysBalance)

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoadingSysBalance(false);
      }
    };

    fetchDashboardData();
  },[])
/*
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [
          // txStats, 
          // uStats, 
          // txHistory, 
          sysBalance, 
          // uBalance
        ] =
          await Promise.all([
            // getTransactionStats(),
            // getUserStats(),
            // transactionHistory(),
            getTotalSystemBalance(),
            // getTotalUserBalance(),
          ]);

        // setTransactionStats(txStats);
        // setUserStats(uStats);
        // setTransactions(txHistory);
        setSystemBalance(sysBalance);
        // setUserBalance(uBalance);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
*/
  // For user verification pie chart
  const userVerificationData = userStats
    ? [
        { name: "KYC Verified", value: userStats.kycVerified },
        {
          name: "Not KYC Verified",
          value: userStats.totalUsers - userStats.kycVerified,
        },
        { name: "2FA Enabled", value: userStats.twoFactorEnabled },
        { name: "Email Verified", value: userStats.emailVerified },
      ]
    : [];

  // Colors for pie chart - works well in both light and dark modes
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#6366f1"];

  // Format date for transactions
  // const formatDate = (dateString: string | number | Date) => {
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString();
  // };
/*
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-lg text-gray-800 dark:text-gray-200">
          <Loader className="animate-spin" size={50} />
        </div>
      </div>
    );
  }
*/
  return (
    <div className="p-6 bg-gray-50 dark:bg-background min-h-screen text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6 dark:text-white">
        Admin Dashboard
      </h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="dark:bg-sidebar dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Users
                </p>
                <h3 className="text-2xl font-bold dark:text-white">
                  {loadingUserStats? <Loader className="animate-spin"/> : userStats?.totalUsers || 0}
                </h3>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-sidebar dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  System Balance
                </p>
               {loadingSysBalance ? <Loader className="animate-spin"/> :  <h3 className="text-2xl font-bold dark:text-white">
                  ${systemBalance.toFixed(2)}
                </h3>}
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-sidebar dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Deposits
                </p>
                <h3 className="text-2xl font-bold dark:text-white">
                  {loadingTxStats ? <Loader className="animate-spin"/> : transactionStats?.deposits.total || 0}
                </h3>
                <p className="text-sm text-green-600 dark:text-green-400 flex items-center mt-1">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  {loadingTxStats ? <Loader className="animate-spin"/> : transactionStats?.deposits.pending || 0} pending
                </p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                <ArrowUpRight className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-sidebar dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Withdrawals
                </p>
                <h3 className="text-2xl font-bold dark:text-white">
                  {loadingTxStats ? <Loader className="animate-spin"/> : transactionStats?.withdrawals.total || 0}
                </h3>
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center mt-1">
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                  {loadingTxStats ? <Loader className="animate-spin"/> : transactionStats?.withdrawals.pending || 0} pending
                </p>
              </div>
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
                <ArrowDownRight className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Transaction Amounts */}
        <Card className="lg:col-span-2 dark:bg-sidebar dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">
              Transaction Amounts by Currency
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              Approved deposits and withdrawals
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingTxStats ? <Loader className="animate-spin"/> : <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  ...(transactionStats?.deposits.approvedAmounts || []).map(
                    (item) => ({
                      name: item.currency,
                      Deposits: item.totalAmount,
                      Withdrawals: 0,
                    })
                  ),
                  ...(transactionStats?.withdrawals.approvedAmounts || []).map(
                    (item) => ({
                      name: item.currency,
                      Deposits: 0,
                      Withdrawals: item.totalAmount,
                    })
                  ),
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(17, 24, 39, 0.8)",
                    borderColor: "#4b5563",
                    color: "#f9fafb",
                  }}
                />
                <Bar dataKey="Deposits" fill="#10b981" />
                <Bar dataKey="Withdrawals" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>}
          </CardContent>
        </Card>

        {/* User Verification Stats */}
        <Card className="dark:bg-sidebar dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">
              User Verification Status
            </CardTitle>
            <CardDescription className="dark:text-gray-400">
              KYC and security stats
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userVerificationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {userVerificationData.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(17, 24, 39, 0.8)",
                    borderColor: "#4b5563",
                    color: "#f9fafb",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different data views */}
      {/* <Tabs defaultValue="transactions" className="mb-6">
        <TabsList className="mb-4 bg-gray-200 dark:bg-gray-700">
          <TabsTrigger
            value="transactions"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
          >
            Recent Transactions
          </TabsTrigger>
          <TabsTrigger
            value="users"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
          >
            User Distribution
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card className="dark:bg-sidebar dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">
                Recent Transactions
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Showing the latest {transactions?.transactions.length || 0}{" "}
                transactions out of {transactions?.total || 0}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-200 dark:border-gray-700">
                      <TableHead className="dark:text-gray-300">ID</TableHead>
                      <TableHead className="dark:text-gray-300">User</TableHead>
                      <TableHead className="dark:text-gray-300">Type</TableHead>
                      <TableHead className="dark:text-gray-300">
                        Amount
                      </TableHead>
                      <TableHead className="dark:text-gray-300">
                        Currency
                      </TableHead>
                      <TableHead className="dark:text-gray-300">
                        Status
                      </TableHead>
                      <TableHead className="dark:text-gray-300">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions?.transactions.map((tx) => (
                      <TableRow
                        key={tx.id}
                        className="border-b border-gray-200 dark:border-gray-700"
                      >
                        <TableCell className="font-medium dark:text-gray-300">
                          {tx.id.substring(0, 8)}...
                        </TableCell>
                        <TableCell className="dark:text-gray-300">
                          {tx.user.name}
                        </TableCell>
                        <TableCell
                          className={
                            tx.type === "DEPOSIT"
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }
                        >
                          {tx.type}
                        </TableCell>
                        <TableCell className="dark:text-gray-300">
                          {tx.amount}
                        </TableCell>
                        <TableCell className="dark:text-gray-300">
                          {tx.currency}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              tx.status === "APPROVED"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : tx.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {tx.status}
                          </span>
                        </TableCell>
                        <TableCell className="dark:text-gray-300">
                          {formatDate(tx.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="dark:bg-sidebar dark:border-gray-700">
            <CardHeader>
              <CardTitle className="dark:text-white">
                User Distribution by Country
              </CardTitle>
              <CardDescription className="dark:text-gray-400">
                Total users: {userStats?.totalUsers || 0}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={userStats?.byCountry || []}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9ca3af" />
                  <YAxis
                    dataKey="country"
                    type="category"
                    width={100}
                    stroke="#9ca3af"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(17, 24, 39, 0.8)",
                      borderColor: "#4b5563",
                      color: "#f9fafb",
                    }}
                  />
                  <Bar dataKey="count" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs> */}

      {/* Pending Actions Card */}
      <Card className="mb-6 dark:bg-sidebar dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center dark:text-white">
            <AlertCircle className="h-5 w-5 mr-2 text-yellow-500" />
            Pending Actions Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-900">
              <div className="font-medium dark:text-yellow-100">
                Pending Deposits
              </div>
              <div className="text-2xl font-bold dark:text-white">
                {loadingTxStats ? <Loader className="animate-spin"/> : transactionStats?.deposits.pending || 0}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Require approval
              </div>
            </div>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-900">
              <div className="font-medium dark:text-yellow-100">
                Pending Withdrawals
              </div>
              <div className="text-2xl font-bold dark:text-white">
                {loadingTxStats ? <Loader className="animate-spin"/> : transactionStats?.withdrawals.pending || 0}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Require approval
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System vs User Balance */}
      {/* <Card className="dark:bg-sidebar dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Balance Overview</CardTitle>
          <CardDescription className="dark:text-gray-400">
            System and user balances comparison
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                System Balance
              </div>
              <div className="text-3xl font-bold dark:text-white">
                ${systemBalance.toFixed(2)}
              </div>
              <div className="mt-4 bg-gray-200 dark:bg-gray-700 h-3 rounded-full">
                <div
                  className="bg-blue-600 h-3 rounded-full"
                  style={{
                    width: `${(systemBalance / (systemBalance + userBalance)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                User Balance
              </div>
              <div className="text-3xl font-bold dark:text-white">
                ${userBalance.toFixed(2)}
              </div>
              <div className="mt-4 bg-gray-200 dark:bg-gray-700 h-3 rounded-full">
                <div
                  className="bg-green-600 h-3 rounded-full"
                  style={{
                    width: `${(userBalance / (systemBalance + userBalance)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default AdminDashboard;
