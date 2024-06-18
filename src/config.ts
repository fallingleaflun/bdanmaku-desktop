import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import log from 'electron-log';

export interface RoomConfig {
    NAME: string,
    ROOMID: number,
    UID: number,
    BUVID: string,
    KEY: string
}

export interface AppConfig {
    currentRoomConfig: RoomConfig,
    roomConfigList: RoomConfig[]
}

class ConfigUtils {
    appConfig: AppConfig
    configFilePath: string

    constructor() {
        // 打包后使用exe路径
        if (app.isPackaged) {
            const exeDir = path.dirname(app.getPath('exe'));
            this.configFilePath = path.join(exeDir, 'config.json');
            log.info(`config file path: ${this.configFilePath}`)
        }
        else {
            this.configFilePath = './config.json'
        }

        const configExists = fs.existsSync(this.configFilePath)
        if (!configExists) {
            this.appConfig = {
                currentRoomConfig: {
                    NAME: "invalid",
                    ROOMID: 0,
                    UID: 0,
                    BUVID: "invalid buvid",
                    KEY: "invalid key"
                },
                roomConfigList: []
            }
            this.writeConfig()
        }
        this.readConfig()
    }

    public getCurrentRoomConfig(): RoomConfig {
        return this.appConfig.currentRoomConfig
    }

    public getRoomConfigList(): RoomConfig[] {
        return this.appConfig.roomConfigList
    }

    public setCurrentRoomConfig(roomConfig: RoomConfig) {
        this.appConfig.currentRoomConfig = roomConfig
        this.writeConfig()
    }

    public setRoomConfigListByNumber(roomid: number) {
        const roomConfig = this.appConfig.roomConfigList.find((roomConfig) => roomConfig.ROOMID === roomid)
        if (roomConfig) {
            this.appConfig.currentRoomConfig = roomConfig
            this.writeConfig()
        }
    }

    public addRoomConfig(roomConfig: RoomConfig) {
        const idx = this.appConfig.roomConfigList.findIndex((config) => config.ROOMID === roomConfig.ROOMID)
        if (idx !== -1) {
            this.appConfig.roomConfigList[idx] = roomConfig
        }
        else {
            this.appConfig.roomConfigList.push(roomConfig)
        }
        this.writeConfig()
    }

    private writeConfig() {
        const json = JSON.stringify(this.appConfig, null, 2)
        try {
            fs.writeFileSync(this.configFilePath, json, "utf-8")
        }
        catch (error) {
            log.error(`writeConfig error: ${error}`)
        }
    }

    private readConfig() {
        try {
            const json = fs.readFileSync(this.configFilePath, "utf-8")
            this.appConfig = JSON.parse(json)
        } catch (error) {
            log.error(`readConfig error: ${error}`)
            this.appConfig = {
                currentRoomConfig: {
                    NAME: "invalid",
                    ROOMID: 0,
                    UID: 0,
                    BUVID: "invalid buvid",
                    KEY: "invalid key"
                },
                roomConfigList: []
            }
        }
    }
}

const configUtils = new ConfigUtils()

export default configUtils