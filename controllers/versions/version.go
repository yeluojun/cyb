package versions

import (
	"cyb/configs"
	"cyb/controllers/filters"
	"cyb/controllers/utils"
	"cyb/models"
	"fmt"
	"html/template"
	"io"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/julienschmidt/httprouter"
	"github.com/lunny/axmlParser"
)

type AllAppVersions struct {
	Android    []models.AppVersion
	Ios        []models.AppVersion
	Blank      func([]models.AppVersion) bool
	AndroidNum string
	IosNum     string
	TimeFormat func(time.Time) string
}

func IfBlank(appversions []models.AppVersion) bool {
	if len(appversions) <= 0 {
		return true
	}
	return false
}

func TimeF(t time.Time) string {
	return t.Format("2006-01-02 15:04:05")
}

func Versions(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	filter := filters.Filter{Request: r}
	if !filter.AdminFilter() {
		http.Redirect(w, r, "/manager/login", http.StatusSeeOther)
		return
	}
	r.ParseForm()
	t, err := template.ParseFiles(
		"./views/manager/layout.html",
		"./views/manager/version/versions.html",
		"./views/manager/items/upload.html",
		"./views/manager/items/upload_apk.html",
	)

	// 查找所有版本
	var allAppVersion []models.AppVersion
	err = configs.Engine.Desc("id").Find(&allAppVersion)
	if err != nil {
		configs.WriteLog("error", err.Error())
		fmt.Fprintln(w, "sorry, but something error")
		return //step 2
	}

	var androidVersions []models.AppVersion
	var iosVersions []models.AppVersion

	for _, v := range allAppVersion {
		if v.DType == 0 {
			androidVersions = append(androidVersions, v)
		} else {
			iosVersions = append(iosVersions, v)
		}
	}
	var androidNum, iosNum = "暂无", "暂无"
	if len(androidVersions) > 0 {
		androidNum = androidVersions[0].Number
	}
	if len(iosVersions) > 0 {
		iosNum = iosVersions[0].Number
	}

	appVersions := AllAppVersions{Android: androidVersions, Ios: iosVersions, Blank: IfBlank, AndroidNum: androidNum, IosNum: iosNum, TimeFormat: TimeF}

	e := t.Execute(w, appVersions)

	if err != nil {
		configs.WriteLog("error", e)
	}
}

func VersionUpdate(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	// 身份校验
	filter := filters.Filter{Request: r}
	if !filter.AdminFilter() {
		http.Error(w, "权限不足", http.StatusForbidden)
		configs.WriteLog("error", "没权限的上传操作")
		return
	}

	var dTypeInt int
	var url string

	r.ParseMultipartForm(32 << 20)
	desc := r.FormValue("desction")
	number := r.FormValue("version")
	size := r.FormValue("size")
	dType := r.FormValue("data_type")

	if len(desc) > 140 || len(number) > 140 || len(size) > 140 || len(dType) > 140 {
		http.Error(w, "参数错误", http.StatusBadRequest)
		configs.WriteLog("error", configs.PARAM_ERROR_CODE)
		configs.WriteLog("error", configs.PARAM_ERROR)
		// configs.ReturnJson(w, configs.PARAM_ERROR_CODE, configs.PARAM_ERROR, nil)
		return
	}

	switch dType {
	case "1":
		dTypeInt = 1
	default:
		dTypeInt = 0
	}

	if dTypeInt == 0 { // Android

		file, handler, err := r.FormFile("android_file")
		if err != nil {
			configs.WriteLog("error", err)
			http.Error(w, "参数错误", http.StatusBadRequest)
			// configs.ReturnJson(w, configs.PARAM_ERROR_CODE, configs.PARAM_ERROR, nil)
			return
		}

		filenameArr := strings.Split(handler.Filename, ".")
		extendName := filenameArr[len(filenameArr)-1]

		if strings.ToLower(extendName) != "apk" {
			http.Error(w, configs.SERVER_FILE_NOT_APK, http.StatusBadRequest)
			configs.WriteLog("error", configs.SERVER_FILE_NOT_APK)
			// configs.ReturnJson(w, configs.SERVER_FILE_NOT_APK_CODE, configs.SERVER_FILE_NOT_APK, nil)
			return
		}

		defer file.Close()

		var version models.AppVersion
		var last_id int64
		tf, err := configs.Engine.Desc("id").Where("d_type = ?", 0).Get(&version)
		if err != nil {
			http.Error(w, configs.SERVER_DB_SELECT_ERR, http.StatusInternalServerError)
			configs.WriteLog("error", err)
			// configs.ReturnJson(w, configs.SERVER_DB_SELECT_ERR_CODE, configs.SERVER_DB_SELECT_ERR, nil)
			return
		}
		if tf {
			last_id = version.Id
		}

		handler.Filename = "dgapp_" + strconv.FormatInt(last_id, 10) + ".apk"
		// fmt.Fprintf(w, "%v", handler.Header)
		f, err := os.OpenFile("./statics/apk/"+handler.Filename, os.O_WRONLY|os.O_CREATE, 0666)
		if err != nil {
			http.Error(w, configs.SERVER_FILE_CREATE_ERR, http.StatusInternalServerError)
			configs.WriteLog("error", err)
			return
		}

		defer f.Close()

		_, err = io.Copy(f, file)
		if err != nil {
			http.Error(w, configs.SERVER_FILE_COPY_ERR, http.StatusInternalServerError)
			configs.WriteLog("error", err)
			return
		}

		url = configs.ConfigFile.Read("addrinfo", "apphost") + "/" + "statics/apk/" + handler.Filename

		// 解析版本号
		listener := new(axmlParser.AppNameListener)
		_, err = axmlParser.ParseApk("./statics/apk/"+handler.Filename, listener)
		if err != nil {
			http.Error(w, configs.SERVER_FILE_JX_ERR, http.StatusInternalServerError)
			configs.WriteLog("error", err)
			return
		}

		number = listener.VersionName
	} else { // IOS
		if strings.TrimSpace(number) == "" {
			configs.ReturnJson(w, configs.PARAM_ERROR_CODE, configs.PARAM_ERROR, nil)
			configs.WriteLog("error", configs.PARAM_ERROR_CODE)
			return
		}
	}

	version := models.AppVersion{Url: url, Desction: desc, Number: number, Size: size, DType: dTypeInt}

	if _, err := configs.Engine.Insert(&version); err != nil {
		http.Error(w, configs.SERVER_DB_INSERT_ERR, http.StatusInternalServerError)
		configs.WriteLog("error", err)
	} else {
		configs.ReturnJson(w, configs.SUCCESS_CODE, configs.SUCCESS, version)
	}
}

func VersionDel(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	// 身份校验
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
	uTable := utils.TableModel{Name: "app_version"}
	ret := uTable.Del_mutil_by_ids(*ids)
	configs.ReturnJson(w, ret.Code, ret.Msg, ret.Data)
}
