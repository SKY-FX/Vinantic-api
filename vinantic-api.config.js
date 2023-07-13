module.exports = {
  apps: [
    {
      name: 'vinantic-api',
      script: 'index.js',
      cwd: '/root/workspace/vinantic-api/src',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      env: {
        MYSQL_HOST:'srv1016.hstgr.io',
		MYSQL_USER:'u908793191_Vinantic',
		MYSQL_PASSWORD:'Tatiom@00',
		MYSQL_DATABASE:'u908793191_DB_Vinantic',
        APOLLO_SERVER_PORT:4000,
      },
    },
  ],
};
