//#region node_modules/.nitro/vite/services/ssr/assets/site-DJJ-cs6K.js
/**
* Single place to configure the brand + the WhatsApp destination number.
* Set VITE_WHATSAPP_NUMBER in the environment to change it without touching UI code.
* Format: full international number, digits only, no "+".
*/
var site = {
	name: "نحلة",
	slogan: "هنوصلك بسرعة النحلة",
	currency: "جنيه",
	whatsappNumber: {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_SUPABASE_ANON_KEY": "sb_publishable_zG8MNLkbp_2ScSDvpxPpiA_UCa80DXE",
		"VITE_SUPABASE_URL": "https://gcrcfsuydfmsaclwubzj.supabase.co",
		"VITE_TELEGRAM_BOT_TOKEN": "8653896427:AAHuJ9c_j0YqZ_LUMkoNhz9yvWfrwAiq6UM",
		"VITE_TELEGRAM_CHAT_ID": "1170515116"
	}["VITE_WHATSAPP_NUMBER"] ?? "201000000000"
};
//#endregion
export { site as t };
