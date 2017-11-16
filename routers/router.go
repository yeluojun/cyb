package routers

import (
	"cyb/controllers/api/v1"
	"cyb/controllers/managers"
	"cyb/controllers/sessions"
	"cyb/controllers/users"
	"dg-app/controllers/backgrounds"
	"log"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

// 设置路由
// func routers() {
// 	// http.HandleFunc("/", sessions.SayhelloName) //设置访问的路由
// 	http.HandleFunc("/login", sessions.Login)
//
// 	http.HandleFunc("/manager/", sessions.LoginGet)
// 	http.HandleFunc("/manager/audio", audios.AudioViewGet)
// 	fs := http.FileServer(http.Dir("./statics"))
// 	http.Handle("/ad/", http.StripPrefix("/ad/", fs))
// }

func ServerInit() {
	// routers()
	router := httprouter.New()

	// 静态文件服务器
	router.ServeFiles("/statics/*filepath", http.Dir("./statics"))
	router.ServeFiles("/node_modules/*filepath", http.Dir("./node_modules"))

	// 官网首页
	// router.GET("/", controllers.IndexGet)

	// 管理员登陆注销等
	router.GET("/manager/login", sessions.LoginGet)
	router.POST("/manager/login", sessions.Login)
	router.DELETE("/manager/login", sessions.Logout)
	router.PUT("/manager/pwd", sessions.ChangePwd) // 修改密码

	//后台管理
	router.GET("/manager", managers.ManagerIndexGet)

	router.GET("/manager/users", users.UserViewGet)

	// 发送验证码
	router.POST("/api/v1/sendcode", v1.SendCode)
	router.GET("/api/v1/sendcode", v1.SendCode)
	router.POST("/api/v1/sign-in", v1.SignIn)
	router.POST("/api/v1/sign-up", v1.SignUp)
	router.POST("/api/v1/pwd-reset", v1.Reset)
	router.DELETE("/api/v1/sign-out", v1.SignOut)
	router.POST("/api/v1/car", v1.Car)

	// 音频管理
	// router.GET("/manager/audios", audios.AudioViewGet)
	// router.POST("/manager/audios", audios.AudioAdd)
	// router.POST("/manager/audios/d", audios.AudioDel)
	// router.PUT("/manager/audios/s", audios.AudioSort)
	// router.PUT("/manager/audios/title", audios.AudioTitle)

	// 背景管理(贴图管理一个样)
	router.GET("/manager/backgrounds", backgrounds.BackgroundsViewGet)
	// router.POST("/manager/backgrounds", backgrounds.BackgroundAdd)
	// router.POST("/manager/backgrounds/d", backgrounds.BackgroundDel)
	// router.PUT("/manager/backgrounds/s", backgrounds.BackgroundSort)
	// router.PUT("/manager/backgrounds/title", backgrounds.BackgroundTitle)
	// router.GET("/manager/lightmaps", backgrounds.LightMapsViewGet)

	// 版本管理
	// router.GET("/manager/versions", versions.Versions)
	// router.POST("/manager/versions", versions.VersionUpdate)

	// 下载
	// router.GET("/download", controllers.Download)
	//
	// router.GET("/shares/:id", shares.Index)

	// api
	// router.GET("/api/v1/q_audio_t", v1.UploadAudioToken)
	// router.GET("/api/v1/q_pic_t", v1.UploadPicToken)
	// router.GET("/api/v1/q_video_t", v1.UploadVideoToken)
	// router.GET("/api/v1/q_apk_t", v1.UploadApkToken)

	// router.GET("/api/v1/audios", v1.Audios)                 // 音频
	// router.GET("/api/v1/audios_o", v1.AudiosWithLastSortBy) // 音频

	// router.GET("/api/v1/backgrounds", v1.Backgrounds)                 // 图片（背景和贴图）
	// router.GET("/api/v1/backgrounds_o", v1.BackgroundsWithLastSortBy) // 图片（背景和贴图）

	// router.POST("/api/v1/shares", v1.VideoUpload)

	// router.GET("/api/v1/versions", v1.VersionUpdate)

	// fs := http.FileServer(http.Dir("./statics"))
	// fmt.Println(fs)
	// http.Handle("/statics/", http.StripPrefix("/statics/", fs))
	err := http.ListenAndServe(":9099", router) //设置监听的端口
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
