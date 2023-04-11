const esbuild = require('esbuild');
const nodemon = require('nodemon');
const path = require('path');
const {TsconfigPathsPlugin} = require('@esbuild-plugins/tsconfig-paths');

const esbuildConfig = {
    tsconfig: './tsconfig.json',
    entryPoints: ['./src/playground.ts'],
    packages: 'external',
    platform: 'node',
    target: 'node14',
    outfile: 'dist/index.js',
    bundle: true,
    plugins: [TsconfigPathsPlugin({tsconfig: './tsconfig.json'})],
};

const nodemonConfig = {
    script: path.resolve(__dirname, '..', 'dist', 'index.js'),
    watch: path.resolve(__dirname, '..', 'dist'),
};

async function watch(esbuildConfig, nodemonConfig) {
    const ctx = await esbuild.context(esbuildConfig);
    await ctx.watch();

    nodemon(nodemonConfig);
}

watch(esbuildConfig, nodemonConfig);
