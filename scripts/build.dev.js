const esbuild = require('esbuild');
const nodemon = require('nodemon');
const path = require('path');

const esbuildConfig = {
    entryPoints: ['./src/playground.ts'],
    outfile: './dist/index.js',
    sourcemap: true,
    packages: 'external',
    platform: 'node',
    bundle: true,
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
