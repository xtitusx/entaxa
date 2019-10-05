const commonConfig = {
    request: {
        httpContext: 'requestUid',
    },
    server: {
        defaultPort: 3000,
        socketTimeout: 720 * 1000,
    },
    bodyParserLimit: '50mb',
};

export default commonConfig;
