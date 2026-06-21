import { Download } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { OrderStatusSelect } from "@/app/_components/admin/order-status-selecter";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/trpc/server";

interface OrderDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: OrderDetailPageProps) {
    const { id } = await params;
    const order = await api.order.getById({ id }).catch(() => null);
    if (!order) notFound();

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <Link className="text-[#14163A]/55 text-sm hover:underline" href="/admin/orders">
                        ← Back to orders
                    </Link>
                    <h1 className="mt-1 font-display font-extrabold text-2xl text-[#14163A]">{order.billNumber}</h1>
                    <p className="text-[#14163A]/55 text-sm">
                        Placed on {new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <OrderStatusSelect orderId={order.id} status={order.status} />
                    <Button asChild className="gap-2" variant="outline">
                        <a href={`/api/orders/${order.id}/pdf`} rel="noopener noreferrer" target="_blank">
                            <Download className="h-4 w-4" />
                            Download bill
                        </a>
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-lg border border-[#14163A]/10 bg-white p-5 lg:col-span-1">
                    <h2 className="font-bold text-[#14163A]/50 text-sm uppercase tracking-wide">Customer</h2>
                    <dl className="mt-3 space-y-2.5 text-sm">
                        <Row label="Name" value={order.customerName} />
                        <Row
                            label="WhatsApp"
                            value={
                                <a
                                    className="text-emerald-600 hover:underline"
                                    href={`https://wa.me/91${order.customerWhatsapp.replace(/\D/g, "")}`}
                                    rel="noopener noreferrer"
                                    target="_blank"
                                >
                                    {order.customerWhatsapp}
                                </a>
                            }
                        />
                        <Row label="Address" value={order.customerAddress} />
                        <Row label="State" value={order.customerState} />
                    </dl>
                </div>

                <div className="rounded-lg border border-[#14163A]/10 bg-white p-5 lg:col-span-2">
                    <h2 className="font-bold text-[#14163A]/50 text-sm uppercase tracking-wide">Items</h2>
                    <div className="mt-3 overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-16">Code</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead className="text-right">Price</TableHead>
                                    <TableHead className="text-right">Qty</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="text-[#14163A]/60">{item.productCode}</TableCell>
                                        <TableCell>
                                            <p className="font-semibold text-[#14163A]">{item.productName}</p>
                                            <p className="text-[#14163A]/55 text-xs">{item.unit}</p>
                                        </TableCell>
                                        <TableCell className="text-right">₹{item.discountPrice}</TableCell>
                                        <TableCell className="text-right">{item.quantity}</TableCell>
                                        <TableCell className="text-right font-semibold">₹{item.lineTotal}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="mt-4 ml-auto w-full max-w-xs space-y-1.5 text-sm">
                        <div className="flex justify-between text-[#14163A]/65">
                            <span>Net total</span>
                            <span>₹{order.netTotal}</span>
                        </div>
                        <div className="flex justify-between text-emerald-600">
                            <span>You save</span>
                            <span>-₹{order.youSave}</span>
                        </div>
                        <div className="flex justify-between border-[#14163A]/10 border-t pt-1.5 font-extrabold text-[#14163A] text-base">
                            <span>Grand total</span>
                            <span>₹{order.grandTotal}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div>
            <dt className="text-[#14163A]/40 text-xs uppercase tracking-wide">{label}</dt>
            <dd className="font-medium text-[#14163A]">{value}</dd>
        </div>
    );
}