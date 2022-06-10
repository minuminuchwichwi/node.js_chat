module.exports = 
{
    user : process.env.NODEORACLEDB_USER || "c##chat",
    password : process.env.NODEORACLEDB_PASSWORD || "minwoo0722",
    connectString : process.env.NODEORACLEDB_CONNECTIONSTRING || "orcl"
}