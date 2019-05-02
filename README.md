# Scizers Nodejs Utils 



```

import {TableFilterQuery} from "sz-node-utils";
...

let populateArr = [
    {path: 'dealerId', select: 'dealershipName'}
];
let x = await TableFilterQuery(Requirement, {...data, populateArr})

// X will return API Response

```
