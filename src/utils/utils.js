import _ from "lodash";
import async from "async";
import {errorObj, successObj} from './settings'

const fs = require('fs');

export const handleMediaUpload = (data) => {
    return new Promise((resolve) => {

        let body = _.clone(data)

        async.forEachOf(body, async (item, key, done) => {

            if (_.isArray(item)) {

                let kk = []
                async.each(item, (file, next) => {

                    let x = file.originFileObj;
                    if (x !== undefined) {
                        let {filename} = file.response

                        kk.push({
                            uid: uuid.v1(),
                            name: file.name,
                            path: `./public/media/${filename}`,
                            url: `/media/${filename}`,
                        })

                        fs.rename(`./public/tempFiles/${filename}`, `./public/media/${filename}`, (err) => {
                            if (err) console.log(err)
                            next()
                        })


                    } else {
                        next()
                    }

                }, () => {

                    body[key] = kk
                    done();
                })

            } else {
                done()
            }

        }, () => {

            resolve(body)

        })
    })
}

export const handleSingleMediaUpload = (data) => {
    return new Promise((resolve) => {

        let body = _.clone(data)

        async.forEachOf(body, async (item, key, done) => {

            if (_.isObject(item)) {

                console.log(item)

                let kk = [];

                let file = item

                let x = file.originFileObj;
                if (x !== undefined) {
                    let {filename} = file.response

                    kk = {
                        uid: uuid.v1(),
                        name: file.name,
                        path: `./public/media/${filename}`,
                        url: `/media/${filename}`,
                    }

                    fs.rename(`./public/tempFiles/${filename}`, `./public/media/${filename}`, (err) => {
                        if (err) console.log(err)
                        body[key] = kk
                        done();
                    })


                } else {
                    done()
                }

            } else {
                done()
            }

        }, () => {

            resolve(body)

        })
    })
}

export default {};