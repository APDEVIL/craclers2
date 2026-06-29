import { eq } from "drizzle-orm";

import { env } from "@/env";
import { auth } from "@/server/better-auth";
import { db } from "@/server/db";
import {
	bankAccount,
	category,
	product,
	siteSetting,
	user,
} from "@/server/db/schema";

// ── Local image paths (public/products) ─────────────────────
const AVAILABLE_IMAGES = new Set([
	"1-quarterhalfthree-quarter1-Twinkling-star-BOX.jpg-Twinkling-star-BOX.jpg",
	"10-Cm-Color-Sparklers-BOX.jpg",
	"10-Cm-Electric-Sparklers-BOX.jpg",
	"10-Cm-Green-Sparklers-BOX.jpg",
	"10-Cm-Red-Sparklers-BOX.jpg",
	"10-pencil-box.jpg",
	"100-Deluxe-PKT.jpg",
	"100-Wala-BOX.jpg",
	"1000-Wala-BOX.jpg",
	"1000-Wala-Power-BOX.jpg",
	"10000-BOX.jpg",
	"10000-Wala-Power-BOX.jpg",
	"10cm-Color-Sparklers-BOX.jpg",
	"10cm-Electric-Sparklers-BOX.jpg",
	"10cm-Green-Sparklers-BOX.jpg",
	"10cm-Red-Sparklers-BOX.jpg",
	"10x10-Sizeling-Shot-BOX.jpg",
	"10X10-Tail-Light-BOX.jpg",
	"12-Cm-Color-Sparklers-BOX.jpg",
	"12-Cm-Electric-Sparklers-BOX.jpg",
	"12-Cm-Green-Sparklers-BOX.jpg",
	"12-Cm-Red-Sparklers-BOX.jpg",
	"12-Shot-BOX.jpg",
	"12-Step-BOX.jpg",
	"120-Shot-Multi-Color-BOX.jpg",
	"15-Cm-Color-Sparklers-BOX.jpg",
	"15-Cm-Electric-Sparklers-BOX.jpg",
	"15-Cm-Green-Sparklers-BOX.jpg",
	"15-Cm-Red-Sparklers-BOX.jpg",
	"1quarterhalfthree-quarter1-Twinkling-Star-BOX.jpg-Twinkling-Star-BOX.jpg",
	"2-quarterhalfthree-quarter2-Fancy-BOX.jpg-Fancy-BOX.jpg",
	"2-quarterhalfthree-quarter2-Fancy-Pipe-3-Pcs-BOX.jpg-Fancy-Pipe-3-Pcs-BOX.jpg",
	"2-quarterhalfthree-quarter2-Kuruvi-PKT.jpg-Kuruvi-PKT.jpg",
	"2-Sun-feast-Multicolor-BOX.jpg",
	"20-x-2.5Thriller-Set-Grand-BOX.jpg",
	"200-Wala-BOX.jpg",
	"2000-Wala-BOX.jpg",
	"24-Deluxe-PKT.jpg",
	"240-Shot-Multi-Color-BOX.jpg",
	"28-Chorsa-PKT.jpg",
	"3-quarterhalfthree-quarter3-Lakshmi-PKT.jpg-Lakshmi-PKT.jpg",
	"3-Red-Sun-Shower-BOX.jpg",
	"30-Cm-Color-Sparklers-BOX.jpg",
	"30-Cm-Electric-Sparklers-BOX.jpg",
	"30-Cm-Green-Sparklers-BOX.jpg",
	"30-Cm-Red-Sparklers-BOX.jpg",
	"30-Peacock-Shot-BOX.jpg",
	"30-Shot-Multi-Color-BOX.jpg",
	"300-Wala-BOX.jpg",
	"32-x-3.5Mega-Thriller-Set-Grand-BOX.jpg",
	"4-Fancy-BOX.jpg",
	"4-Lakshmi-Deluxe-PKT.jpg",
	"4-Lakshmi-PKT.jpg",
	"4-Pipe-Golden-Eye-BOX.jpg",
	"4-Pipe-Wow-Purple-BOX.jpg",
	"4-Twinkling-Star-BOX.jpg",
	"50-Cm-Color-Sparklers-BOX.jpg",
	"50-Cm-Electric-Sparklers-BOX.jpg",
	"50-Deluxe-PKT.jpg",
	"5000-Wala-BOX.jpg",
	"5000-Wala-Power-BOX.jpg",
	"56-Giant-PKT.jpg",
	"60-Shot-Multi-Color-BOX.jpg",
	"600-Wala-BOX.jpg",
	"7-Cm-Color-Sparklers-BOX.jpg",
	"7-Cm-Electric-Sparklers-BOX.jpg",
	"7-Cm-Green-Sparklers-BOX.jpg",
	"7-Cm-Red-Sparklers-BOX.jpg",
	"7-Pencil-BOX.jpg",
	"7-Shot-BOX.jpg",
	"adiyal-kg-box.jpg",
	"Adiyal-quarterhalfthree-quarterAdiyal-Kg-BOX.jpg-Kg-BOX.jpg",
	"Agni-Bomb-BOX.jpg",
	"Asrafi-BOX.jpg",
	"Atom-Bomb-BOX.jpg",
	"Avatar-Bomb-10-Pcs-BOX.jpg",
	"Baby-Rocket-BOX.jpg",
	"Bada-Peacock-BOX.jpg",
	"Bagubali-PKT.jpg",
	"Bambara-Spinner-BOX.jpg",
	"Bullet-Bomb-BOX.jpg",
	"Chakker-Deluxe-BOX.jpg",
	"Chakker-Small-BOX.jpg",
	"Chakker-Special-BOX.jpg",
	"ChakkerAshoka-BOX.jpg",
	"Chun-Mun-Barrels-BOX.jpg",
	"Classic-Bomb-BOX.jpg",
	"Dancing-Butterfly-BOX.jpg",
	"Digital-Deluxe-Bomb-BOX.jpg",
	"Dinosaur-Bomb-BOX.jpg",
	"Disco-Wheel-5-Pcs-BOX.jpg",
	"Electric-Stone-BOX.jpg",
	"Elephant-Deluxe-BOX.jpg",
	"Flower-Pots-Deluxe-5Pcs-BOX.jpg",
	"Flowerpots-Ashoka-BOX.jpg",
	"Flowerpots-Big-BOX.jpg",
	"Flowerpots-Color-Koti-BOX.jpg",
	"Flowerpots-Color-Koti-Deluxe-BOX.jpg",
	"Flowerpots-Multicolor-Giant-BOX.jpg",
	"Flowerpots-Small-BOX.jpg",
	"Flowerpots-Special-BOX.jpg",
	"Fun-Zone-Crackling-5Pcs-BOX.jpg",
	"Ganga-Jamuna-BOX.jpg",
	"Gold-Lakshmi-PKT.JPEG",
	"Hydro-Bomb-BOX.jpg",
	"King-Of-King-BOX.jpg",
	"King-Star-BOX.jpg",
	"Kit-Kat-BOX.jpg",
	"Lucky-Red-and-Green-5pcs-1-BOX.jpg",
	"Lunic-Rocket-BOX.jpg",
	"Magic-whip-BOX.jpg",
	"Mega-Deluxe-BOX.jpg",
	"Mega-Laptop-Matches-BOX.jpg",
	"Mega-Siren-BOX.jpg",
	"Mini-Siren-BOX.jpg",
	"Old-is-Gold-PKT.jpg",
	"Peacock-Fancy-BOX.jpg",
	"Penta-Park-Multi-Color-BOX.jpg",
	"Red-Bijili-100-Pcs-BOX.jpg",
	"Red-Bijili-50-Pcs-BOX.jpg",
	"Rocket-Bomb-BOX.jpg",
	"Roll-Cap-BOX.jpg",
	"Rotating-Sparklers-BOX.jpg",
	"Royal-Deluxe-Matches-BOX.jpg",
	"Royal-Lamba-Matches-BOX.jpg",
	"SivakasiSpecail-BOX.jpg",
	"Sky-King-Multi-Color-BOX.jpg",
	"Snake-Tablet-BOX.jpg",
	"Tin-Beer-Shower-BOX.jpg",
	"Tri-Color-5-Pcs-BOX.jpg",
	"Two-Sound-PKT.jpg",
	"Two-Sound-Rocket-BOX.jpg",
	"Ultra-Color-Pencil-3-Pcs-BOX.jpg",
	"Water-Queen-Falls-PKT.jpg",
	"Whistling-Wheel-5-Pcs-BOX.jpg",
	"Zee-Boom-Baa-BOX.jpg",
]);

