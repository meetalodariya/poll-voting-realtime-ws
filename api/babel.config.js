module.exports = {
  presets: ['@babel/preset-env'],
  plugins: [
    [
      'transform-runtime',
      {
        regenerator: true,
      },
    ],
  ],
};
