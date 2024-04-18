import { Process } from '../process/Process'
import { TypeCall } from './SystemCallType'
import { MemoryManager } from '../memory/MemoryManager'
import { SubProcess } from '../process/SubProcess'
import { Scheduler } from '../scheduler/Scheduler'
import { FirstComeFirstServed } from '../scheduler/FirstComeFirstServed'
import { Lottery } from '../scheduler/Lottery'
import { ShortestJobFirst } from '../scheduler/ShortestJobFirst'
import { Priority } from '../scheduler/Priority'
import { RoundRobin } from '../scheduler/RoundRobin'

interface Props {
  tc: TypeCall
  ps?: number
  p?: Process
  py?: number
  te?: number
}

export class SSOperation {
  public static memoryManager = new MemoryManager()
  public static schedulerType: Scheduler = new ShortestJobFirst()     
  //public static schedulerType: Scheduler = new RoundRobin(3)

  public static call({tc,ps,p,py,te}: Props): Process | void | SubProcess[] {
    if (tc === TypeCall.CREATE_PROCESS && ps && !p) {
      return new Process(ps, py, te)
    }

    if (tc === TypeCall.WRITE_PROCESS && p) {
      const checkWrite = this.memoryManager.check(p)

      if (checkWrite) {
        this.memoryManager.write(p)
        this.schedulerType.addProcess(p)
      } else {
        console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
        
        console.log('Page fault')
        console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=");
      }
    }

    if (tc === TypeCall.READ_PROCESS && p) {
      return this.memoryManager.read(p)
    }

    if (tc === TypeCall.DELETE_PROCESS && p) {
      this.schedulerType.close(p)
      this.memoryManager.delete(p)
    }

    if (tc === TypeCall.STOP_PROCESS && p) {
      this.schedulerType.close(p)
    }
  }
}