function img(filename: string): string | null {
	return AVAILABLE_IMAGES.has(filename) ? `/products/${filename}` : null;
}

// ── Admin user ────────────────────────────────────────────────
async function seedAdmin() {
	const [existingAdmin] = await db.select().from(user).limit(1);
	if (existingAdmin) {
		console.log("✓ Admin user already exists, skipping");
		return;
	}

	if (!env.INITIAL_ADMIN_EMAIL || !env.INITIAL_ADMIN_PASSWORD) {
		console.warn(
			"⚠ INITIAL_ADMIN_EMAIL / INITIAL_ADMIN_PASSWORD not set — skipping admin creation",
		);
		return;
	}

	await auth.api.signUpEmail({
		body: {
			email: env.INITIAL_ADMIN_EMAIL,
			password: env.INITIAL_ADMIN_PASSWORD,
			name: env.INITIAL_ADMIN_NAME ?? "Admin",
		},
	});
	console.log(`✓ Created admin user: ${env.INITIAL_ADMIN_EMAIL}`);
}

// ── Site settings ─────────────────────────────────────────────
async function seedSettings() {
	const [existing] = await db
		.select()
		.from(siteSetting)
		.where(eq(siteSetting.id, 1))
		.limit(1);
	if (existing) {
		console.log("✓ Site settings already exist, skipping");
		return;
	}

	await db.insert(siteSetting).values({
		id: 1,
		shopName: "Sri'S Crackers Shop",
		shopAddress: "3/1232/11, Sattur Road, Paraipatti, Sivakasi - 626 189",
		minimumOrderAmount: "3000.00",
		whatsappNumber: "9626965591",
		contactPhonePrimary: "9626965591",
		contactPhoneSecondary: "8248459275",
		announcementText: "Welcome to Sri's Crackers Shop — Discount Live!",
	});
	console.log("✓ Seeded site settings");
}

// ── Bank accounts ─────────────────────────────────────────────
async function seedBankAccounts() {
	const [existing] = await db.select().from(bankAccount).limit(1);
	if (existing) {
		console.log("✓ Bank accounts already exist, skipping");
		return;
	}

	await db.insert(bankAccount).values([
		{
			bankName: "State Bank Of India",
			accountHolderName: "Muralikrishnan",
			accountNumber: "30954794539",
			ifscCode: "SBIN0007486",
			sortOrder: 0,
		},
		{
			bankName: "ICICI Bank",
			accountHolderName: "Muralikrishnan",
			accountNumber: "323401500464",
			ifscCode: "ICIC0003234",
			branchName: "ICICI Bank Technopark Phase Three Branch",
			sortOrder: 1,
		},
	]);
	console.log("✓ Seeded bank accounts");
}

// ── Categories ─────────────────────────────────────────────────
const CATEGORY_SEED = [
	{ name: "One Sound Crackers", slug: "one-sound-crackers" },
	{ name: "Flower Pots (10pcs)", slug: "flower-pots" },
	{ name: "Ground Chakkars", slug: "ground-chakkars" },
	{ name: "Sparklers", slug: "sparklers" },
	{ name: "Pencil Sparkling Varieties", slug: "pencil-sparkling-varieties" },
	{ name: "Sky Rockets", slug: "sky-rockets" },
	{ name: "Bijili Crackers", slug: "bijili-crackers" },
	{ name: "Bomb Crackers", slug: "bomb-crackers" },
	{ name: "Paper Bomb", slug: "paper-bomb" },
	{ name: "Wala Garland", slug: "wala-garland" },
	{ name: "Sky Night Celebration", slug: "sky-night-celebration" },
	{ name: "Night Fancy Celebration", slug: "night-fancy-celebration" },
	{ name: "Fancy Flower Balls", slug: "fancy-flower-balls" },
	{ name: "Color Matches", slug: "color-matches" },
	{ name: "Children Gun Items", slug: "children-gun-items" },
	{ name: "New Arrivals", slug: "new-arrivals" },
	{ name: "New Arrivals 2026", slug: "new-arrivals-2026" },
	{ name: "Combo Pack", slug: "combo-pack" },
] as const;

async function seedCategories() {
	const [existing] = await db.select().from(category).limit(1);
	if (existing) {
		console.log("✓ Categories already exist, skipping");
		return;
	}

	const inserted = await db
		.insert(category)
		.values(
			CATEGORY_SEED.map((c, index) => ({
				name: c.name,
				slug: c.slug,
				discountLabel: "80% discount",
				sortOrder: index,
				isActive: true,
			})),
		)
		.onConflictDoNothing()
		.returning();

	console.log(`✓ Seeded ${inserted.length} categories`);
}

// ── Products ───────────────────────────────────────────────────
interface RawProduct {
	name: string;
	discountPrice: number;
	mrpPrice: number;
	unit: string;
	categorySlug: string;
	imageUrl: string | null;
}

