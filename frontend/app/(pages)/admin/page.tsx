'use client'

import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/admin-page/dashboard/overview"
import { RecentTransactions } from "@/components/admin-page/dashboard/recent-transactions"
import { LatestReviews } from "@/components/admin-page/dashboard/latest-reviews"
import { useState, useEffect } from "react"
import { fetchStatisticDashboard } from "@/lib/api/statisticDashboard"
import { toast } from "sonner"
import LoadingComponent from "@/components/loading"

export interface StatisticDashboardResponse {
  message: string;
  data: StatisticData;
}

export interface StatisticData {
  totalUser: number;
  totalNotifications: number;
  totalReview: number;
  totalTransaction: number;
  totalBook: number;
  recentReviews: Review[];
  averageReview: number;
}

export interface Review {
  id: string;
  bookTitle: string;
  authorName: string;
  date: string; // ISO 8601 format
  rating: number; // 0.0 - 5.0
  content: string;
}


export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<StatisticDashboardResponse>();

  useEffect(() => {
    const loadStatistic = async () => {
      try {
        setIsLoading(true);
        const data = await fetchStatisticDashboard(4);
        setData(data)
      } catch (error) {
        console.error("Error fetching data statistik:", error);
        toast.error("Gagal memuat data statistik");
      } finally {
        setIsLoading(false);
      }
    };

    loadStatistic();
    console.log(data)
  },[]);

  if (isLoading) {
    return <LoadingComponent/>;
  }

  return (
    <>
      <div className="flex-col md:flex">
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            {/* <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList> */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Books
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{data?.data.totalBook}</div>
                    <p className="text-xs text-muted-foreground">
                      Updated recently
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Users
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{data?.data.totalUser}</div>
                    <p className="text-xs text-muted-foreground">
                    Updated recently
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Transaction</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{data?.data.totalTransaction}</div>
                    <p className="text-xs text-muted-foreground">
                    Updated recently
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Average Rating
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{data?.data.averageReview}</div>
                    <p className="text-xs text-muted-foreground">
                      Total reviews: {data?.data.totalReview}
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid md:gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4">
                    <Overview data={data?.data}/>
                </div>
                <Card className="col-span-3 mt-5 md:mt-0">
                  <CardHeader>
                    <CardTitle>Latest Reviews</CardTitle>
                    <CardDescription>
                      Recent book reviews from users.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LatestReviews data={data?.data.recentReviews}/>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            {/* <TabsContent value="transactions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>
                    You made 265 transactions this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentTransactions />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Latest Reviews</CardTitle>
                  <CardDescription>
                    Recent book reviews from users.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LatestReviews />
                </CardContent>
              </Card>
            </TabsContent> */}
          </Tabs>
        </div>
      </div>
    </>
  )
}

