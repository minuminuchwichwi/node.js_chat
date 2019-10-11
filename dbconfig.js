module.exports = 
{
    user : process.env.NODEORACLEDB_USER || "c##chat",
    password : process.env.NODEORACLEDB_PASSWORD || '1234',
    connectString : process.env.NODEORACLEDB_CONNECTIONSTRING || "localhost:1521/orcl"
}