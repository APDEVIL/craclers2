"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
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
import { UploadButton } from "@/lib/uploadthing";
import { api } from "@/trpc/react";

const slugify = (value: string) =>
	value
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-");

const categoryFormSchema = z.object({
	name: z.string().min(1, "Enter a category name").max(120),
	slug: z
		.string()
		.min(1, "Slug is required")
		.regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, hyphens only"),
	discountLabel: z.string().max(60).optional().or(z.literal("")),
	imageUrl: z.string().url().optional().or(z.literal("")),
	sortOrder: z.coerce.number().int(),
	isActive: z.boolean(),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export interface CategoryFormCategory {
	id: string;
	name: string;
	slug: string;
	discountLabel: string | null;
	imageUrl: string | null;
	sortOrder: number;
	isActive: boolean;
}

interface CategoryFormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	category?: CategoryFormCategory;
	onSaved?: () => void;
}

function defaultsFor(category?: CategoryFormCategory): CategoryFormValues {
	return {
		name: category?.name ?? "",
		slug: category?.slug ?? "",
		discountLabel: category?.discountLabel ?? "",
		imageUrl: category?.imageUrl ?? "",
		sortOrder: category?.sortOrder ?? 0,
		isActive: category?.isActive ?? true,
	};
}

export function CategoryFormDialog({
	open,
	onOpenChange,
	category,
	onSaved,
}: CategoryFormDialogProps) {
	const isEditing = Boolean(category);
	const [slugTouched, setSlugTouched] = useState(isEditing);

	const form = useForm<CategoryFormValues>({
		resolver: zodResolver(categoryFormSchema),
		defaultValues: defaultsFor(category),
	});

	useEffect(() => {
		if (!open) return;
		setSlugTouched(isEditing);
		form.reset(defaultsFor(category));
	}, [open, category, isEditing, form]);

	const utils = api.useUtils();

	const createMutation = api.category.create.useMutation({
		onSuccess: () => {
			void utils.category.adminList.invalidate();
			onSaved?.();
			onOpenChange(false);
		},
	});

	const updateMutation = api.category.update.useMutation({
		onSuccess: () => {
			void utils.category.adminList.invalidate();
			onSaved?.();
			onOpenChange(false);
		},
	});

	const mutation = isEditing ? updateMutation : createMutation;

	const onSubmit = (values: CategoryFormValues) => {
		const payload = {
			...values,
			discountLabel: values.discountLabel || undefined,
			imageUrl: values.imageUrl || undefined,
		};
		if (isEditing && category) {
			updateMutation.mutate({ id: category.id, ...payload });
		} else {
			createMutation.mutate(payload);
		}
	};

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>
						{isEditing ? "Edit category" : "Add category"}
					</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Category name</FormLabel>
									<FormControl>
										<Input
											placeholder="One Sound Crackers"
											{...field}
											onChange={(e) => {
												field.onChange(e);
												if (!slugTouched)
													form.setValue("slug", slugify(e.target.value));
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="slug"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Slug</FormLabel>
									<FormControl>
										<Input
											placeholder="one-sound-crackers"
											{...field}
											onChange={(e) => {
												setSlugTouched(true);
												field.onChange(e);
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="discountLabel"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Discount label (optional)</FormLabel>
									<FormControl>
										<Input placeholder="80% discount" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="imageUrl"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Category icon</FormLabel>
									<div className="flex items-center gap-3">
										{/* Replace the existing <img /> inside your imageUrl FormField with this: */}
										{field.value ? (
											<Image
												alt="Product image"
												className="h-12 w-12 rounded-md border object-cover"
												height={48}
												src={field.value}
												width={48}
											/>
										) : null}
										<UploadButton
											appearance={{
												button:
													"bg-[#14163A] text-white text-xs px-3 py-1.5 rounded-md",
												allowedContent: "hidden",
											}}
											endpoint="categoryImage"
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
											Visible to customers
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
									"Add category"
								)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
