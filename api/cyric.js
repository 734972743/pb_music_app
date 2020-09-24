import * as common from "../utils/common.js";


export default {
 
  getAllCyricsByCyric(id,callback) {
      return uni.request({
        url: common.VUE_APP_JAVA_URL+`/cyric/getAllCyricsByCyric`,
        method: "POST",
		data: {
		  id,
		},
  	  success:callback
      });
    }
};