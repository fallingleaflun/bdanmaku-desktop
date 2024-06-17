import ini from 'ini';
import fs from 'fs';
import path from 'path';
import { app } from 'electron';
import log from 'electron-log';
let configFilePath = ""

// 打包后使用exe路径
if (app.isPackaged) {
    const exeDir = path.dirname(app.getPath('exe'));
    configFilePath = path.join(exeDir, 'config.ini');
    log.info(`config file path: ${configFilePath}`)
}
else {
    configFilePath = './config.ini'
}

const configExists = fs.existsSync(configFilePath)
if (!configExists) {
    fs.writeFileSync(configFilePath, "", "utf-8")
}
const config = configExists ? ini.parse(fs.readFileSync(configFilePath, 'utf-8')) : undefined
log.debug(`configExists: ${configExists}`)
const appConfig = configExists ?
    {
        CONFIGFILEPATH: configFilePath as string,
        ROOMID: Number(config?.DEFAULT?.ROOMID ?? 0) as number,
        UID: Number(config?.DEFAULT?.UID ?? 0) as number,
        BUVID: config?.DEFAULT?.BUVID2 as string ?? "invalid buvid",
        KEY: config?.DEFAULT?.KEY as string ?? "invalid key",
    } : {
        CONFIGFILEPATH: configFilePath as string,
        ROOMID: 0,
        UID: 0,
        BUVID: "invalid buvid",
        KEY: "invalid key",
    }

export default appConfig