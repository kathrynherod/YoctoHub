

require('yoctolib-es2017/yocto_api.js');
require('yoctolib-es2017/yocto_voltage.js');

const keys = require("../config/keys.js");

let dcVolt, acVolt;
// keys.logins.YOCTO_USER

async function startYWatt()
{
    await YAPI.LogUnhandledPromiseRejections();
    await YAPI.DisableExceptions();
    // Setup the API to use the VirtualHub on local machine
    let errmsg = new YErrorMsg();
    if(await YAPI.RegisterHub(keys.logins.YOCTO_ADMIN, errmsg) != YAPI.SUCCESS) {
        console.log('Cannot contact VirtualHub '+errmsg.msg);
        return;
    }

    // Select specified device, or use first available one
    let serial = process.argv[process.argv.length-1];
    if(serial[8] != '-') {
        // by default use any connected module suitable for the demo
        let anysensor = YVoltage.FirstVoltage();
        if(anysensor) {
            let module = await anysensor.module();
            serial = await module.get_serialNumber();
        } else {
            console.log('No matching sensor connected, check cable !');
            return;
        }
    }
    console.log('Using device '+serial);
    dcVolt = YVoltage.FindVoltage(keys.serials.YWattSerial + ".voltage1");
    acVolt = YVoltage.FindVoltage(serial+".voltage2");

    refresh();
}

async function refresh()
{
    if (await dcVolt.isOnline()) {
        console.log('DC voltage : '+(await dcVolt.get_currentValue()) + (await dcVolt.get_unit()));
        //console.log('AC voltage : '+(await acVolt.get_currentValue()) + (await acVolt.get_unit()));
    } else {
        console.log('Module not connected');
    }
    setTimeout(refresh, 1000);
}

startYWatt();