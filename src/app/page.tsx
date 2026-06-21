import { HeroCarousel } from "@/app/_components/home/hero-carousel";
import { LeadCaptureDialog } from "@/app/_components/home/lead-capture-dialog";
import { ProductCategoryGrid } from "@/app/_components/home/product-categroy-grid";
import { WhyChooseUs } from "@/app/_components/home/why-choose-us";

export default function HomePage() {
	return (
		<>
			<HeroCarousel />
			<ProductCategoryGrid />
			<WhyChooseUs />
			<LeadCaptureDialog />
		</>
	);
}
