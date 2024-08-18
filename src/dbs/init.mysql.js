import knex from "knex";
import knexfile from "../../knexfile";

const environment = process.env.NODE_ENV || "development";

console.log(knexfile[environment]);

export default knex(knexfile[environment]);
