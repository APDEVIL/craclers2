import { bankAccountRouter } from "@/server/api/routers/bank-account";
import { cartRouter } from "@/server/api/routers/cart";
import { categoryRouter } from "@/server/api/routers/category";
import { leadRouter } from "@/server/api/routers/lead";
import { orderRouter } from "@/server/api/routers/order";
import { productRouter } from "@/server/api/routers/product";
import { settingsRouter } from "@/server/api/routers/settings";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

export const appRouter = createTRPCRouter({
	category: categoryRouter,
	product: productRouter,
	cart: cartRouter,
	order: orderRouter,
	bankAccount: bankAccountRouter,
	settings: settingsRouter,
	lead: leadRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
