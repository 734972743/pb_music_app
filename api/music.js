//import request from "../utils/request.js";
import * as common from "../utils/common.js";

export default {
	
	
	//根据条件来查询所有的歌曲列表  有分页效果
	getMusicSearch(page, size, searchMap,callback) {
		let typeIds = [];
		let success = {};
		searchMap.typeId.forEach(id => {
		  typeIds.push(id);
		});
		typeIds.push();
		 uni.request({
		  url: common.VUE_APP_JAVA_URL+`/song/queryListPage/${page}/${size}`,
		  method: "POST",
		  data: {
			songName: searchMap.songName,
			searchTypeIds: typeIds,
			isSort: searchMap.isSort? searchMap.isSort : 0
		  },
		  success: callback
		});
  },
  
  //通过条件来查询歌曲 ,没有分页
  getSongsBy(song,callback){
	  uni.request({
	  	url:common.VUE_APP_JAVA_URL+`/song/getSongsBy`,
		method:"POST",
		data:{
			songId:song.songId
		},
		success:callback
	  })
  },
  
  
  //这个是收藏夹添加歌曲的
	  addSongListWithSong(collectionId, music,callback) {
		uni.request({
		  url: common.VUE_APP_JAVA_URL+`/songListWithSong/addSongListWithSong`,
		  method: "POST",
		  data: {
			songListId: collectionId,
			songId: music.songId
		  },
		  success: callback
		});
	  },
	  
  //根据用户ID来获取所有的收藏夹列表
	getgetSongListsByUserId(userId,callback) {
		return uni.request({
		  url: common.VUE_APP_JAVA_URL+`/songList/getgetSongListsByUserId/${userId}`,
		  method: "GET",
		  success: callback
		});  
	},
	
	//这个是给用户添加收藏夹
	  addUserWithSongList(newCollectionForm, userId,callback) {
	    return uni.request({
	      url: common.VUE_APP_JAVA_URL+`/userWithSongList/addUserWithSongList`,
	      method: "POST",
	      data: {
	        collectionName: newCollectionForm.collectionName,
	        introduce: newCollectionForm.introduce,
	        songListStateId: newCollectionForm.songListStateId,
	        userId: userId - 0
	      },
		  success: callback
	    });
	  },
  
  //根据用户ID来获取所有的收藏夹列表
    getgetSongListsByUserId(userId,callback) {
        return uni.request({
          url: common.VUE_APP_JAVA_URL+`/songList/getgetSongListsByUserId/${userId}`,
          method: "GET",
		  success:callback
        });
    },
	
	//这个是向收藏夹添加歌曲的
	  addSongListWithSong(collectionId, music,callback) {
	    return uni.request({
	      url: common.VUE_APP_JAVA_URL+`/songListWithSong/addSongListWithSong`,
	      method: "POST",
	      data: {
	        songListId: collectionId,
	        songId: music.songId
	      },
		  success:callback
	    });
	  },
	  
	  //这个是取消收藏夹的歌曲
	    deleteSongListWithSong(collectionId, music,callback) {
	      return uni.request({
	        url: common.VUE_APP_JAVA_URL+`/songListWithSong/deleteSongListWithSong`,
	        method: "DELETE",
	        data: {
	          songListId: collectionId,
	          songId: music.songId
	        },
			success:callback
	      });
	    },
	  
	  //根据用户ID来查询自己收藏的歌曲
	    getCollectionSongByUserId(userId,callback) { 
	      return uni.request({
	        url: common.VUE_APP_JAVA_URL+`/song/getCollectionSongByUserId/${userId}`,
	        method: "GET",
			success: callback
	      });
	    },
		
	//根据用户ID来查询自己收听过的歌曲历史信息
	  getUserHistorySongsByUserId(userId,callback) {
		  return uni.request({
			url: common.VUE_APP_JAVA_URL+`/userHistorySong/getUserHistorySongsByUserId/${userId}`,
			method: "GET",
			success:callback
		  });
	  },
	  
	  //根据用户ID来清空他所有的历史记录
	    deleteAllHistorySongByUserId(userId,callback) {
	      return uni.request({
	        url:  common.VUE_APP_JAVA_URL+`/userHistorySong/deleteAllHistorySongByUserId/${userId}`,
	        method: "DELETE",
			success:callback
	      });
	    },
		  
	 //添加自己收听历史列表中
	  addUserHistorySong(songId,userId,callback) {
		  return uni.request({
			url: common.VUE_APP_JAVA_URL+`/userHistorySong/addUserHistorySong`,
			method: "POST",
			data: {
			  userId: userId,
			  songs: [
				{
				  songId: songId
				}
			  ]
			},
			success:callback
		  });
	  }, 
	   
	   
	   //百度音乐
	  baiduMusicSearch(callback){
		  uni.request({
		  	url: "http://tingapi.ting.baidu.com/v1/restserver/ting?method=baidu.ting.billboard.billList&type=1&size=10&offset=0",
			method:"GET",
			success:callback
		  })
	  },
	  
	  baiduMusicPlay(callback){
		  uni.request({
		  	url:"http://tingapi.ting.baidu.com/v1/restserver/ting?method=baidu.ting.song.playAAC&songid=672865438",
			method:"GET",
			success:callback
		  })
	  }
}