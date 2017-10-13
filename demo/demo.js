(() => {
	const log = (label, message) => {
		const console = document.querySelector('.log');
		console.innerHTML += `[${label.toUpperCase()}] ${message}\n`;
		console.scrollTop = console.scrollHeight;
	};

	let _device;

	// Connection management
	const button = document.querySelector('button');
	button.addEventListener('click', () => {
		if (!_device) {
			log('status', 'Connecting...');

			navigator.usb.requestDevice({ filters: [{ vendorId: 0x4d8 }] })
				.then((device) => {
					log('status', `Connected to ${device.productName} (from ${device.manufacturerName})`);
					button.innerHTML = 'Disconnect';
					_device = device;
					return _device.open();
				})
				.then(() => {
					if (_device.configuration === null) {
						log('status', 'Selecting configuration...');
						return _device.selectConfiguration(1);
					}
				})
				.then(() => {
					log('status', 'Claiming interface...');
					return _device.claimInterface(0);
				})
				.then(() => {
					log('status', 'Interface claimed successfully');
					document.querySelector('.operations').classList.remove('operations--inactive');
					console.log(_device);
				})
				.catch((error) => {
					log('status', `Operation failed (${error})`);
				})
			;
		} else {
			button.innerHTML = 'Connect';
			log('status', 'Disconnected');
			document.querySelector('.operations').classList.add('operations--inactive');
			_device.close();
			_device = null;
		}
	});

	// Set Luxafor color
	document.querySelector('.operation--color ul').addEventListener('click', (event) => {
		if (event.target.tagName !== 'LI') {
			return;
		}

		const colors = ('' + event.target.style.background).match(/[\d]+/g).map((color) => parseInt(color));
		log('color', `Setting Luxafor color to ${event.target.innerHTML.toUpperCase()}...`);
		_device.transferOut(1, Uint8Array.from([2, 0xff, ...colors, 20]))
			.then(({ bytesWritten, status }) => {
				log('color', `Result: ${status} / Bytes written: ${bytesWritten}`)
			})
			.catch((error) => log('color', error))
		;
	});

	log('welcome', 'Press "Connect" to begin');
})();
