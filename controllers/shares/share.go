package shares

import (
	"cyb/configs"
	"cyb/models"
	"fmt"
	"html/template"
	"net/http"
	"strconv"

	"github.com/julienschmidt/httprouter"
)

func Index(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	idStr := ps.ByName("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil || id <= 0 {
		fmt.Fprintln(w, "参数错误")
		return
	}
	video := models.Video{Id: id}
	_, err = configs.Engine.Get(&video)
	if err != nil {
		fmt.Fprintln(w, "系统异常，错误代码："+strconv.Itoa(configs.SERVER_DB_SELECT_ERR_CODE))
		return
	}
	templeteStr := "./views/share/index.html"
	t, err := template.ParseFiles(templeteStr)
	if err != nil {
		fmt.Fprintln(w, "sorry, but something error")
		configs.WriteLog("error", err)
		return
	}
	err = t.Execute(w, video)
	if err != nil {
		fmt.Println(err)
	}
}
