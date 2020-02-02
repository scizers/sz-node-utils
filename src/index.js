import table, { TableFilterQuery as tx, TableFilterQueryWithAggregate as tagx } from './utils/table.js'
import { handleMediaUpload as hmu, handleSingleMediaUpload as hsmu, handleMediaResponse as hmr } from './utils/utils.js'
import { TORMQuery as tmr } from './utils/typeORM'

export const TableFilterQuery = tx
export const TableFilterQueryWithAggregate = tagx
export const handleMediaUpload = hmu
export const handleSingleMediaUpload = hsmu
export const handleMediaResponse = hmr
export const TORMQuery = tmr

export default {
  TORMQuery,
  table,
  TableFilterQuery,
  TableFilterQueryWithAggregate,
  handleMediaUpload,
  handleSingleMediaUpload,
  handleMediaResponse,
}
