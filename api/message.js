import * as common from "../utils/common.js";
export default{
	
	
	
	//获取该歌曲的总评论数
	getCountBySongId(songId,callback) {
	    return uni.request({
	      url: common.VUE_APP_JAVA_URL+`/message/getCountBySongId/${songId}`,
	      method: "GET",
		  success:callback
	    });
	  },
	
	//根据歌曲ID来获取所有的评论
	getMessagesBySongId(songId, curPage, pageSize,callback) {
		return uni.request({
		  url:  common.VUE_APP_JAVA_URL+`/message/getMessagesBySongId/${songId}/${curPage}/${pageSize}`,
		  method: "GET",
		  success: callback
		});
  },
  
  //回复评论
	  replyMessage(message,callback) {
		  return uni.request({
			url: common.VUE_APP_JAVA_URL+"/message/replyMessage",
			method: "POST",
			data: {
			  songId: message.songId,
			  content: message.content,
			  userId: message.userId
			},
			success: callback
		  });
		}
	
}

