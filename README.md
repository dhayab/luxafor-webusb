# luxafor-webusb

This repository holds a **proof of concept** implementation of [WebUSB](https://wicg.github.io/webusb/), allowing the user to control a [Luxafor](http://www.luxafor.com/) status light.

WebUSB provides an API for securely getting access to USB devices from a web page, without the need for a  driver or a browser extension.

It is still in development, and as such, is only supported in the latest versions of the Chrome browser.

It has only been successfully tested in Linux (Ubuntu 16.04).

## Preparation

Set a rule in `udev` in order to give your session access to the USB device:

```shell	
$ cat /etc/udev/rules.d/60-luxafor.rules
SUBSYSTEMS=="usb", ATTR{idVendor}=="04d8", ATTR{idProduct}=="f372", MODE:="0666"
```

Then reload `udev` by typing the following:

```shell
$ sudo udevadm control --reload-rules
```

After that, you can install the dependencies required for this project with `npm install`.

## Run

To run the demo page, type `npm start` in your Terminal. The URL of the webserver will be displayed after it has been initialized.

During the connection, you might get this message:

```shell
[STATUS] Operation failed (NetworkError: Unable to claim interface.)
```

That means the Kernel has claimed the USB interface for the Luxafor status light. You can free it by typing `npm run detach` in your Terminal.

## External resources

- [Luxafor USB reference](http://www.luxafor.fr/assets/download/luxafor-for-developers.zip)
- [WebUSB implementation status](https://www.chromestatus.com/feature/5651917954875392)

