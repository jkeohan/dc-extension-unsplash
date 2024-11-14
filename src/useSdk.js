import { useEffect, useState } from 'react';
import { init } from 'dc-extensions-sdk';

export const useSdk = () => {
	const [sdk, setSdk] = useState({});
	useEffect(() => {
		(async () => {
			const s = await init();
			s.frame.startAutoResizer();
			const values = await s.field.getValue();
			const apiKey = s.params.installation?.api_key;
			const payload = {
				sdk: s,
				url: values.url,
				alt_description: values.alt_description,
				apiKey,
			};

			setSdk(payload);
		})();
	}, []);

	return sdk;
};
