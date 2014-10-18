exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    capabilities: {
        'browserName': 'chrome'
    },
    allScriptsTimeout: 500000,
    specs: ['app/scripts/tests/*.js']
};
