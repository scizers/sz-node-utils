import _ from "lodash";
import async from "async";
import moment from "moment";
import {errorObj, successObj} from './settings'

const utils = {
    removeExtraTableParams: (obj) => {
        let x = Object.assign({}, obj)
        delete x.results
        delete x.page
        delete x.count
        delete x.sortField
        delete x.sortOrder
        delete x.selectors
        delete x.select
        delete x.regExFilters
        delete x.populateArr
        delete x.project
        delete x.dateFilter

        return x
    },
    runTableDataQuery: (model, options) => {
        return new Promise((resolve) => {

            let {results, page, sortField, sortOrder, selectors} = options;
            let filters = utils.removeExtraTableParams(options);

            let query = model.find({});
            let countQuery = model.count();

            _.each(filters, (val, key) => {
                if (val.length && typeof val === 'object') {
                    if (val.length === 1) {
                        _.each(val, (item) => {
                            query.where({[key]: new RegExp(item, 'ig')})
                            countQuery.where({[key]: new RegExp(item, 'ig')})
                        })
                    } else {
                        query.where({[key]: {$in: val}})
                        countQuery.where({[key]: {$in: val}})
                    }
                }
            });

            // selectors

            if (results) {
                query.limit(results)
                query.skip((page - 1) * results);
            }
            if (sortField) query.sort({[sortField]: sortOrder === "ascend" ? 'asc' : 'desc'});

            query.exec((err, data) => {
                countQuery.exec((er, count) => {
                    resolve({data, count})
                })
            })
        })
    }
}

function isJson (str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

export const TableFilterQuery = (Model, Params) => {
    return new Promise((resolve) => {

        let {results = 10, page = 1, sortField, sortOrder, regExFilters = [], select, populateArr,} = Params

        let populateArrFilters = []


        let filter = utils.removeExtraTableParams(Params);

        let {dateFilter} = Params;

        results = parseInt(results)
        page = parseInt(page)

        let query = Model.find({}, {});
        let countQuery = Model.count({});


        if (populateArr) {
            _.each(populateArr, (val, key) => {
                /* console.log(val)

                 let x = val.path
                 if (filter && filter[val.path]) {
                     val.match = {[val.select]: new RegExp(filter[val.path][0], 'ig')}
                     delete filter[val.path]
                 }

                 console.log(val)*/
                query.populate(val);
            })
        }

        if (filter) {
            _.each(filter, (val, key) => {

                if (isJson(val)) {
                    val = JSON.parse(val)
                    query.where({[key]: val});
                    countQuery.where({[key]: val});
                } else {
                    if (val !== undefined) {
                        let valueWord = val;
                        if (regExFilters.includes(key)) {
                            valueWord = new RegExp(val, 'ig')
                        }
                        query.where({[key]: valueWord});
                        countQuery.where({[key]: valueWord});
                    }
                }


            })
        }

        if (dateFilter) {
            dateFilter = JSON.parse(dateFilter);


            if (dateFilter.from && dateFilter.to) {
                query.where({[dateFilter.key]: {$gte: moment(dateFilter.from).startOf('day')}})
                query.where({[dateFilter.key]: {$lte: moment(dateFilter.to).endOf('day')}})
            }

        }


        if (select) {
            query.select(select)
        }
        if (sortField) {

            let order = sortOrder === 'ascend' ? 'asc' : 'desc'

            query.sort({[sortField]: order});
        }

        query.skip((page - 1) * results).limit(results)
        query.lean().exec((err, data) => {
            //console.log(err)
            if (err) {
                return resolve({...errorObj})

            } else {
                countQuery.exec((err, result) => {
                    // console.log(data[3])
                    resolve({data: data, total: result, ...successObj});
                })
            }
        })

    })
}
export const TableFilterQueryWithAggregate = (Model, fieldName, Params) => {
    return new Promise((resolve) => {

        let {count = 10, page = 1, sortField, sortOrder, regExFilters = [], project, populateArr} = Params

        let filter = utils.removeExtraTableParams(Params);


        count = parseInt(count)
        page = parseInt(page)


        let matchArr = [];


        let query = Model.aggregate([{$unwind: `$` + `${fieldName}`}, {$project: project}])

        let countQuery = Model.aggregate([{$unwind: `$` + `${fieldName}`}]);


        if (filter) {
            _.each(filter, (val, key) => {
                if (val !== undefined) {
                    let valueWord = val;

                    if (regExFilters.includes(key)) {
                        valueWord = new RegExp(val, 'ig')
                    }


                    key = `${fieldName}.` + key;

                    matchArr.push({[key]: valueWord})

                }


            })
        }

        if (matchArr.length) {
            query.match({$and: matchArr})

        }


        query.skip((page - 1) * count).limit(count)


        if (sortField) {
            let order = sortOrder === 'ascend' ? 'asc' : 'desc'
            query.sort({[sortField]: order});
        }


        query.exec((err, data) => {


            if (err) {
                return resolve({...errorObj, data: [], total: 0})
            } else {


                if (matchArr.length) {
                    countQuery.match({$and: matchArr});

                }
                countQuery.group({
                    _id: null,
                    count: {$sum: 1}
                });


                //resolve({data: data, total: data.length, ...successObj})

                countQuery.exec((couerr, coudoc) => {
                    if (coudoc) {
                        coudoc = coudoc[0];
                    }
                    let dataArr = Object.assign([], data);
                    async.each(populateArr, (item, cb) => {
                        let ModalName = item.schemaName;
                        ModalName.populate(dataArr, {
                            path: item.path,
                            select: item.select
                        }, function (err, result1) {
                            if (!err) {
                                dataArr = Object.assign([], result1)
                                cb();
                            } else {
                                cb();
                            }
                        })
                    }, () => {
                        resolve({data: dataArr, total: coudoc ? coudoc.count : 0, ...successObj})
                    })


                })
            }
        })

    })
}

export default utils;
