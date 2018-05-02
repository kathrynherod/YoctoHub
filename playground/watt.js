"use strict";

require('yoctolib-es2017/yocto_api.js');
require('yoctolib-es2017/yocto_power.js');
require('yoctolib-es2017/yocto_voltage.js');
require('yoctolib-es2017/yocto_voltageoutput.js');

let power;
let voltage;

async function startDemo()
{
    await YAPI.LogUnhandledPromiseRejections();
    await YAPI.DisableExceptions();

    // Setup the API to use the VirtualHub on local machine
    let errmsg = new YErrorMsg();
    //console.log(process.env.YOCTO_USER);
    if(await YAPI.RegisterHub('user:Richards1301@192.168.1.165', errmsg) != YAPI.SUCCESS) {
        console.log('Cannot contact VirtualHub on 192.168.1.165: '+errmsg.msg);
        return;
    }

    // Select specified device, or use first available one
    let serial = process.argv[process.argv.length-1];
    if(serial[8] != '-') {
        // by default use any connected module suitable for the demo
        let anysensor = YPower.FirstPower();
        if(anysensor) {
            let module = await anysensor.module();
            serial = await module.get_serialNumber();
        } else {
            console.log('No matching sensor connected, check cable !');
            return;
        }
    }
    console.log('Using device '+serial);
    power = YPower.FindPower(serial+".power");
    voltage = YVoltage.FindVoltage(serial+".power");
     console.log(voltage)

    refresh();
}

async function refresh()
{
    // if (await power.isOnline()) {
    //     console.log('Power : '+(await power.get_currentValue()) + (await power.get_unit()));
    //     console.log()
    // } else {
    //     console.log('Module not connected');
    // }
    if (await voltage.isOnline()) {
        console.log('Power : '+(await voltage.get_currentValue()) + (await voltage.get_unit()));
        console.log()
    } else {
        console.log('Module not connected');
    }
    setTimeout(refresh, 1000);
}

startDemo();
