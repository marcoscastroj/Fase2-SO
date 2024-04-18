import { Scheduler } from '../scheduler/Scheduler'
import { Core } from './Core'

export class CpuManager {
  private cores: Core[]
  public static CLOCK: number = 500
  public static NUMBER_OF_INSTRUCTIONS_BY_CLOCK: number = 7
  public static NUMBER_OF_CORES: number = 4
  private scheduler: Scheduler

  constructor(scheduler: Scheduler) {
    this.cores = new Array(CpuManager.NUMBER_OF_CORES)

    for (let index = 0; index < this.cores.length; index++) {
      this.cores[index] = new Core(
        index,
        CpuManager.NUMBER_OF_INSTRUCTIONS_BY_CLOCK,
      )
    }
    this.scheduler = scheduler
    this.runClock()
  }

  private runClock() {
    setInterval(() => {
      this.executeCores()
    }, CpuManager.CLOCK)
  }

  private executeCores() {
    let data = null
    this.cores.forEach((core) => {
      data = this.scheduler.execute()

      if (data) {
        if (!core.subProcess) {
          core.subProcess = data.element
          core.run()
        }
      }
    })

    if (data) {
      console.log('-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=')
    }
  }
}
