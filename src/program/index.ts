export type ProgramInfo = {
    name: string;
    version: `${number}.${number}.${number}${"" | `-${string}`}`
}

export abstract class Program {
    constructor(programInfo: ProgramInfo) {
        
    }
}