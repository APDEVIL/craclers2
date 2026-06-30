interface DiyaWatermarkProps {
	className?: string;
}

const PETAL_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];
const SUNBURST_ANGLES = [
	-90, -80, -70, -60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60, 70,
	80, 90,
];

/**
 * Decorative, high-fidelity modern diya watermark.
 * Features a dynamic overlapping flame design and a faint mandala background.
 * aria-hidden and pointer-events-none ensure it remains purely decorative.
 */
export function DiyaWatermark({ className }: DiyaWatermarkProps) {
	return (
		<svg
			aria-hidden="true"
			className={className}
			fill="none"
			style={{ pointerEvents: "none" }}
			viewBox="0 0 540 540"
			xmlns="http://www.w3.org/2000/svg"
		>
			<defs>
				{/* Perfect teardrop/leaf path used for all flame elements */}
				<path
					d="M 0 -50 Q 30 -10 30 20 A 30 30 0 0 1 -30 20 Q -30 -10 0 -50 Z"
					id="flame-drop"
				/>

				{/* Mask for the base patterns */}
				<clipPath id="bowl-clip">
					<path d="M 120 300 A 150 150 0 0 0 420 300 Z" />
				</clipPath>

				{/* Soft glow/shadow for the base */}
				<filter height="140%" id="base-shadow" width="140%" x="-20%" y="-20%">
					<feDropShadow
						dx="0"
						dy="12"
						floodColor="#89207D"
						floodOpacity="0.25"
						stdDeviation="15"
					/>
				</filter>
			</defs>

			{/* =========================================
                1. FAINT BACKGROUND MANDALA
            ========================================= */}
			<g
				fill="none"
				stroke="#F8E1E8"
				strokeWidth="1.5"
				transform="translate(160, 260)"
			>
				{/* Concentric rings */}
				<circle
					cx="0"
					cy="0"
					r="220"
					strokeDasharray="3 8"
					strokeLinecap="round"
					strokeWidth="2"
				/>
				<circle cx="0" cy="0" r="190" />
				<circle cx="0" cy="0" r="170" strokeDasharray="8 8" />

				{/* Programmatic flower petals */}
				{PETAL_ANGLES.map((angle) => (
					<g key={`petal-${angle}`} transform={`rotate(${angle})`}>
						<path d="M 0 -170 Q 20 -195 0 -220 Q -20 -195 0 -170" />
						<path d="M 0 -60 Q 40 -115 0 -170 Q -40 -115 0 -60" />
					</g>
				))}

				{/* Decorative paisley swooshes */}
				<path d="M 60 -180 C 180 -120 180 80 220 140" />
				<path d="M -60 -180 C -180 -120 -180 80 -220 140" />
			</g>

			{/* =========================================
                2. MAIN DIYA BOWL (BASE)
            ========================================= */}
			<g transform="translate(0, 0)">
				{/* Deep purple base with drop shadow */}
				<path
					d="M 120 300 A 150 150 0 0 0 420 300 Z"
					fill="#5F1668"
					filter="url(#base-shadow)"
				/>

				{/* Geometric inner patterns (clipped to the semi-circle) */}
				<g clipPath="url(#bowl-clip)">
					{/* Concentric arcs */}
					<circle
						cx="270"
						cy="300"
						fill="none"
						r="125"
						stroke="#370733"
						strokeWidth="16"
					/>
					<circle
						cx="270"
						cy="300"
						fill="none"
						r="95"
						stroke="#89207D"
						strokeWidth="12"
					/>

					{/* Dotted accent ring */}
					<circle
						cx="270"
						cy="300"
						fill="none"
						r="75"
						stroke="#E599D6"
						strokeDasharray="1 9"
						strokeLinecap="round"
						strokeWidth="4"
					/>

					<circle
						cx="270"
						cy="300"
						fill="none"
						r="50"
						stroke="#370733"
						strokeWidth="14"
					/>
					<circle
						cx="270"
						cy="300"
						fill="none"
						r="25"
						stroke="#89207D"
						strokeWidth="10"
					/>

					{/* Sunburst radial lines - Fixed array index key issue */}
					{SUNBURST_ANGLES.map((angle) => (
						<line
							key={`ray-${angle}`}
							stroke="#480A44"
							strokeWidth="3"
							transform={`rotate(${angle} 270 300)`}
							x1="270"
							x2="270"
							y1="300"
							y2="450"
						/>
					))}
				</g>
			</g>

			{/* =========================================
                3. OVERLAPPING MULTICOLOR FLAMES
            ========================================= */}
			<g>
				{/* Main Yellow/Orange Drop */}
				<g transform="translate(270, 230) rotate(20) scale(2)">
					<use
						fill="#FFAD05"
						href="#flame-drop"
						opacity="0.95"
						style={{ mixBlendMode: "multiply" }}
					/>
				</g>

				{/* Bottom Left Green Leaf */}
				<g transform="translate(195, 255) rotate(-35) scale(1.4)">
					<use
						fill="#008264"
						href="#flame-drop"
						style={{ mixBlendMode: "multiply" }}
					/>
				</g>

				{/* Right Side Hot Pink Drop */}
				<g transform="translate(345, 220) rotate(35) scale(1.15)">
					<use
						fill="#EF2368"
						href="#flame-drop"
						style={{ mixBlendMode: "multiply" }}
					/>
				</g>

				{/* Top Floating Dark Green Drop (No Multiply Blend) */}
				<g transform="translate(315, 85) rotate(12) scale(0.65)">
					<use fill="#006855" href="#flame-drop" />
				</g>

				{/* Top Tiny Floating Pink Drop */}
				<g transform="translate(265, 50) rotate(-8) scale(0.35)">
					<use fill="#EF2368" href="#flame-drop" />
				</g>
			</g>
		</svg>
	);
}
