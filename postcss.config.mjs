const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    // 自动添加浏览器前缀
    autoprefixer: {},
    // 生产环境压缩 CSS
    ...(process.env.NODE_ENV === "production" && {
      cssnano: {
        preset: "default",
      },
    }),
  },
};

export default config;
