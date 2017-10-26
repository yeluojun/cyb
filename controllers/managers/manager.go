package managers

import (
	"fmt"
	"html/template"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

type Person struct {
	UserName string
}

func ManagerIndexGet(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	// filter := filters.Filter{Request: r}

	// 判断不是管理员
	// if !filter.AdminFilter() {
	// 	http.Redirect(w, r, "/manager/login", http.StatusSeeOther)
	// 	return
	// }

	t, err := template.ParseFiles("./views/manager/layout.html")
	t.New("content").Parse(`{{.}}`)
	if err != nil {
		fmt.Fprintln(w, "sorry, but something error")
		return
	}
	t.Execute(w, nil)
}
