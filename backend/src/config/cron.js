import cron from "cron"
import https from "https";
import { ENV } from "./env";
const job = new cron.CronJob("*/14 * * * * " , function (){
    https
    .get(ENV.API_URL , (res)=>{
        if(res.statusCode== 200) console.log("Get request sent successfully ")
        else console.log("Get request failed..." , res.statusCode)
    }
).on("error" , (e)=> console.error("Error while sending req " , e));
})

export default job;