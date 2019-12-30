const commonConfig = {
    request: {
        httpContext: 'requestUid',
    },
    server: {
        defaultPort: 3000,
        socketTimeout: 720 * 1000,
    },
    dbClientCache: {
        enableCleaning: true,
        duration: 60, // minutes
    },
    bodyParserLimit: '50mb',
    viewMinimizer: {
        // Configuration des vues
        enabled: true,
        allowNullable: false,
        allowEmptyObject: false,
        allowEmptyArray: false,
    },
};

export default commonConfig;
