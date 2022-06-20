import {Config} from "./gfw/config/config";
declare function InitGscApplication(cfg: Config,
                                    f: Function,
                                    err_group: {[key: string]: (error: any) => void}
): Promise<void>;

