package controllers

import (
	"cyb/configs"
	"cyb/models"
	"fmt"
	"html/template"
	"net/http"
	"strings"

	"github.com/julienschmidt/httprouter"
)

func IndexGet(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	userAgent := strings.ToLower(r.Header["User-Agent"][0])

	var t *template.Template
	var err error
	// android手机访问
	if strings.Contains(userAgent, "like mac os") || strings.Contains(userAgent, "android") || strings.Contains(userAgent, "windows phone") {
		t, err = template.ParseFiles("./views/index_m.html")
		// pc 访问
	} else {
		t, err = template.ParseFiles("./views/index.html")
	}

	if err != nil {
		fmt.Fprintln(w, "sorry, but something error")
		return
	}

	t.Execute(w, nil)
}

// 软件下载
func Download(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	r.ParseForm()
	userAgent := strings.ToLower(r.Header["User-Agent"][0])
	ty := r.FormValue("data_type")
	if ty == "android" || strings.Contains(userAgent, "android") {
		appVersion := models.AppVersion{}
		_, err := configs.Engine.OrderBy("id desc").Get(&appVersion)
		if err != nil {
			fmt.Fprintln(w, "抱歉，服务器出现了一个错误")
			return
		}
		http.Redirect(w, r, appVersion.Url, http.StatusSeeOther)
	} else if ty == "ios" || strings.Contains(userAgent, "like mac os") {
		fmt.Fprintln(w, "抱歉，IOS正在上架中")
	} else {
		fmt.Fprintln(w, "参数错误")
	}
}
