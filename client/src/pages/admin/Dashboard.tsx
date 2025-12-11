import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Wallet, Ticket, Clapperboard } from "lucide-react";
import { Card, CardContent } from "@/components";

type Transaction = {
  id: string;
  movie: string;
  user: string;
  date: string;
  status: "Paid" | "Pending" | "Cancelled";
};

const stats = [
  {
    label: "Total Revenue",
    value: "Rp12.540.000",
    icon: Wallet,
    color: "text-primary",
    bgColor: "bg-primary/20",
  },
  {
    label: "Tickets Sold",
    value: "100",
    icon: Ticket,
    color: "text-violet-500",
    bgColor: "bg-violet-500/20",
  },
  {
    label: "Movies Showing",
    value: "50",
    icon: Clapperboard,
    color: "text-amber-400",
    bgColor: "bg-amber-400/20",
  },
];

const transactions: Transaction[] = [
  {
    id: "#T-8821",
    movie: "Zootopia 2",
    user: "Derry Riccardo",
    date: "5 December 2025",
    status: "Paid",
  },
  {
    id: "#T-8821",
    movie: "Zootopia 2",
    user: "Derry Riccardo",
    date: "5 December 2025",
    status: "Paid",
  },
  {
    id: "#T-8821",
    movie: "Zootopia 2",
    user: "Derry Riccardo",
    date: "5 December 2025",
    status: "Paid",
  },
  {
    id: "#T-8821",
    movie: "Zootopia 2",
    user: "Derry Riccardo",
    date: "5 December 2025",
    status: "Paid",
  },
  {
    id: "#T-8821",
    movie: "Zootopia 2",
    user: "Derry Riccardo",
    date: "5 December 2025",
    status: "Paid",
  },
  {
    id: "#T-8821",
    movie: "Zootopia 2",
    user: "Derry Riccardo",
    date: "5 December 2025",
    status: "Paid",
  },
];

const columnHelper = createColumnHelper<Transaction>();

const columns = [
  columnHelper.accessor("id", {
    header: "ID",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("movie", {
    header: "Movie",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("user", {
    header: "User",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("date", {
    header: "Date",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => {
      const status = info.getValue();
      const statusStyles: Record<string, string> = {
        Paid: "bg-green-600 text-white",
        Pending: "bg-amber-500 text-white",
        Cancelled: "bg-red-600 text-white",
      };
      return (
        <span
          className={`rounded-md px-3 py-1 text-xs font-medium ${statusStyles[status]}`}
        >
          {status}
        </span>
      );
    },
  }),
];

const AdminDashboard = () => {
  const data = useMemo(() => transactions, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome back, Admin. Here's what's happening today
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="rounded-md border border-border py-0"
          >
            <CardContent className="flex items-center justify-between p-10 py-6">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">
                  {stat.label}
                </span>
                <span className="text-2xl font-bold">{stat.value}</span>
              </div>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-md ${stat.bgColor}`}
              >
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">Recent Transactions</h2>

        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-left font-medium text-muted-foreground"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border last:border-0"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
