package users

import (
	"cyb/configs"
	"cyb/controllers/filters"
	"cyb/models"
	"fmt"
	"html/template"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func UserViewGet(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	filter := filters.Filter{Request: r}
	if !filter.AdminFilter() {
		http.Redirect(w, r, "/manager/login", http.StatusSeeOther)
		return
	}

	t, err := template.ParseFiles("./views/manager/layout.html", "./views/manager/user/index.html")

	if err != nil {
		configs.WriteLog("error", err.Error())
		fmt.Fprintln(w, "sorry, but something error")
		return //step 2
	}

	var allUsers []models.User
	err = configs.Engine.Desc("id").Where("role = ?", 0).Find(&allUsers)
	t.Execute(w, allUsers)
}
