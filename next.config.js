/** @type {import('next').NextConfig} */
module.exports = {
    eslint: {
        dirs: ["src"],
    },

    experimental: {
        outputStandalone: true,
    },

    async rewrites() {
        const domain = process.env.NEXTJS_API_HOST || "localhost";
        const port = process.env.NEXTJS_API_PORT || 5228;
        const apiRewrite = {
            source: "/api/:path*",
            destination: `http://${domain}:${port}/:path*`,
        };

        return [apiRewrite];
    },

    reactStrictMode: true,

    // Uncoment to add domain whitelist
    // images: {
    //   domains: [
    //     'res.cloudinary.com',
    //   ],
    // },

    // SVGR
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: [
                {
                    loader: "@svgr/webpack",
                    options: {
                        typescript: true,
                        icon: true,
                    },
                },
            ],
        });

        return config;
    },
};
