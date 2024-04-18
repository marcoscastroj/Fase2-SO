import { CpuManager } from '../cpu/CpuManager'
import { ExecuteSchedulerResponse } from '../interfaces/ExecuteSchedulerResponse'
import { Process } from '../process/Process'
import { SubProcess } from '../process/SubProcess'
import { TypeCall } from '../so/SystemCallType'
import { SSOperation } from '../so/SystemOperation'
import { SchedulerQueue } from './SchedulerQueue'
import { SchedulerType } from './SchedulerType'

export class RoundRobin extends SchedulerQueue {
  private countExecutedSubProcess: number = 0
  private processInExecution: Process | null = null
  private graphicQuantum: Map<string, number> = new Map()
  private quantum: number

  constructor(quantum: number) {
    super()
    this.quantum = quantum * 1000
  }

  public addProcess(process: Process): void {
    this.queueProcess.push(process)

    const subProcesses = SSOperation.call({
      tc: TypeCall.READ_PROCESS,
      p: process,
    }) as SubProcess[]

    subProcesses.forEach((sp) => {
      this.queueSubProcesses.push(sp)
    })

    this.processInExecution = this.queueProcess[0]
  }

  public execute(): ExecuteSchedulerResponse | undefined {
    const element = this.queueSubProcesses.shift()

    if (element) {
      if (
        this.processInExecution?.getId &&
        element.getProcess.getId === this.processInExecution.getId
      ) {
        this.countExecutedSubProcess++
      }

      const aux = this.queueSubProcesses.map((sp) => sp.getProcess.getId)

      if (!aux.includes(element.getProcess.getId)) {
        this.queueProcess.shift()
        this.processInExecution = this.queueProcess[0]
        this.countExecutedSubProcess = 0
      }

      const valueQuantum = this.graphicQuantum.get(element.getProcess.getId)

      if (
        !valueQuantum &&
        this.countExecutedSubProcess === CpuManager.NUMBER_OF_CORES
      ) {
        this.graphicQuantum.set(element.getProcess.getId, CpuManager.CLOCK)

        if (CpuManager.CLOCK >= this.quantum) {
          console.log({valueQuantum});
          this.rotate(element.getProcess.getId)
        }

        this.countExecutedSubProcess = 0
      }

      if (
        valueQuantum &&
        this.countExecutedSubProcess === CpuManager.NUMBER_OF_CORES
      ) {
        this.graphicQuantum.set(
          element.getProcess.getId,
          CpuManager.CLOCK + valueQuantum,
        )

        this.countExecutedSubProcess = 0
      }

      const value = this.graphicQuantum.get(element.getProcess.getId)

      if (
        !(CpuManager.CLOCK >= this.quantum) &&
        value &&
        value >= this.quantum
      ) {
        console.log({value});
        
        this.rotate(element.getProcess.getId)
      }

      return {
        element,
        priority: element.getProcess.getPriority,
        timeExecution: element.getProcess.getTimeExecution,
        type: SchedulerType.ROUND_ROBIN,
      }
    } else {
      return undefined
    }
  }

  public rotate(processId: string) {
    if (
      this.processInExecution &&
      this.processInExecution.getInstructions >
        this.processInExecution.getInstructionsExecuted
    ) {
      const subProcessesByProcess = this.getSubProcessByProcess()

      this.removeProcessAndSubProcess()

      this.addProcessAndSubProcessInEnd(subProcessesByProcess)

      this.processInExecution = this.queueProcess[0]
      this.countExecutedSubProcess = 0

      this.graphicQuantum.set(processId, 0)
    }
  }

  private getSubProcessByProcess() {
    return this.queueSubProcesses.filter(
      (sp) => sp.getProcess.getId === this.processInExecution?.getId,
    )
  }

  private removeProcessAndSubProcess() {
    this.queueProcess.shift()

    this.queueSubProcesses = this.queueSubProcesses.filter(
      (sp) => sp.getProcess.getId !== this.processInExecution?.getId,
    )
  }

  private addProcessAndSubProcessInEnd(subProcesses: SubProcess[]) {
    if (this.processInExecution) {
      this.queueProcess.push(this.processInExecution)

      subProcesses.forEach((sp) => {
        this.queueSubProcesses.push(sp)
      })
    }
  }
}
