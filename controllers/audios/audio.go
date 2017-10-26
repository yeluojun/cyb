package audios

import (
	"cyb/configs"
	"cyb/controllers/filters"
	"cyb/controllers/utils"
	"cyb/models"
	"fmt"
	"html/template"
	"io/ioutil"
	"net/http"

	simplejson "github.com/bitly/go-simplejson"
	"github.com/julienschmidt/httprouter"
)

type audio struct {
}

func AudioViewGet(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	// fmt.Println(r.Header)
	// fmt.Println(r.Header.Get("X-Pjax"))
	// select {
	// 	case <-tmp
	// }
	filter := filters.Filter{Request: r}
	if !filter.AdminFilter() {
		http.Redirect(w, r, "/manager/login", http.StatusSeeOther)
		return
	}

	t, err := template.ParseFiles(
		"./views/manager/layout.html",
		"./views/manager/audio/audios.html",
		"./views/manager/items/upload.html",
		"./views/manager/items/upload_model.html",
	)

	if err != nil {
		configs.WriteLog("error", err.Error())
		fmt.Fprintln(w, "sorry, but something error")
		return //step 2
	}

	var allAudios []models.Audio

	err = configs.Engine.Desc("sort_by").Find(&allAudios)

	if err != nil {
		configs.WriteLog("error", err.Error())
		fmt.Fprintln(w, "sorry, but something error")
		return //step 2
	}
	// t.ExecuteTemplate
	t.Execute(w, allAudios)
}

// 添加音频
func AudioAdd(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	// TODO 管理员判断
	// 判断不是管理员
	filter := filters.Filter{Request: r}
	if !filter.AdminFilter() {
		configs.ReturnJson(w, configs.PERMISSION_ERROR_CODE, configs.PERMISSION_ERROR, nil)
		return
	}

	// FIXME 暂时接受重复数据（以后需要修改再看吧）
	audioName := r.FormValue("name")
	audioSze := r.FormValue("size")
	audioUrl := r.FormValue("url")

	if len(audioName) <= 0 || len(audioUrl) <= 0 {
		configs.ReturnJson(w, configs.PARAM_ERROR_CODE, configs.PARAM_ERROR, nil)
		return
	}

	audioSortLast := models.Audio{}

	if _, err := configs.Engine.Desc("sort_by").Get(&audioSortLast); err != nil {
		configs.ReturnJson(w, configs.SERVER_DB_INSERT_ERR_CODE, configs.SERVER_DB_INSERT_ERR, nil)
		return
	}

	// 获取音频长度信息
	resp, err := http.Get(audioUrl + "?avinfo")
	if err != nil {
		configs.ReturnJson(w, configs.SERVER_GET_MEDIA_INFO_ERR_CODE, configs.SERVER_GET_MEDIA_INFO_ERR, nil)
		return
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		configs.ReturnJson(w, configs.SERVER_JX_MEDIA_INFO_ERR_CODE, configs.SERVER_JX_MEDIA_INFO_ERR, nil)
		return
	}

	js, err := simplejson.NewJson(body)
	if err != nil {
		configs.ReturnJson(w, configs.SERVER_JX_MEDIA_INFO_ERR_CODE, configs.SERVER_JX_MEDIA_INFO_ERR, nil)
		return
	}

	duration := js.Get("format").Get("duration").MustString()

	audio := models.Audio{
		Title:    audioName,
		Size:     audioSze,
		Url:      audioUrl,
		SortBy:   audioSortLast.SortBy + 1,
		Duration: duration,
	}

	if _, err := configs.Engine.Insert(&audio); err == nil {
		configs.ReturnJson(w, configs.SUCCESS_CODE, configs.SUCCESS, audio)
	} else {
		configs.ReturnJson(w, configs.SERVER_DB_INSERT_ERR_CODE, configs.SERVER_DB_INSERT_ERR, nil)
	}
}

// 删除音频
func AudioDel(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	filter := filters.Filter{Request: r}
	if !filter.AdminFilter() {
		configs.ReturnJson(w, configs.PERMISSION_ERROR_CODE, configs.PERMISSION_ERROR, nil)
		return
	}
	r.ParseForm()
	ids := new([]string)
	if len(r.Form["ids[]"]) > 0 {
		*ids = r.Form["ids[]"]
	} else {
		*ids = r.Form["ids"]
	}
	uTable := utils.TableModel{Name: "audio"}
	ret := uTable.Del_mutil_by_ids(*ids)
	configs.ReturnJson(w, ret.Code, ret.Msg, ret.Data)
}

// 排序
func AudioSort(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	filter := filters.Filter{Request: r}
	if !filter.AdminFilter() {
		configs.ReturnJson(w, configs.PERMISSION_ERROR_CODE, configs.PERMISSION_ERROR, nil)
		return
	}
	r.ParseForm()
	sorts := r.Form["sorts[]"]
	uTable := utils.TableModel{Name: "audio"}
	ret := uTable.Sorts(sorts)
	configs.ReturnJson(w, ret.Code, ret.Msg, ret.Data)
}

// 修改标题

func AudioTitle(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {

	filter := filters.Filter{Request: r}
	if !filter.AdminFilter() {
		configs.ReturnJson(w, configs.PERMISSION_ERROR_CODE, configs.PERMISSION_ERROR, nil)
		return
	}

	r.ParseForm()
	id := r.Form["id"][0]
	title := r.Form["title"][0]
	uTable := utils.TableModel{Name: "audio"}
	ret := uTable.SetTitle(id, title)
	configs.ReturnJson(w, ret.Code, ret.Msg, ret.Data)

	// r.ParseForm()
	// audioId := strings.TrimSpace(r.Form["id"][0])
	// audioTitle := strings.TrimSpace(r.Form["title"][0])
	// if audioId == "" || audioTitle == "" {
	// 	configs.ReturnJson(w, configs.PARAM_ERROR_CODE, configs.PARAM_ERROR, nil)
	// 	return
	// }
	// if _, err := configs.Engine.Exec("update audio set title = ? where id = ?", audioTitle, audioId); err != nil {
	// 	configs.ReturnJson(w, configs.SERVER_DB_UPDATE_ERR_CODE, configs.SERVER_DB_UPDATE_ERR, nil)
	// 	return
	// }
	// configs.ReturnJson(w, configs.SUCCESS_CODE, configs.SUCCESS, nil)

}
