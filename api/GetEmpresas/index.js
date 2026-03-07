const sql = require('mssql');

module.exports = async function (context, req) {
    const config = {
        server: process.env.SQL_SERVER,
        database: process.env.SQL_DB,
        user: process.env.SQL_USER,
        password: process.env.SQL_PWD,
        options: { encrypt: true }
    };

    try {
        await sql.connect(config);
        const result = await sql.query`SELECT * FROM empresas`;
        context.res = {
            headers: { 'Content-Type': 'application/json' },
            body: result.recordset
        };
    } catch (err) {
        context.log.error(err);
        context.res = { status: 500, body: "Error al consultar la BBDD" };
    }
};