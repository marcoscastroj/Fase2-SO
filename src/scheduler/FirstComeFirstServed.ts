import { ExecuteSchedulerResponse } from '../interfaces/ExecuteSchedulerResponse'
import { Process } from '../process/Process'
import { SubProcess } from '../process/SubProcess'
import { TypeCall } from '../so/SystemCallType'
import { SSOperation } from '../so/SystemOperation'
import { SchedulerQueue } from './SchedulerQueue'
import { SchedulerType } from './SchedulerType'

export class FirstComeFirstServed extends SchedulerQueue {
  public addProcess(process: Process): void {
    this.queueProcess.push(process)

    const subProcesses = SSOperation.call({
      tc: TypeCall.READ_PROCESS,
      p: process,
    }) as SubProcess[]

    subProcesses.forEach((sp) => {
      this.queueSubProcesses.push(sp)
    })
  }

  public execute(): ExecuteSchedulerResponse | undefined {
    const element = this.queueSubProcesses.shift()

    if (element) {
      return {
        element,
        priority: element.getProcess.getPriority,
        timeExecution: element.getProcess.getTimeExecution,
        type: SchedulerType.FIRST_COME_FIRST_SERVED,
      }
    } else {
      return undefined
    }
  }
}
