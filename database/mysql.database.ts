import { Client } from "https://deno.land/x/mysql/mod.ts";

/** class to connect to mysql instance */
class MySqlConnector {
  /* instantiating mysql client */
  client = new Client();
  constructor() {
    /** 
         * call @connector once while initializing class 
         * we could directly use client in the constructor, but we need that damn await
         * */
    this.connector();
  }
  private async connector(): Promise<void> {
    /**
     * here we appended client with this, because we want it to be the @MysqlConnector class property instead of connector variable
     * ps - you can visit [https://deno.land/x/mysql] to check how to connect to mysql
     * for additional detail and also if you dont want to use class based approach
     */
    /* pass mysql credentials */
    await this.client.connect({
      hostname: "127.0.0.1",
      username: "root",
      db: "dbname",
      password: "password",
    });
  }
}

export default new MySqlConnector().client;
