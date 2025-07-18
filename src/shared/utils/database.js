/**
 * @author Valkream Team
 * @license MIT - https://opensource.org/licenses/MIT
 */

const { NodeBDD, DataType } = require("node-bdd");
const nodedatabase = new NodeBDD();
const { ipcRenderer } = require("electron");
const path = require("path");

const dev = process.env.NODE_ENV === "development";

class database {
  async creatDatabase(tableName, tableConfig) {
    return await nodedatabase.intilize({
      databaseName: "Databases",
      fileType: dev ? "sqlite" : "db",
      tableName: tableName,
      path: path.join(await ipcRenderer.invoke("path-user-data"), "/databases"),
      tableColumns: tableConfig,
    });
  }

  async getDatabase(tableName) {
    return await this.creatDatabase(tableName, {
      json_data: DataType.TEXT.TEXT,
    });
  }

  async createData(tableName, data) {
    let table = await this.getDatabase(tableName);
    data = await nodedatabase.createData(table, {
      json_data: JSON.stringify(data),
    });
    let id = data.id;
    data = JSON.parse(data.json_data);
    data.ID = id;
    return data;
  }

  async readData(tableName, key = 1) {
    let table = await this.getDatabase(tableName);
    let data = await nodedatabase.getDataById(table, key);
    if (data) {
      let id = data.id;
      data = JSON.parse(data.json_data);
      data.ID = id;
    }
    return data ? data : undefined;
  }

  async readAllData(tableName) {
    let table = await this.getDatabase(tableName);
    let data = await nodedatabase.getAllData(table);
    return data.map((info) => {
      let id = info.id;
      info = JSON.parse(info.json_data);
      info.ID = id;
      return info;
    });
  }

  async updateData(tableName, data, key = 1) {
    let table = await this.getDatabase(tableName);
    await nodedatabase.updateData(
      table,
      { json_data: JSON.stringify(data) },
      key
    );
  }

  async deleteData(tableName, key = 1) {
    let table = await this.getDatabase(tableName);
    await nodedatabase.deleteData(table, key);
  }
}

module.exports = database;
