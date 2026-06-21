/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "*.ufs.sh", // UploadThing's current per-app CDN domain
				pathname: "/f/**",
			},
			{
				protocol: "https",
				hostname: "utfs.io", // legacy UploadThing domain, still served, just in case
				pathname: "/f/**",
			},
		],
	},
};

export default config;