const PRODUCT_SEED: RawProduct[] = [
	// ── ONE SOUND CRACKERS ────────────────────────────────
	{
		name: "3½ Lakshmi",
		discountPrice: 13,
		mrpPrice: 65,
		unit: "PKT",
		categorySlug: "one-sound-crackers",
		imageUrl: img(
			"3-quarterhalfthree-quarter3-Lakshmi-PKT.jpg-Lakshmi-PKT.jpg",
		),
	},
	{
		name: "4 Lakshmi",
		discountPrice: 16,
		mrpPrice: 80,
		unit: "PKT",
		categorySlug: "one-sound-crackers",
		imageUrl: img("4-Lakshmi-PKT.jpg"),
	},
	{
		name: "4 Lakshmi Deluxe",
		discountPrice: 20,
		mrpPrice: 100,
		unit: "PKT",
		categorySlug: "one-sound-crackers",
		imageUrl: img("4-Lakshmi-Deluxe-PKT.jpg"),
	},
	{
		name: "Gold Lakshmi",
		discountPrice: 32,
		mrpPrice: 160,
		unit: "PKT",
		categorySlug: "one-sound-crackers",
		imageUrl: img("Gold-Lakshmi-PKT.JPEG"),
	},
	{
		name: "Hulk Deluxe",
		discountPrice: 34,
		mrpPrice: 170,
		unit: "PKT",
		categorySlug: "one-sound-crackers",
		imageUrl: img("4-Lakshmi-Deluxe-PKT.jpg"),
	},
	{
		name: "Bagubali",
		discountPrice: 40,
		mrpPrice: 200,
		unit: "PKT",
		categorySlug: "one-sound-crackers",
		imageUrl: img("Bagubali-PKT.jpg"),
	},
	{
		name: "Jallikattu",
		discountPrice: 45,
		mrpPrice: 225,
		unit: "PKT",
		categorySlug: "one-sound-crackers",
		imageUrl: img("Bagubali-PKT.jpg"),
	},
	{
		name: "Two Sound",
		discountPrice: 32,
		mrpPrice: 160,
		unit: "PKT",
		categorySlug: "one-sound-crackers",
		imageUrl: img("Two-Sound-PKT.jpg"),
	},
	{
		name: "2¾ Kuruvi",
		discountPrice: 9,
		mrpPrice: 45,
		unit: "PKT",
		categorySlug: "one-sound-crackers",
		imageUrl: img("2-quarterhalfthree-quarter2-Kuruvi-PKT.jpg-Kuruvi-PKT.jpg"),
	},
	{
		name: "Elephant Deluxe",
		discountPrice: 32,
		mrpPrice: 160,
		unit: "BOX",
		categorySlug: "one-sound-crackers",
		imageUrl: img("Elephant-Deluxe-BOX.jpg"),
	},

	// ── FLOWER POTS ───────────────────────────────────────
	{
		name: "Flowerpots Small",
		discountPrice: 48,
		mrpPrice: 240,
		unit: "10 pcs",
		categorySlug: "flower-pots",
		imageUrl: img("Flowerpots-Small-BOX.jpg"),
	},
	{
		name: "Flowerpots Big",
		discountPrice: 90,
		mrpPrice: 450,
		unit: "10 pcs",
		categorySlug: "flower-pots",
		imageUrl: img("Flowerpots-Big-BOX.jpg"),
	},
	{
		name: "Flowerpots Special",
		discountPrice: 135,
		mrpPrice: 675,
		unit: "10 pcs",
		categorySlug: "flower-pots",
		imageUrl: img("Flowerpots-Special-BOX.jpg"),
	},
	{
		name: "Flowerpots Ashoka",
		discountPrice: 165,
		mrpPrice: 825,
		unit: "10 pcs",
		categorySlug: "flower-pots",
		imageUrl: img("Flowerpots-Ashoka-BOX.jpg"),
	},
	{
		name: "Flowerpots Color Koti",
		discountPrice: 240,
		mrpPrice: 1200,
		unit: "10 pcs",
		categorySlug: "flower-pots",
		imageUrl: img("Flowerpots-Color-Koti-BOX.jpg"),
	},
	{
		name: "Flowerpots Multicolor Giant",
		discountPrice: 325,
		mrpPrice: 1625,
		unit: "10 pcs",
		categorySlug: "flower-pots",
		imageUrl: img("Flowerpots-Multicolor-Giant-BOX.jpg"),
	},
	{
		name: "Flowerpots Color Koti Deluxe",
		discountPrice: 320,
		mrpPrice: 1600,
		unit: "10 pcs",
		categorySlug: "flower-pots",
		imageUrl: img("Flowerpots-Color-Koti-Deluxe-BOX.jpg"),
	},
	{
		name: "Flower Pots Deluxe",
		discountPrice: 160,
		mrpPrice: 800,
		unit: "5 pcs",
		categorySlug: "flower-pots",
		imageUrl: img("Flower-Pots-Deluxe-5Pcs-BOX.jpg"),
	},
	{
		name: "Tri Color",
		discountPrice: 240,
		mrpPrice: 1200,
		unit: "5 pcs",
		categorySlug: "flower-pots",
		imageUrl: img("Tri-Color-5-Pcs-BOX.jpg"),
	},
	{
		name: "Lucky Red and Green",
		discountPrice: 30,
		mrpPrice: 150,
		unit: "5 pcs",
		categorySlug: "flower-pots",
		imageUrl: img("Lucky-Red-and-Green-5pcs-1-BOX.jpg"),
	},

	// ── GROUND CHAKKARS ───────────────────────────────────
	{
		name: "Chakker Small",
		discountPrice: 35,
		mrpPrice: 175,
		unit: "BOX",
		categorySlug: "ground-chakkars",
		imageUrl: img("Chakker-Small-BOX.jpg"),
	},
	{
		name: "Chakker Small",
		discountPrice: 110,
		mrpPrice: 550,
		unit: "25 pcs",
		categorySlug: "ground-chakkars",
		imageUrl: img("Chakker-Small-BOX.jpg"),
	},
	{
		name: "Chakker Ashoka",
		discountPrice: 75,
		mrpPrice: 375,
		unit: "BOX",
		categorySlug: "ground-chakkars",
		imageUrl: img("ChakkerAshoka-BOX.jpg"),
	},
	{
		name: "Chakker Special",
		discountPrice: 120,
		mrpPrice: 600,
		unit: "BOX",
		categorySlug: "ground-chakkars",
		imageUrl: img("Chakker-Special-BOX.jpg"),
	},
	{
		name: "Chakker Deluxe",
		discountPrice: 150,
		mrpPrice: 750,
		unit: "BOX",
		categorySlug: "ground-chakkars",
		imageUrl: img("Chakker-Deluxe-BOX.jpg"),
	},
	{
		name: "Disco Wheel",
		discountPrice: 70,
		mrpPrice: 350,
		unit: "5 pcs",
		categorySlug: "ground-chakkars",
		imageUrl: img("Disco-Wheel-5-Pcs-BOX.jpg"),
	},
	{
		name: "Whistling Wheel",
		discountPrice: 135,
		mrpPrice: 675,
		unit: "5 pcs",
		categorySlug: "ground-chakkars",
		imageUrl: img("Whistling-Wheel-5-Pcs-BOX.jpg"),
	},

	// ── SPARKLERS ─────────────────────────────────────────
	{
		name: "7cm Electric Sparklers",
		discountPrice: 9,
		mrpPrice: 45,
		unit: "BOX",
		categorySlug: "sparklers",
		imageUrl: img("7-Cm-Electric-Sparklers-BOX.jpg"),
	},
	{
		name: "7cm Color Sparklers",
		discountPrice: 10,
		mrpPrice: 50,
		unit: "BOX",
		categorySlug: "sparklers",
		imageUrl: img("7-Cm-Color-Sparklers-BOX.jpg"),
	},
	{
		name: "7cm Green Sparklers",
		discountPrice: 12,
		mrpPrice: 60,
		unit: "BOX",
		categorySlug: "sparklers",
		imageUrl: img("7-Cm-Green-Sparklers-BOX.jpg"),
	},
	{
		name: "7cm Red Sparklers",
		discountPrice: 14,
		mrpPrice: 70,
		unit: "BOX",
		categorySlug: "sparklers",
		imageUrl: img("7-Cm-Red-Sparklers-BOX.jpg"),
	},
	{
		name: "10cm Electric Sparklers",
		discountPrice: 21,
		mrpPrice: 105,
		unit: "BOX",
		categorySlug: "sparklers",
		imageUrl: img("10cm-Electric-Sparklers-BOX.jpg"),
	},
	{
		name: "10cm Color Sparklers",
		discountPrice: 24,
		mrpPrice: 120,
		unit: "BOX",
		categorySlug: "sparklers",
		imageUrl: img("10cm-Color-Sparklers-BOX.jpg"),
	},
	{
		name: "10cm Green Sparklers",
		discountPrice: 25,
		mrpPrice: 125,
		unit: "BOX",
		categorySlug: "sparklers",
		imageUrl: img("10cm-Green-Sparklers-BOX.jpg"),
	},
	{
		name: "10cm Red Sparklers",
		discountPrice: 26,
		mrpPrice: 130,
		unit: "BOX",
		categorySlug: "sparklers",
		imageUrl: img("10cm-Red-Sparklers-BOX.jpg"),
	},
	{
		name: "12cm Electric Sparklers",
		discountPrice: 34,
		mrpPrice: 170,
		unit: "BOX",
		categorySlug: "sparklers",
		imageUrl: img("12-Cm-Electric-Sparklers-BOX.jpg"),
	},
	{
		name: "12cm Color Sparklers",
		discountPrice: 35,
		mrpPrice: 175,
		unit: "BOX",
		categorySlug: "sparklers",
		imageUrl: img("12-Cm-Color-Sparklers-BOX.jpg"),
	},
	{
		name: "12cm Green Sparklers",
		discountPrice: 36,
		mrpPrice: 180,
		unit: "BOX",
		categorySlug: "sparklers",
		imageUrl: img("12-Cm-Green-Sparklers-BOX.jpg"),
	},
	{
		name: "12cm Red Sparklers",
		discountPrice: 38,
		mrpPrice: 190,
		unit: "BOX",
		categorySlug: "sparklers",
		imageUrl: img("12-Cm-Red-Sparklers-BOX.jpg"),
	},
	{
		name: "15cm Electric Sparklers",
		discountPrice: 48,
		mrpPrice: 240,
		unit: "BOX",
		categorySlug: "sparklers",
		imageUrl: img("15-Cm-Electric-Sparklers-BOX.jpg"),
	},
	{
		name: "15cm Color Sparklers",
		discountPrice: 50,
		mrpPrice: 250,
		unit: "BOX",
		categorySlug: "sparklers",
		imageUrl: img("15-Cm-Color-Sparklers-BOX.jpg"),
	},
	{
		name: "15cm Green Sparklers",
		discountPrice: 52,
		mrpPrice: 260,
		unit: "BOX",
		categorySlug: "sparklers",
		imageUrl: img("15-Cm-Green-Sparklers-BOX.jpg"),
	},
	{
		name: "15cm Red Sparklers",
		discountPrice: 54,
		mrpPrice: 270,
		unit: "BOX",
		categorySlug: "sparklers",
		imageUrl: img("15-Cm-Red-Sparklers-BOX.jpg"),
	},
	{
		name: "30cm Electric Sparklers",
		discountPrice: 48,
		mrpPrice: 240,
		unit: "BOX",
		categorySlug: "sparklers",
		imageUrl: img("30-Cm-Electric-Sparklers-BOX.jpg"),
	},
	{
		name: "30cm Color Sparklers",
		discountPrice: 50,
		mrpPrice: 250,
		unit: "BOX",
		categorySlug: "sparklers",
		imageUrl: img("30-Cm-Color-Sparklers-BOX.jpg"),
	},
	{
		name: "30cm Green Sparklers",
		discountPrice: 52,
		mrpPrice: 260,
		unit: "BOX",
		categorySlug: "sparklers",
		imageUrl: img("30-Cm-Green-Sparklers-BOX.jpg"),
	},
	{
		name: "30cm Red Sparklers",
		discountPrice: 54,
		mrpPrice: 270,
		unit: "BOX",
		categorySlug: "sparklers",
		imageUrl: img("30-Cm-Red-Sparklers-BOX.jpg"),
	},
	{
		name: "50cm Electric Sparklers",
		discountPrice: 150,
		mrpPrice: 750,
		unit: "BOX",
		categorySlug: "sparklers",
		imageUrl: img("50-Cm-Electric-Sparklers-BOX.jpg"),
	},
	{
		name: "50cm Color Sparklers",
		discountPrice: 160,
		mrpPrice: 800,
		unit: "BOX",
		categorySlug: "sparklers",
		imageUrl: img("50-Cm-Color-Sparklers-BOX.jpg"),
	},

	// ── PENCIL SPARKLING VARIETIES ────────────────────────
	{
		name: "1½ Twinkling Star",
		discountPrice: 24,
		mrpPrice: 120,
		unit: "BOX",
		categorySlug: "pencil-sparkling-varieties",
		imageUrl: img(
			"1-quarterhalfthree-quarter1-Twinkling-star-BOX.jpg-Twinkling-star-BOX.jpg",
		),
	},
	{
		name: "4 Twinkling Star",
		discountPrice: 60,
		mrpPrice: 300,
		unit: "BOX",
		categorySlug: "pencil-sparkling-varieties",
		imageUrl: img("4-Twinkling-Star-BOX.jpg"),
	},
	{
		name: '7" Pencil',
		discountPrice: 30,
		mrpPrice: 150,
		unit: "BOX",
		categorySlug: "pencil-sparkling-varieties",
		imageUrl: img("7-Pencil-BOX.jpg"),
	},
	{
		name: '10" Pencil',
		discountPrice: 60,
		mrpPrice: 300,
		unit: "BOX",
		categorySlug: "pencil-sparkling-varieties",
		imageUrl: img("10-pencil-box.jpg"),
	},
	{
		name: "Ultra-Color Pencil",
		discountPrice: 70,
		mrpPrice: 350,
		unit: "3 pcs",
		categorySlug: "pencil-sparkling-varieties",
		imageUrl: img("Ultra-Color-Pencil-3-Pcs-BOX.jpg"),
	},
	{
		name: "Sivakasi Special",
		discountPrice: 210,
		mrpPrice: 1050,
		unit: "BOX",
		categorySlug: "pencil-sparkling-varieties",
		imageUrl: img("SivakasiSpecail-BOX.jpg"),
	},
	{
		name: "Pop Corn Pencil",
		discountPrice: 180,
		mrpPrice: 900,
		unit: "5 pcs",
		categorySlug: "pencil-sparkling-varieties",
		imageUrl: img("Ultra-Color-Pencil-3-Pcs-BOX.jpg"),
	},
	{
		name: "Cartoon Pots",
		discountPrice: 20,
		mrpPrice: 100,
		unit: "BOX",
		categorySlug: "pencil-sparkling-varieties",
		imageUrl: img("10-pencil-box.jpg"),
	},

	// ── SKY ROCKETS ───────────────────────────────────────
	{
		name: "Baby Rocket",
		discountPrice: 35,
		mrpPrice: 175,
		unit: "BOX",
		categorySlug: "sky-rockets",
		imageUrl: img("Baby-Rocket-BOX.jpg"),
	},
	{
		name: "Rocket Bomb",
		discountPrice: 80,
		mrpPrice: 400,
		unit: "BOX",
		categorySlug: "sky-rockets",
		imageUrl: img("Rocket-Bomb-BOX.jpg"),
	},
	{
		name: "Lunic Rocket",
		discountPrice: 120,
		mrpPrice: 600,
		unit: "BOX",
		categorySlug: "sky-rockets",
		imageUrl: img("Lunic-Rocket-BOX.jpg"),
	},
	{
		name: "Two Sound Rocket",
		discountPrice: 130,
		mrpPrice: 650,
		unit: "BOX",
		categorySlug: "sky-rockets",
		imageUrl: img("Two-Sound-Rocket-BOX.jpg"),
	},
	{
		name: "Echo Music Rocket",
		discountPrice: 145,
		mrpPrice: 725,
		unit: "BOX",
		categorySlug: "sky-rockets",
		imageUrl: img("Two-Sound-Rocket-BOX.jpg"),
	},

	// ── BIJILI CRACKERS ───────────────────────────────────
	{
		name: "Red Bijili",
		discountPrice: 15,
		mrpPrice: 75,
		unit: "50 pcs",
		categorySlug: "bijili-crackers",
		imageUrl: img("Red-Bijili-50-Pcs-BOX.jpg"),
	},
	{
		name: "Red Bijili",
		discountPrice: 35,
		mrpPrice: 175,
		unit: "100 pcs",
		categorySlug: "bijili-crackers",
		imageUrl: img("Red-Bijili-100-Pcs-BOX.jpg"),
	},

	// ── BOMB CRACKERS ─────────────────────────────────────
	{
		name: "Bullet Bomb",
		discountPrice: 22,
		mrpPrice: 110,
		unit: "BOX",
		categorySlug: "bomb-crackers",
		imageUrl: img("Bullet-Bomb-BOX.jpg"),
	},
	{
		name: "Atom Bomb",
		discountPrice: 45,
		mrpPrice: 225,
		unit: "BOX",
		categorySlug: "bomb-crackers",
		imageUrl: img("Atom-Bomb-BOX.jpg"),
	},
	{
		name: "Hydro Bomb",
		discountPrice: 65,
		mrpPrice: 325,
		unit: "BOX",
		categorySlug: "bomb-crackers",
		imageUrl: img("Hydro-Bomb-BOX.jpg"),
	},
	{
		name: "King Of King",
		discountPrice: 85,
		mrpPrice: 425,
		unit: "BOX",
		categorySlug: "bomb-crackers",
		imageUrl: img("King-Of-King-BOX.jpg"),
	},
	{
		name: "Classic Bomb",
		discountPrice: 110,
		mrpPrice: 550,
		unit: "BOX",
		categorySlug: "bomb-crackers",
		imageUrl: img("Classic-Bomb-BOX.jpg"),
	},
	{
		name: "Dinosaur Bomb",
		discountPrice: 198,
		mrpPrice: 990,
		unit: "BOX",
		categorySlug: "bomb-crackers",
		imageUrl: img("Dinosaur-Bomb-BOX.jpg"),
	},
	{
		name: "Agni Bomb",
		discountPrice: 190,
		mrpPrice: 950,
		unit: "BOX",
		categorySlug: "bomb-crackers",
		imageUrl: img("Agni-Bomb-BOX.jpg"),
	},
	{
		name: "Digital Deluxe Bomb",
		discountPrice: 220,
		mrpPrice: 1100,
		unit: "BOX",
		categorySlug: "bomb-crackers",
		imageUrl: img("Digital-Deluxe-Bomb-BOX.jpg"),
	},

	// ── PAPER BOMB ────────────────────────────────────────
	{
		name: "Adiyal ¼ Kg",
		discountPrice: 60,
		mrpPrice: 300,
		unit: "¼ kg",
		categorySlug: "paper-bomb",
		imageUrl: img("adiyal-kg-box.jpg"),
	},
	{
		name: "Adiyal ½ Kg",
		discountPrice: 120,
		mrpPrice: 600,
		unit: "½ kg",
		categorySlug: "paper-bomb",
		imageUrl: img(
			"Adiyal-quarterhalfthree-quarterAdiyal-Kg-BOX.jpg-Kg-BOX.jpg",
		),
	},
	{
		name: "Color Paper Vedi",
		discountPrice: 90,
		mrpPrice: 450,
		unit: "5 pcs",
		categorySlug: "paper-bomb",
		imageUrl: img("adiyal-kg-box.jpg"),
	},
	{
		name: "Avatar Bomb",
		discountPrice: 250,
		mrpPrice: 1250,
		unit: "10 pcs",
		categorySlug: "paper-bomb",
		imageUrl: img("Avatar-Bomb-10-Pcs-BOX.jpg"),
	},
	{
		name: "Crorepathy Bomb",
		discountPrice: 294,
		mrpPrice: 1470,
		unit: "BOX",
		categorySlug: "paper-bomb",
		imageUrl: img("Avatar-Bomb-10-Pcs-BOX.jpg"),
	},

	// ── WALA GARLAND ──────────────────────────────────────
	{
		name: "24 Deluxe",
		discountPrice: 45,
		mrpPrice: 225,
		unit: "PKT",
		categorySlug: "wala-garland",
		imageUrl: img("24-Deluxe-PKT.jpg"),
	},
	{
		name: "50 Deluxe",
		discountPrice: 105,
		mrpPrice: 525,
		unit: "PKT",
		categorySlug: "wala-garland",
		imageUrl: img("50-Deluxe-PKT.jpg"),
	},
	{
		name: "100 Deluxe",
		discountPrice: 210,
		mrpPrice: 1050,
		unit: "PKT",
		categorySlug: "wala-garland",
		imageUrl: img("100-Deluxe-PKT.jpg"),
	},
	{
		name: "28 Chorsa",
		discountPrice: 15,
		mrpPrice: 75,
		unit: "PKT",
		categorySlug: "wala-garland",
		imageUrl: img("28-Chorsa-PKT.jpg"),
	},
	{
		name: "28 Giant",
		discountPrice: 30,
		mrpPrice: 150,
		unit: "PKT",
		categorySlug: "wala-garland",
		imageUrl: img("56-Giant-PKT.jpg"),
	},
	{
		name: "56 Giant",
		discountPrice: 45,
		mrpPrice: 225,
		unit: "PKT",
		categorySlug: "wala-garland",
		imageUrl: img("56-Giant-PKT.jpg"),
	},
	{
		name: "100 Wala",
		discountPrice: 40,
		mrpPrice: 200,
		unit: "100",
		categorySlug: "wala-garland",
		imageUrl: img("100-Wala-BOX.jpg"),
	},
	{
		name: "200 Wala",
		discountPrice: 80,
		mrpPrice: 400,
		unit: "200",
		categorySlug: "wala-garland",
		imageUrl: img("200-Wala-BOX.jpg"),
	},
	{
		name: "300 Wala",
		discountPrice: 105,
		mrpPrice: 525,
		unit: "300",
		categorySlug: "wala-garland",
		imageUrl: img("300-Wala-BOX.jpg"),
	},
	{
		name: "600 Wala",
		discountPrice: 135,
		mrpPrice: 675,
		unit: "600",
		categorySlug: "wala-garland",
		imageUrl: img("600-Wala-BOX.jpg"),
	},
	{
		name: "1000 Wala",
		discountPrice: 150,
		mrpPrice: 750,
		unit: "1000",
		categorySlug: "wala-garland",
		imageUrl: img("1000-Wala-BOX.jpg"),
	},
	{
		name: "1000 Wala Power",
		discountPrice: 250,
		mrpPrice: 1250,
		unit: "1000",
		categorySlug: "wala-garland",
		imageUrl: img("1000-Wala-Power-BOX.jpg"),
	},
	{
		name: "2000 Wala",
		discountPrice: 520,
		mrpPrice: 2600,
		unit: "2000",
		categorySlug: "wala-garland",
		imageUrl: img("2000-Wala-BOX.jpg"),
	},
	{
		name: "5000 Wala",
		discountPrice: 950,
		mrpPrice: 4750,
		unit: "5000",
		categorySlug: "wala-garland",
		imageUrl: img("5000-Wala-BOX.jpg"),
	},
	{
		name: "5000 Wala Power",
		discountPrice: 1450,
		mrpPrice: 7250,
		unit: "5000",
		categorySlug: "wala-garland",
		imageUrl: img("5000-Wala-Power-BOX.jpg"),
	},
	{
		name: "10000 Wala",
		discountPrice: 1800,
		mrpPrice: 9000,
		unit: "10000",
		categorySlug: "wala-garland",
		imageUrl: img("10000-BOX.jpg"),
	},
	{
		name: "10000 Wala Power",
		discountPrice: 2400,
		mrpPrice: 12000,
		unit: "10000",
		categorySlug: "wala-garland",
		imageUrl: img("10000-Wala-Power-BOX.jpg"),
	},

	// ── SKY NIGHT CELEBRATION ─────────────────────────────
	{
		name: "Chota Pipe Multi Color",
		discountPrice: 45,
		mrpPrice: 225,
		unit: "BOX",
		categorySlug: "sky-night-celebration",
		imageUrl: img("120-Shot-Multi-Color-BOX.jpg"),
	},
	{
		name: "7 Shot",
		discountPrice: 110,
		mrpPrice: 550,
		unit: "BOX",
		categorySlug: "sky-night-celebration",
		imageUrl: img("7-Shot-BOX.jpg"),
	},
	{
		name: "Sky King Multi Color",
		discountPrice: 135,
		mrpPrice: 675,
		unit: "BOX",
		categorySlug: "sky-night-celebration",
		imageUrl: img("Sky-King-Multi-Color-BOX.jpg"),
	},
	{
		name: "Penta Park Multi Color",
		discountPrice: 170,
		mrpPrice: 850,
		unit: "BOX",
		categorySlug: "sky-night-celebration",
		imageUrl: img("Penta-Park-Multi-Color-BOX.jpg"),
	},
	{
		name: "2½ Fancy Pipe",
		discountPrice: 250,
		mrpPrice: 1250,
		unit: "3 pcs",
		categorySlug: "sky-night-celebration",
		imageUrl: img(
			"2-quarterhalfthree-quarter2-Fancy-Pipe-3-Pcs-BOX.jpg-Fancy-Pipe-3-Pcs-BOX.jpg",
		),
	},
	{
		name: "2½ Fancy",
		discountPrice: 120,
		mrpPrice: 600,
		unit: "BOX",
		categorySlug: "sky-night-celebration",
		imageUrl: img("2-quarterhalfthree-quarter2-Fancy-BOX.jpg-Fancy-BOX.jpg"),
	},
	{
		name: "3½ Fancy",
		discountPrice: 220,
		mrpPrice: 1100,
		unit: "BOX",
		categorySlug: "sky-night-celebration",
		imageUrl: img("4-Fancy-BOX.jpg"),
	},
	{
		name: "3½ Fancy Double Ball",
		discountPrice: 370,
		mrpPrice: 1850,
		unit: "BOX",
		categorySlug: "sky-night-celebration",
		imageUrl: img("4-Fancy-BOX.jpg"),
	},
	{
		name: "3½ Fancy Pipe",
		discountPrice: 550,
		mrpPrice: 2750,
		unit: "2 pcs",
		categorySlug: "sky-night-celebration",
		imageUrl: img(
			"2-quarterhalfthree-quarter2-Fancy-Pipe-3-Pcs-BOX.jpg-Fancy-Pipe-3-Pcs-BOX.jpg",
		),
	},
	{
		name: '4" Fancy',
		discountPrice: 280,
		mrpPrice: 1400,
		unit: "BOX",
		categorySlug: "sky-night-celebration",
		imageUrl: img("4-Fancy-BOX.jpg"),
	},
	{
		name: '4" Fancy',
		discountPrice: 650,
		mrpPrice: 3250,
		unit: "2 pcs",
		categorySlug: "sky-night-celebration",
		imageUrl: img("4-Fancy-BOX.jpg"),
	},
	{
		name: "12 Step",
		discountPrice: 330,
		mrpPrice: 1650,
		unit: "BOX",
		categorySlug: "sky-night-celebration",
		imageUrl: img("12-Step-BOX.jpg"),
	},
	{
		name: "12 Shot",
		discountPrice: 180,
		mrpPrice: 900,
		unit: "BOX",
		categorySlug: "sky-night-celebration",
		imageUrl: img("12-Shot-BOX.jpg"),
	},
	{
		name: "30 Peacock Shot",
		discountPrice: 350,
		mrpPrice: 1750,
		unit: "BOX",
		categorySlug: "sky-night-celebration",
		imageUrl: img("30-Peacock-Shot-BOX.jpg"),
	},
	{
		name: "30 Shot Multi Color",
		discountPrice: 380,
		mrpPrice: 1900,
		unit: "BOX",
		categorySlug: "sky-night-celebration",
		imageUrl: img("30-Shot-Multi-Color-BOX.jpg"),
	},
	{
		name: "60 Shot Multi Color",
		discountPrice: 750,
		mrpPrice: 3750,
		unit: "BOX",
		categorySlug: "sky-night-celebration",
		imageUrl: img("60-Shot-Multi-Color-BOX.jpg"),
	},
	{
		name: "120 Shot Multi Color",
		discountPrice: 1450,
		mrpPrice: 7250,
		unit: "BOX",
		categorySlug: "sky-night-celebration",
		imageUrl: img("120-Shot-Multi-Color-BOX.jpg"),
	},
	{
		name: "240 Shot Multi Color",
		discountPrice: 2600,
		mrpPrice: 13000,
		unit: "BOX",
		categorySlug: "sky-night-celebration",
		imageUrl: img("240-Shot-Multi-Color-BOX.jpg"),
	},
	{
		name: "10x10 Sizeling Shot",
		discountPrice: 2700,
		mrpPrice: 13500,
		unit: "BOX",
		categorySlug: "sky-night-celebration",
		imageUrl: img("10x10-Sizeling-Shot-BOX.jpg"),
	},
	{
		name: "10x10 Tail Light",
		discountPrice: 3200,
		mrpPrice: 16000,
		unit: "BOX",
		categorySlug: "sky-night-celebration",
		imageUrl: img("10X10-Tail-Light-BOX.jpg"),
	},
	{
		name: '20x2.5" Thriller Set Grand',
		discountPrice: 3200,
		mrpPrice: 16000,
		unit: "BOX",
		categorySlug: "sky-night-celebration",
		imageUrl: img("20-x-2.5Thriller-Set-Grand-BOX.jpg"),
	},
	{
		name: '32x3.5" Mega Thriller Set',
		discountPrice: 4750,
		mrpPrice: 23750,
		unit: "BOX",
		categorySlug: "sky-night-celebration",
		imageUrl: img("32-x-3.5Mega-Thriller-Set-Grand-BOX.jpg"),
	},

	// ── NIGHT FANCY CELEBRATION ───────────────────────────
	{
		name: "Asrafi",
		discountPrice: 45,
		mrpPrice: 225,
		unit: "BOX",
		categorySlug: "night-fancy-celebration",
		imageUrl: img("Asrafi-BOX.jpg"),
	},
	{
		name: '4" Angry Bird',
		discountPrice: 60,
		mrpPrice: 300,
		unit: "BOX",
		categorySlug: "night-fancy-celebration",
		imageUrl: img("4-Fancy-BOX.jpg"),
	},
	{
		name: "Ganga Jamuna",
		discountPrice: 75,
		mrpPrice: 375,
		unit: "BOX",
		categorySlug: "night-fancy-celebration",
		imageUrl: img("Ganga-Jamuna-BOX.jpg"),
	},
	{
		name: "Photo Flash",
		discountPrice: 65,
		mrpPrice: 325,
		unit: "BOX",
		categorySlug: "night-fancy-celebration",
		imageUrl: img("Asrafi-BOX.jpg"),
	},
	{
		name: "Star Light",
		discountPrice: 70,
		mrpPrice: 350,
		unit: "BOX",
		categorySlug: "night-fancy-celebration",
		imageUrl: img("King-Star-BOX.jpg"),
	},
	{
		name: "Dancing Butterfly",
		discountPrice: 75,
		mrpPrice: 375,
		unit: "BOX",
		categorySlug: "night-fancy-celebration",
		imageUrl: img("Dancing-Butterfly-BOX.jpg"),
	},
	{
		name: "Feather Pop Shower",
		discountPrice: 130,
		mrpPrice: 650,
		unit: "BOX",
		categorySlug: "night-fancy-celebration",
		imageUrl: img("Tin-Beer-Shower-BOX.jpg"),
	},
	{
		name: "Color Rain",
		discountPrice: 125,
		mrpPrice: 625,
		unit: "BOX",
		categorySlug: "night-fancy-celebration",
		imageUrl: img("Tin-Beer-Shower-BOX.jpg"),
	},
	{
		name: '2" Sun Feast Multicolor',
		discountPrice: 140,
		mrpPrice: 700,
		unit: "BOX",
		categorySlug: "night-fancy-celebration",
		imageUrl: img("2-Sun-feast-Multicolor-BOX.jpg"),
	},
	{
		name: "Golden Rise",
		discountPrice: 125,
		mrpPrice: 625,
		unit: "BOX",
		categorySlug: "night-fancy-celebration",
		imageUrl: img("Mega-Siren-BOX.jpg"),
	},
	{
		name: "Mini Siren",
		discountPrice: 135,
		mrpPrice: 675,
		unit: "BOX",
		categorySlug: "night-fancy-celebration",
		imageUrl: img("Mini-Siren-BOX.jpg"),
	},
	{
		name: "Mega Siren",
		discountPrice: 165,
		mrpPrice: 825,
		unit: "BOX",
		categorySlug: "night-fancy-celebration",
		imageUrl: img("Mega-Siren-BOX.jpg"),
	},
	{
		name: "Peacock Fancy",
		discountPrice: 165,
		mrpPrice: 825,
		unit: "BOX",
		categorySlug: "night-fancy-celebration",
		imageUrl: img("Peacock-Fancy-BOX.jpg"),
	},
	{
		name: "Bada Peacock",
		discountPrice: 375,
		mrpPrice: 1875,
		unit: "BOX",
		categorySlug: "night-fancy-celebration",
		imageUrl: img("Bada-Peacock-BOX.jpg"),
	},
	{
		name: "Silky Shower",
		discountPrice: 110,
		mrpPrice: 550,
		unit: "BOX",
		categorySlug: "night-fancy-celebration",
		imageUrl: img("Tin-Beer-Shower-BOX.jpg"),
	},
	{
		name: "Tin Beer Shower",
		discountPrice: 120,
		mrpPrice: 600,
		unit: "BOX",
		categorySlug: "night-fancy-celebration",
		imageUrl: img("Tin-Beer-Shower-BOX.jpg"),
	},
	{
		name: "Star Shown Popcorn",
		discountPrice: 170,
		mrpPrice: 850,
		unit: "BOX",
		categorySlug: "night-fancy-celebration",
		imageUrl: img("King-Star-BOX.jpg"),
	},
	{
		name: "Apple Shower",
		discountPrice: 180,
		mrpPrice: 900,
		unit: "BOX",
		categorySlug: "night-fancy-celebration",
		imageUrl: img("Tin-Beer-Shower-BOX.jpg"),
	},
	{
		name: '3" Red Sun Shower',
		discountPrice: 210,
		mrpPrice: 1050,
		unit: "BOX",
		categorySlug: "night-fancy-celebration",
		imageUrl: img("3-Red-Sun-Shower-BOX.jpg"),
	},
	{
		name: "Smoke Fountain Celebration",
		discountPrice: 220,
		mrpPrice: 1100,
		unit: "BOX",
		categorySlug: "night-fancy-celebration",
		imageUrl: img("Mega-Siren-BOX.jpg"),
	},
	{
		name: "Bambara Spinner",
		discountPrice: 135,
		mrpPrice: 675,
		unit: "BOX",
		categorySlug: "night-fancy-celebration",
		imageUrl: img("Bambara-Spinner-BOX.jpg"),
	},
	{
		name: "Tim Tom",
		discountPrice: 85,
		mrpPrice: 425,
		unit: "BOX",
		categorySlug: "night-fancy-celebration",
		imageUrl: img("Kit-Kat-BOX.jpg"),
	},
	{
		name: "Kit Kat",
		discountPrice: 30,
		mrpPrice: 150,
		unit: "BOX",
		categorySlug: "night-fancy-celebration",
		imageUrl: img("Kit-Kat-BOX.jpg"),
	},
	{
		name: "Zee Boom Baa",
		discountPrice: 15,
		mrpPrice: 75,
		unit: "BOX",
		categorySlug: "night-fancy-celebration",
		imageUrl: img("Zee-Boom-Baa-BOX.jpg"),
	},
	{
		name: "Electric Stone",
		discountPrice: 15,
		mrpPrice: 75,
		unit: "BOX",
		categorySlug: "night-fancy-celebration",
		imageUrl: img("Electric-Stone-BOX.jpg"),
	},

	// ── FANCY FLOWER BALLS ────────────────────────────────
	{
		name: "Chun Mun Barrels",
		discountPrice: 195,
		mrpPrice: 975,
		unit: "BOX",
		categorySlug: "fancy-flower-balls",
		imageUrl: img("Chun-Mun-Barrels-BOX.jpg"),
	},
	{
		name: "Two in One",
		discountPrice: 450,
		mrpPrice: 2250,
		unit: "BOX",
		categorySlug: "fancy-flower-balls",
		imageUrl: img("Chun-Mun-Barrels-BOX.jpg"),
	},
	{
		name: "Mega Deluxe",
		discountPrice: 550,
		mrpPrice: 2750,
		unit: "BOX",
		categorySlug: "fancy-flower-balls",
		imageUrl: img("Mega-Deluxe-BOX.jpg"),
	},

	// ── COLOR MATCHES ─────────────────────────────────────
	{
		name: "Royal Deluxe Matches",
		discountPrice: 80,
		mrpPrice: 400,
		unit: "BOX",
		categorySlug: "color-matches",
		imageUrl: img("Royal-Deluxe-Matches-BOX.jpg"),
	},
	{
		name: "Royal Lamba Matches",
		discountPrice: 160,
		mrpPrice: 800,
		unit: "BOX",
		categorySlug: "color-matches",
		imageUrl: img("Royal-Lamba-Matches-BOX.jpg"),
	},
	{
		name: "Mega Laptop Matches",
		discountPrice: 250,
		mrpPrice: 1250,
		unit: "BOX",
		categorySlug: "color-matches",
		imageUrl: img("Mega-Laptop-Matches-BOX.jpg"),
	},

	// ── CHILDREN GUN ITEMS ────────────────────────────────
	{
		name: "Roll Cap",
		discountPrice: 80,
		mrpPrice: 400,
		unit: "BOX",
		categorySlug: "children-gun-items",
		imageUrl: img("Roll-Cap-BOX.jpg"),
	},
	{
		name: "Snake Tablet",
		discountPrice: 35,
		mrpPrice: 175,
		unit: "BOX",
		categorySlug: "children-gun-items",
		imageUrl: img("Snake-Tablet-BOX.jpg"),
	},
	{
		name: "Small Size Gun",
		discountPrice: 50,
		mrpPrice: 250,
		unit: "BOX",
		categorySlug: "children-gun-items",
		imageUrl: img("Roll-Cap-BOX.jpg"),
	},
	{
		name: "Mega Gun",
		discountPrice: 100,
		mrpPrice: 500,
		unit: "BOX",
		categorySlug: "children-gun-items",
		imageUrl: img("Roll-Cap-BOX.jpg"),
	},

	// ── NEW ARRIVALS ──────────────────────────────────────
	{
		name: "King Star",
		discountPrice: 295,
		mrpPrice: 1475,
		unit: "BOX",
		categorySlug: "new-arrivals",
		imageUrl: img("King-Star-BOX.jpg"),
	},
	{
		name: "Old is Gold",
		discountPrice: 190,
		mrpPrice: 950,
		unit: "PKT",
		categorySlug: "new-arrivals",
		imageUrl: img("Old-is-Gold-PKT.jpg"),
	},
	{
		name: "Star Wheel",
		discountPrice: 175,
		mrpPrice: 875,
		unit: "PKT",
		categorySlug: "new-arrivals",
		imageUrl: img("Whistling-Wheel-5-Pcs-BOX.jpg"),
	},
	{
		name: "Water Queen Falls",
		discountPrice: 190,
		mrpPrice: 950,
		unit: "PKT",
		categorySlug: "new-arrivals",
		imageUrl: img("Water-Queen-Falls-PKT.jpg"),
	},
	{
		name: "Top Gun Fancy",
		discountPrice: 210,
		mrpPrice: 1050,
		unit: "PKT",
		categorySlug: "new-arrivals",
		imageUrl: img("Roll-Cap-BOX.jpg"),
	},
	{
		name: "Moon Light",
		discountPrice: 70,
		mrpPrice: 350,
		unit: "BOX",
		categorySlug: "new-arrivals",
		imageUrl: img("King-Star-BOX.jpg"),
	},
	{
		name: "Helicopter",
		discountPrice: 130,
		mrpPrice: 650,
		unit: "BOX",
		categorySlug: "new-arrivals",
		imageUrl: img("Lunic-Rocket-BOX.jpg"),
	},

	// ── NEW ARRIVALS 2026 ─────────────────────────────────
	{
		name: "Fun Zone Crackling",
		discountPrice: 370,
		mrpPrice: 1850,
		unit: "5 pcs",
		categorySlug: "new-arrivals-2026",
		imageUrl: img("Fun-Zone-Crackling-5Pcs-BOX.jpg"),
	},
	{
		name: "Rotating Sparklers",
		discountPrice: 150,
		mrpPrice: 750,
		unit: "BOX",
		categorySlug: "new-arrivals-2026",
		imageUrl: img("Rotating-Sparklers-BOX.jpg"),
	},
	{
		name: "Magic Whip",
		discountPrice: 145,
		mrpPrice: 725,
		unit: "BOX",
		categorySlug: "new-arrivals-2026",
		imageUrl: img("Magic-whip-BOX.jpg"),
	},
	{
		name: "Star World",
		discountPrice: 160,
		mrpPrice: 800,
		unit: "5 pcs",
		categorySlug: "new-arrivals-2026",
		imageUrl: img("Whistling-Wheel-5-Pcs-BOX.jpg"),
	},
	{
		name: '4" Pipe Golden Eye',
		discountPrice: 370,
		mrpPrice: 1850,
		unit: "BOX",
		categorySlug: "new-arrivals-2026",
		imageUrl: img("4-Pipe-Golden-Eye-BOX.jpg"),
	},
	{
		name: '4" Pipe Wow Purple',
		discountPrice: 370,
		mrpPrice: 1850,
		unit: "BOX",
		categorySlug: "new-arrivals-2026",
		imageUrl: img("4-Pipe-Wow-Purple-BOX.jpg"),
	},
	{
		name: '4" Pipe Wow Orange',
		discountPrice: 370,
		mrpPrice: 1850,
		unit: "BOX",
		categorySlug: "new-arrivals-2026",
		imageUrl: img("4-Pipe-Wow-Purple-BOX.jpg"),
	},
	{
		name: "30 Flash Color Shot",
		discountPrice: 420,
		mrpPrice: 2100,
		unit: "BOX",
		categorySlug: "new-arrivals-2026",
		imageUrl: img("30-Shot-Multi-Color-BOX.jpg"),
	},
	{
		name: "30 Crack Jack Color Shot",
		discountPrice: 480,
		mrpPrice: 2400,
		unit: "BOX",
		categorySlug: "new-arrivals-2026",
		imageUrl: img("30-Shot-Multi-Color-BOX.jpg"),
	},
	{
		name: "Blast Gun Pistol 5G",
		discountPrice: 210,
		mrpPrice: 1050,
		unit: "BOX",
		categorySlug: "new-arrivals-2026",
		imageUrl: img("Roll-Cap-BOX.jpg"),
	},

	// ── COMBO PACK ────────────────────────────────────────
	{
		name: "3000 Combo Pack",
		discountPrice: 3000,
		mrpPrice: 3000,
		unit: "Case",
		categorySlug: "combo-pack",
		imageUrl: img("1000-Wala-Power-BOX.jpg"),
	},
	{
		name: "5000 Family Pack",
		discountPrice: 5000,
		mrpPrice: 5000,
		unit: "Case",
		categorySlug: "combo-pack",
		imageUrl: img("5000-Wala-Power-BOX.jpg"),
	},
	{
		name: "7000 Thala Diwali Pack",
		discountPrice: 7000,
		mrpPrice: 7000,
		unit: "Case",
		categorySlug: "combo-pack",
		imageUrl: img("10000-Wala-Power-BOX.jpg"),
	},
];

