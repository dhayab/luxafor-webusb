const ora = require('ora');
const usb = require('usb');

let spinner = ora('Connecting to Luxafor...').start();
const device = usb.findByIds(0x04d8, 0xf372);
if (device) {
	spinner.succeed(spinner.text + ' OK');
	device.open();
} else {
	spinner.fail(spinner.text + ' NOT FOUND');
	process.exit(1);
}

spinner = ora('Checking interface...').start();
const interface = device.interface(0);
if (!interface) {
	spinner.fail(spinner.text + ' NOT FOUND');
	process.exit(1);
} else if (interface.isKernelDriverActive()) {
	spinner.info(spinner.text + ' ATTACHED');
	ora('Detaching Luxafor from Kernel lock').succeed();
	interface.detachKernelDriver();
} else {
	spinner.succeed(spinner.text + ' AVAILABLE');
}

device.close();
