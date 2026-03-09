const sql = require('mssql');

module.exports = async function (context, req) {
    // use the newer authentication structure to avoid any protocol parsing issues
    const config = {
        server: process.env.SQL_SERVER,
        database: process.env.SQL_DB,
        port: 1433,
        authentication: {
            type: 'default',
            options: {
                userName: process.env.SQL_USER,
                password: process.env.SQL_PWD
            }
        },
        options: {
            encrypt: true,
            trustServerCertificate: false // for Azure SQL this should be false
        }
    };

    try {
        context.log('Conectando con config', config.server, config.database);
        await sql.connect(config);
        context.log('Conexión establecida, ejecutando consulta');
        const result = await sql.query`SELECT * FROM empresas`;
        context.log('Consulta ejecutada, filas:', result.recordset.length);
        context.res = {
            headers: { 'Content-Type': 'application/json' },
            body: result.recordset || []
        };
    } catch (err) {
        context.log.error('Error en la función GetEmpresas:', err);
        context.res = {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
            body: { error: 'Error al consultar la BBDD', details: err.message }
        };
    }
};