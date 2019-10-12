module.exports = {
    gameName: 'GalacticShooter',
    // mode: 'development', // Uncomment for development.
    mode: 'production', // Uncomment for production.
    gameDir: `./src`, // Game directory.
    // Output settings.
    terserOutput: {
        comments: false,
        quote_keys: false,
        keep_quoted_props: false,
    },
    // Mangling settings.
    mangle: {
        keep_fnames: false,
        keep_classnames: false,
        toplevel: true,
        safari10: true,
    },
    // Compression settings.
    compress: {
        arguments: false,
        collapse_vars: true,
        conditionals: false,
        arrows: false,
        unsafe_arrows: false,
        loops: true,
        toplevel: true,
        reduce_funcs: true,
        reduce_vars: true,
        join_vars: true,
        // drop_console: false // Uncomment for development.
        drop_console: true // Uncomment for production.
    }
}