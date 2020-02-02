// @ts-nocheck

const _ = require('lodash')

export const TORMQuery = (parmas) => { // @ts-ignore
  const {metaData, columnName, tableName, val} = parmas
  let table = _.find(metaData.columns, x => x.databaseName === columnName)
  let columnType = null
  if (table && table.type) {
    if (typeof table.type == "string") {
      columnType = table.type;
    } else {
      columnType = functionName(table.type)
      columnType = columnType.toLowerCase()
    }
  }

  let a = ""
  let b = {}

  let valueWord = val[0]
  if (val.length == 1) {
    switch (columnType) {
      case 'exact': {
        a = `${tableName}.${columnName} = :${columnName}`
        b = {[columnName]: valueWord}
        break;
      }

      case 'float': {
        a = `${tableName}.${columnName} = :${columnName}`
        b = {[columnName]: parseFloat(valueWord)}
        break;

      }
      case 'number': {
        a = `${tableName}.${columnName} = :${columnName}`
        b = {[columnName]: parseInt(valueWord)}
        break;
      }
      case 'varchar':
      case 'string': {
        a = `${tableName}.${columnName} like :${columnName}`
        b = {[columnName]: `%${valueWord}%`}
        break;
      }

      default : {
        a = null
        b = null
      }
    }

  }
  if (val.length > 1) {
    switch (columnType) {
      case 'number':
      case 'varchar':
      case 'exact':
      case 'string': {
        a = `${tableName}.${columnName} IN (:${columnName})`
        b = {[columnName]: val}
        break;
      }

      case 'datetime': {

        if (!isJson(val)) {
          break;
        }

        let val2 = JSON.parse(val)
        let start = val2['$gte']
        let end = val2['$lt']

        a = `${tableName}.${columnName} BETWEEN :begin AND :end`
        b = {
          begin: `${start}`,
          end: `${end}`
        }
        break;
      }

      default : {
        a = null
        b = null
      }
    }

  }

  return {a, b}
}

const functionName = (fun) => { // @ts-ignore
  var ret = fun.toString();
  ret = ret.substr('function '.length);
  ret = ret.substr(0, ret.indexOf('('));
  return ret;
}

const isJson = (str) => {  // @ts-ignore
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export default TORMQuery
