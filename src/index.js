import table, {TableFilterQuery as tx} from './utils/table.js'
import {handleMediaUpload as hmu, handleSingleMediaUpload as hsmu , handleMediaResponse as hmr} from './utils/utils.js'

export const TableFilterQuery = tx
export const handleMediaUpload = hmu
export const handleSingleMediaUpload = hsmu
export const handleMediaResponse = hmr

export default {
    table,
    TableFilterQuery,
    handleMediaUpload,
    handleSingleMediaUpload,
    handleMediaResponse
}
