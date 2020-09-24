import * as common from "../utils/common.js";


export default{
	
	//根据条件来获取所有视频集合
	getVideosBy(video,callback){
		let videoName = video.videoName ? video.videoName : '';
		let id = video.id ? video.id: '';
		uni.request({
			url:common.VUE_APP_JAVA_URL+ "/video/getVideosBy",
			method:"POST",
			data:{
				videoName: videoName ,
				id : id-0
			},
			success:callback
		})
	},
	
	
	//根据条件查询并带分页效果
	  queryListPage(page, size, searchMap,callback) {
	    let videoName = searchMap.videoName ? searchMap.videoName : "";
	    let id = searchMap.id ? searchMap.id : "";
	    uni.request({
	      url: common.VUE_APP_JAVA_URL+`/video/queryListPage/${page}/${size}`,
	      method: "POST",
	      data: {
	        videoName: videoName,
	        id: id - 0,
			isSort: searchMap.isSort? searchMap.isSort : 0
	      },
		  success:callback
	    });
	  }
	
}