/** @type {import('next').NextConfig} */
const nextConfig = {
	reactCompiler: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "yzbzcvyyrbwqdrgaetma.supabase.co",
				pathname: "/storage/v1/object/public/**",
			},
		],
	},
};

module.exports = nextConfig;
