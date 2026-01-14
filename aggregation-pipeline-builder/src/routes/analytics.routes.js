import express from "express";
import Order from "../models/Order.model.js";

const router = express.Router();

router.get("/orders", async (req, res) => {
    try {
        const analytics = await Order.aggregate([
            // Join users
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },

            // Join products
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },

            // Calculate order value
            {
                $addFields: {
                    orderValue: {
                        $multiply: ["$quantity", "$product.price"]
                    }
                }
            },

            // Faceted analytics
            {
                $facet: {
                    // 1️⃣ Total spending per user
                    spendingByUser: [
                        {
                            $group: {
                                _id: "$user._id",
                                name: { $first: "$user.name" },
                                totalSpent: { $sum: "$orderValue" }
                            }
                        },
                        { $sort: { totalSpent: -1 } },
                        { $limit: 5 }
                    ],

                    // 2️⃣ Total sales per category
                    salesByCategory: [
                        {
                            $group: {
                                _id: "$product.category",
                                totalSales: { $sum: "$orderValue" }
                            }
                        },
                        { $sort: { totalSales: -1 } }
                    ],

                    // 3️⃣ Orders grouped by user
                    ordersPerUser: [
                        {
                            $group: {
                                _id: "$user._id",
                                name: { $first: "$user.name" },
                                ordersCount: { $sum: 1 }
                            }
                        }
                    ]
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: analytics[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;
