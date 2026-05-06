import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Order from "@/app/models/Order";
import Product from "@/app/models/Product";
import Category from "@/app/models/Category";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import User from "@/app/models/User";

export async function GET(req: NextRequest) {
  const { user } = await getServerSession(authOptions);
  if (!user || !["Owner", "Manager"].includes(user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  await connectDB();

  const today = new Date();
  const last7Days = new Date(today);
  last7Days.setDate(today.getDate() - 7);
  const last30Days = new Date(today);
  last30Days.setDate(today.getDate() - 30);

  const [totalSales, weeklySales, monthlyRevenue, pendingOrders, completedOrders, lowStock, bestSellers, recentOrders] = await Promise.all([
    // Total sales revenue
    Order.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]).exec(),

    // Weekly sales
    Order.aggregate([
      {
        $match: { createdAt: { $gte: last7Days } },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]).exec(),

    // Monthly revenue
    Order.aggregate([
      {
        $match: { createdAt: { $gte: last30Days } },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]).exec(),

    // Pending orders count
    Order.countDocuments({ status: "pending" }).exec(),

    // Completed orders count
    Order.countDocuments({ status: "delivered" }).exec(),

    // Low stock products
    Product.aggregate([
      {
        $match: { quantity: { $lte: 5 } },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          quantity: 1,
        },
      },
    ]).exec(),

    // Best sellers (by total quantity sold)
    Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          totalQty: { $sum: "$items.quantity" },
        },
      },
      {
        $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" },
      },
      {
        $project: {
          productId: 1,
          totalQty: 1,
          name: "$product.name",
        },
      },
      { $sort: { totalQty: -1 } },
      { $limit: 5 },
    ]).exec(),

    // Recent orders
    Order.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .select("orderNumber status items totalAmount createdAt")
      .exec(),
  ]);

  return NextResponse.json({
    totalSales: totalSales[0]?.totalAmount || 0,
    weeklySales: weeklySales[0]?.totalAmount || 0,
    monthlyRevenue: monthlyRevenue[0]?.totalAmount || 0,
    pendingOrders: pendingOrders,
    completedOrders: completedOrders,
    lowStock,
    bestSellers,
    recentOrders,
  });
}