import { Process } from './process/Process'
import { TypeCall } from './so/SystemCallType'
import { SSOperation } from './so/SystemOperation'

const p1 = SSOperation.call({tc: TypeCall.CREATE_PROCESS, ps: 130, te: 10, py: 1}) as Process
SSOperation.call({tc: TypeCall.WRITE_PROCESS, p: p1})

const p2 = SSOperation.call({tc: TypeCall.CREATE_PROCESS, ps: 90, te: 5, py: 2}) as Process
SSOperation.call({tc: TypeCall.WRITE_PROCESS, p: p2})

const p3 = SSOperation.call({tc: TypeCall.CREATE_PROCESS, ps: 30, te: 15, py: 3}) as Process
SSOperation.call({tc: TypeCall.WRITE_PROCESS, p: p3})


//const p1 = SSOperation.call({tc: TypeCall.CREATE_PROCESS, ps: 75, te: 10, py: 1}) as Process
//SSOperation.call({tc: TypeCall.WRITE_PROCESS, p: p1})

//const p2 = SSOperation.call({tc: TypeCall.CREATE_PROCESS, ps: 90, te: 5, py: 2}) as Process
//SSOperation.call({tc: TypeCall.WRITE_PROCESS, p: p2})

//const p3 = SSOperation.call({tc: TypeCall.CREATE_PROCESS, ps: 34, te: 15, py: 3}) as Process
//SSOperation.call({tc: TypeCall.WRITE_PROCESS, p: p3})

//const p4 = SSOperation.call({tc: TypeCall.CREATE_PROCESS, ps: 52, te: 15, py: 3}) as Process
//SSOperation.call({tc: TypeCall.WRITE_PROCESS, p: p4})



