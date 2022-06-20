import {UpdateConfig} from "./gfw/config/config";
import {InitContext} from "./gfw/appliction/application";
import {RpcClient} from "./gfw/rpc/rpcClient";
import _ from "lodash";

export function InitGscApplication(cfg, f, err_group) {
    UpdateConfig(cfg);
    // 挂载网络错误提示
    _.forOwn(err_group, (value, key) => {
        RpcClient.setErrorHandle(key, value);
    });
    return InitContext().then(()=>{

    })
}

