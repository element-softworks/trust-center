import { Metadata } from "next";
import { redirect } from "next/navigation";
import { listRequests } from "@/lib/request-store";
import { getStoredTrustConfig } from "@/lib/trust-config-store";
import { getAdminSession } from "@/lib/require-admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BuilderPanel } from "@/components/trust/builder-panel";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin area | EzTrust",
  description: "Review requests and edit the trust center.",
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "short",
  timeStyle: "short",
});

type Props = {
  searchParams?: {
    tab?: string;
  };
};

export default async function AdminPage({ searchParams }: Props) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/login");
  }

  const requests = await listRequests();
  const storedConfig = await getStoredTrustConfig();
  const activeTab = searchParams?.tab === "builder" ? "builder" : "requests";

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 lg:px-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-widest text-slate-500">
              Restricted area
            </p>
            <h1 className="text-2xl font-semibold">Trust center console</h1>
            <p className="text-sm text-slate-600">
              Review document requests and keep the trust center updated.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">
                {session.user?.name ?? "Authenticated user"}
              </p>
              <p className="text-xs text-slate-500">
                {session.user?.email ?? "no email"}
              </p>
            </div>
            <SignOutButton />
          </div>
        </div>

        <Tabs defaultValue={activeTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="builder">YAML editor</TabsTrigger>
          </TabsList>
          <TabsContent value="requests" className="space-y-6">
            <Card className="border border-slate-200 bg-white shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base font-semibold">
                  {requests.length} {requests.length === 1 ? "request" : "requests"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {requests.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No requests yet. Share the trust center to collect document asks.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Document</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead>Received</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {requests.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell className="font-medium">
                              {request.document}
                            </TableCell>
                            <TableCell>{request.email}</TableCell>
                            <TableCell>{request.company}</TableCell>
                            <TableCell className="max-w-sm text-pretty text-slate-600">
                              {request.message ?? "—"}
                            </TableCell>
                            <TableCell>
                              {dateFormatter.format(new Date(request.createdAt))}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={cn(
                                  "border-none px-3 py-1 text-xs font-semibold",
                                  request.status === "pending"
                                    ? "bg-amber-400 text-slate-900"
                                    : "bg-emerald-400 text-slate-900"
                                )}
                              >
                                {request.status === "pending"
                                  ? "Pending"
                                  : "Responded"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="builder">
            <BuilderPanel
              initialYaml={storedConfig.yaml}
              initialUpdatedAt={storedConfig.updatedAt}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
