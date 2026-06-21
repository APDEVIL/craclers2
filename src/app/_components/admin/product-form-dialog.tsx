"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { UploadButton } from "@/lib/uploadthing";
import { api } from "@/trpc/react";

const productFormSchema = z.object({
	categoryId: z.string().min(1, "Select a category"),
	code: z.coerce.number().int().positive("Code must be a positive number"),
	name: z.string().min(1, "Enter a product name").max(200),
	unit: z.string().min(1).max(20),
	imageUrl: z.string().url().optional().or(z.literal("")),
	mrpPrice: z.coerce.number().positive("MRP must be greater than 0"),
	discountPrice: z.coerce
		.number()
		.positive("Discount price must be greater than 0"),
	sortOrder: z.coerce.number().int(),
	isActive: z.boolean(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export interface ProductFormProduct {
	id: string;
	categoryId: string;
	code: number;
	name: string;
	unit: string;
	imageUrl: string | null;
	mrpPrice: string;
	discountPrice: string;
	sortOrder: number;
	isActive: boolean;
}

interface ProductFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	product?: ProductFormProduct;
	categories: { id: string; name: string }[];
	onSaved?: () => void;
}

function defaultsFor(product?: ProductFormProduct): ProductFormValues {
	return {
		categoryId: product?.categoryId ?? "",
		code: product?.code ?? 1,
		name: product?.name ?? "",
		unit: product?.unit ?? "PKT",
		imageUrl: product?.imageUrl ?? "",
		mrpPrice: product ? Number(product.mrpPrice) : 0,
		discountPrice: product ? Number(product.discountPrice) : 0,
		sortOrder: product?.sortOrder ?? 0,
		isActive: product?.isActive ?? true,
	};
}

export function ProductFormDialog({
	open,
	onOpenChange,
	product,
	categories,
	onSaved,
}: ProductFormDialogProps) {
	const isEditing = Boolean(product);

	const form = useForm<ProductFormValues>({
		resolver: zodResolver(productFormSchema),
		defaultValues: defaultsFor(product),
	});

	useEffect(() => {
		if (open) form.reset(defaultsFor(product));
	}, [open, product, form]);

	const utils = api.useUtils();

	const createMutation = api.product.create.useMutation({
		onSuccess: () => {
			void utils.product.adminList.invalidate();
			onSaved?.();
			onOpenChange(false);
		},
	});

	const updateMutation = api.product.update.useMutation({
		onSuccess: () => {
			void utils.product.adminList.invalidate();
			onSaved?.();
			onOpenChange(false);
		},
	});

	const mutation = isEditing ? updateMutation : createMutation;

	const onSubmit = (values: ProductFormValues) => {
		const payload = { ...values, imageUrl: values.imageUrl || undefined };
		if (isEditing && product) {
			updateMutation.mutate({ id: product.id, ...payload });
		} else {
			createMutation.mutate(payload);
		}
	};

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>
						{isEditing ? "Edit product" : "Add product"}
					</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="categoryId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Category</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select category" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{categories.map((category) => (
												<SelectItem key={category.id} value={category.id}>
													{category.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="code"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Code</FormLabel>
										<FormControl>
											<Input type="number" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="unit"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Unit</FormLabel>
										<FormControl>
											<Input placeholder="PKT" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Product name</FormLabel>
									<FormControl>
										<Input placeholder="3 ½ Lakshmi" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="mrpPrice"
								render={({ field }) => (
									<FormItem>
										<FormLabel>MRP price (₹)</FormLabel>
										<FormControl>
											<Input step="0.01" type="number" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="discountPrice"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Discount price (₹)</FormLabel>
										<FormControl>
											<Input step="0.01" type="number" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="imageUrl"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Product image</FormLabel>
									<div className="flex items-center gap-3">
										{/* Replace the existing <img /> inside your imageUrl FormField with this: */}
										{field.value ? (
											<Image
												alt="Category icon"
												className="h-10 w-10 rounded-md border object-contain"
												height={40}
												src={field.value}
												width={40}
											/>
										) : null}
										<UploadButton
											appearance={{
												button:
													"bg-[#14163A] text-white text-xs px-3 py-1.5 rounded-md",
												allowedContent: "hidden",
											}}
											endpoint="productImage"
											onClientUploadComplete={(res) => {
												const url = res[0]?.url;
												if (url) field.onChange(url);
											}}
										/>
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="sortOrder"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Sort order</FormLabel>
										<FormControl>
											<Input type="number" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="isActive"
								render={({ field }) => (
									<FormItem className="flex flex-row items-end gap-2 pb-1.5">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<FormLabel className="!mt-0">
											Visible on price list
										</FormLabel>
									</FormItem>
								)}
							/>
						</div>

						{mutation.error ? (
							<p className="font-medium text-[#C8202F] text-sm">
								{mutation.error.message}
							</p>
						) : null}

						<DialogFooter>
							<Button
								className="bg-[#14163A] hover:bg-[#1f2257]"
								disabled={mutation.isPending}
								type="submit"
							>
								{mutation.isPending ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : isEditing ? (
									"Save changes"
								) : (
									"Add product"
								)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
