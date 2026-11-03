// Public booking links only. Set these in Hostinger's build environment and redeploy.
// API keys and database credentials must never use VITE_ variables.
function httpsLink(value){
 if(!value?.trim())return null;
 try{const url=new URL(value.trim());return url.protocol==='https:'&&!url.username&&!url.password?url.href:null}catch{return null}
}
export const appBooking={
 androidUrl:httpsLink(import.meta.env.VITE_ANDROID_APP_URL),
 iphoneUrl:httpsLink(import.meta.env.VITE_IPHONE_BOOKING_URL),
};
