import _ from "lodash";
import async from "async";
import uuid from "uuid";
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
                        kk.push(file);
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

export const handleMediaResponse = (data, url) => {
    return new Promise((resolve) => {

        let body = _.clone(data)

        if (_.isArray(body)) {
            async.each(body, (singleObj, singCll) => {

                async.forEachOf(singleObj, async (item, key, done) => {

                    if (_.isArray(item)) {

                        let kk = []
                        async.each(item, (file, next) => {

                            let x = file.path && file.uid;
                            kk.push({ status: 'done' , ...file , url: `${url}${file.url}`})
                            next()

                        }, () => {
                            singleObj[key] = kk
                            done();
                        })

                    } else {
                        done()
                    }

                }, () => {
                    singCll();
                })
            }, () => {
                resolve(body)
            })

        } else {

            async.forEachOf(body, async (item, key, done) => {

                if (_.isArray(item)) {

                    let kk = []
                    async.each(item, (file, next) => {

                        let x = file.path && file.uid;
                        kk.push({...file, url: `${url}${file.url}`, status: 'done'})

                        next()

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
        }

    })
}

export default {};