async function seedProducts() {
	const [existing] = await db.select().from(product).limit(1);
	if (existing) {
		console.log("✓ Products already exist, skipping");
		return;
	}

	const categories = await db.select().from(category);
	const categoryIdBySlug = new Map(categories.map((c) => [c.slug, c.id]));

	const sortOrderByCategory = new Map<string, number>();
	let nextCode = 1;
	const rows: (typeof product.$inferInsert)[] = [];

	for (const raw of PRODUCT_SEED) {
		const categoryId = categoryIdBySlug.get(raw.categorySlug);
		if (!categoryId) {
			console.warn(
				`⚠ Skipping "${raw.name}" — category "${raw.categorySlug}" not found`,
			);
			continue;
		}

		const sortOrder = sortOrderByCategory.get(raw.categorySlug) ?? 0;
		sortOrderByCategory.set(raw.categorySlug, sortOrder + 1);

		rows.push({
			categoryId,
			// inside seedProducts(), where rows are built:
			code: String(nextCode++), // was: code: nextCode++,
			name: raw.name,
			unit: raw.unit,
			imageUrl: raw.imageUrl,
			mrpPrice: raw.mrpPrice.toFixed(2),
			discountPrice: raw.discountPrice.toFixed(2),
			sortOrder,
			isActive: true,
		});
	}

	let totalInserted = 0;
	const batchSize = 50;
	for (let i = 0; i < rows.length; i += batchSize) {
		const batch = rows.slice(i, i + batchSize);
		const inserted = await db
			.insert(product)
			.values(batch)
			.onConflictDoNothing()
			.returning();
		totalInserted += inserted.length;
	}

	console.log(
		`✓ Seeded ${totalInserted} products (out of ${PRODUCT_SEED.length} in catalog)`,
	);
}

// ── Run ──────────────────────────────────────────────────────
async function main() {
	await seedSettings();
	await seedBankAccounts();
	await seedCategories();
	await seedProducts();
	await seedAdmin();
	process.exit(0);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
