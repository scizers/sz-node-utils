import table, { TableFilterQuery as tx, TableFilterQueryWithAggregate as tagx } from './utils/table.js'
import { handleMediaUpload as hmu, handleSingleMediaUpload as hsmu, handleMediaResponse as hmr } from './utils/utils.js'
import { TORMQuery } from './utils/typeORM'

export const TableFilterQuery = tx
export const TableFilterQueryWithAggregate = tagx
export const handleMediaUpload = hmu
export const handleSingleMediaUpload = hsmu
export const handleMediaResponse = hmr
export const TORMQuery

export default {
  TORMQuery,
  table,
  TableFilterQuery,
  TableFilterQueryWithAggregate,
  handleMediaUpload,
  handleSingleMediaUpload,
  handleMediaResponse,
}
