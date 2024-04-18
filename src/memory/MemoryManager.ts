import { AddressMemory } from '../interfaces/AddressMemory'
import { Process } from '../process/Process'
import { SubProcess } from '../process/SubProcess'

export class MemoryManager {
  public physicMemory: (SubProcess | undefined)[][]

  private logicMemory: Map<string, AddressMemory>


  constructor() {
    const quantityPages = 256 / 4

    this.physicMemory = new Array(quantityPages)
    for (let frame = 0; frame < this.physicMemory.length; frame++) {
      this.physicMemory[frame] = new Array<undefined>(4)
    }

    this.logicMemory = new Map<string, AddressMemory>()
  }

  public read(process: Process) {
    const subProcess: SubProcess[] = []

    for (let i = 0; i < process.getSubProcess.length; i++) {
      const subProcessIdSelected = process.getSubProcess[i]

      const addressSubProcess = this.logicMemory.get(subProcessIdSelected)

      if (
        addressSubProcess &&
        this.physicMemory[addressSubProcess.frame][addressSubProcess.index]
      ) {
        subProcess.push(
          this.physicMemory[addressSubProcess.frame][
            addressSubProcess.index
          ] as SubProcess,
        )
      }
    }

    return subProcess
  }

  public write(process: Process) {
    this.allocateProcess(process)
  }

  public check(process: Process) {
    const emptyFrames = this.getIndexOfEmptyPages()
    if (emptyFrames.length < process.getSize / 4) {
      return false
    } else {
      return true
    }
  }

  private getIndexOfEmptyPages() {
    const framesIndex: number[] = []

    for (let frame = 0; frame < this.physicMemory.length; frame++) {
      const element = this.physicMemory[frame]

      if (!element[0]) {
        framesIndex.push(frame)
      }
    }

    return framesIndex
  }

  private allocateProcess(process: Process) {
    const emptyFrames = this.getIndexOfEmptyPages()

    let countSize = 0

    for (let i = 0; i < emptyFrames.length; i++) {
      const indexFrame = emptyFrames[i]
      const page = this.physicMemory[indexFrame]

      let indexPage = 0

      while (indexPage < page.length && countSize < process.getSize) {
        const subProcessId = process.getSubProcess[countSize]

        this.physicMemory[indexFrame][indexPage] = new SubProcess(
          subProcessId,
          process,
        )

        this.logicMemory.set(subProcessId, {
          frame: indexFrame,
          index: indexPage,
        })

        countSize++
        indexPage++
      }
    }

    this.printMemory()
  }

  public delete(process: Process) {
    const subProcess = process.getSubProcess

    this.physicMemory.forEach((page, index, array) => {
      if (page[0]?.getProcess.getId === process.getId) {
        array[index] = new Array(4)
      }
    })

    subProcess.forEach((sb) => {
      this.logicMemory.delete(sb)
    })

    this.printMemory()

    return process
  }

  private printMemory() {
    console.log(
      '-=-=-=-=-=-=-=-=--=-=-=-=-=-=-=-=-=-==--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=--=',
    )
    for (let page = 0; page < this.physicMemory.length; page++) {
      const element = this.physicMemory[page].map((subProcess) => subProcess?.getId)

      console.log(element)
    }
  }
}
