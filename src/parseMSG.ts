export class MSGBase {
    userName: string
    medal: string
    level: number
    info: string
}

export class NormalMSG extends MSGBase {
    constructor(data: any) {
        super()
        this.userName = data["info"][2][1] as string
        this.medal = data["info"][3][1] as string
        this.level = data["info"][3][0] as number
        this.info = data["info"][1] as string
    }
}