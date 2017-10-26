// 登陆模块
package sessions

import (
	"cyb/configs"
	"cyb/controllers/filters"
	"cyb/models"
	"fmt"
	"html/template"
	"net/http"
	"strings"

	"github.com/julienschmidt/httprouter"
)

// func SayhelloName(w http.ResponseWriter, r *http.Request) {
// 	fmt.Fprintf(w, "Hello world!") //这个写入到w的是输出到客户端的
// }

func LoginGet(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	// fmt.Fprintf(w, "Hello world!") //这个写入到w的是输出到客户端的
	t, err := template.ParseFiles("./views/manager/login.html")
	if err != nil {
		fmt.Fprintln(w, "sorry, but something error")
		return
	}
	t.Execute(w, nil)
}

// 登入
func Login(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	// 参数解析
	r.ParseForm() //解析参数，默认是不会解析的
	username := r.FormValue("username")
	pwd := r.FormValue("password")

	user := &models.User{
		Nickname: username,
		Password: pwd,
		Role:     1,
	}

	has, err := configs.Engine.Get(user)

	if err != nil {
		configs.ReturnJson(w, configs.SERVER_ERROR_CODE, configs.SERVER_ERROR, nil)
		return
	}

	if !has {
		configs.ReturnJson(w, configs.USER_OR_PWD_ERROR_CODE, configs.USER_OR_PWD_ERROR, nil)
		return
	}

	session, serr := configs.Store.Get(r, "sessionId")

	if serr != nil {
		configs.ReturnJson(w, configs.SERVER_ERROR_CODE, configs.SERVER_ERROR, nil)
		return
	}

	// 保存session
	session.Values["UID"] = user.Id
	session.Values["ROLE"] = user.Role
	session.Save(r, w)

	// 返回数据前台
	configs.ReturnJson(w, configs.SUCCESS_CODE, configs.SUCCESS, nil)
}

// 登出
func Logout(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	session, serr := configs.Store.Get(r, "sessionId")
	if serr != nil {
		configs.ReturnJson(w, configs.SERVER_ERROR_CODE, configs.SERVER_ERROR, nil)
		return
	}
	session.Options.MaxAge = -1
	session.Save(r, w)
	configs.ReturnJson(w, configs.SUCCESS_CODE, configs.SUCCESS, nil)
}

// 修改密码
func ChangePwd(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	r.ParseForm()
	new_pwd := r.FormValue("new_pwd")
	old_pwd := r.FormValue("old_pwd")

	// 参数校验
	if strings.TrimSpace(old_pwd) == "" || strings.TrimSpace(new_pwd) == "" {
		configs.ReturnJson(w, configs.PARAM_ERROR_CODE, configs.PARAM_ERROR, nil)
		return
	}

	fmt.Println(new_pwd, old_pwd)

	filter := filters.Filter{Request: r}
	if filter.LoginFilter() {
		user := &models.User{
			Password: r.FormValue("old_pwd"),
			Id:       filter.UserId.(int64),
		}
		if has, err := configs.Engine.Get(user); err == nil {
			if has {
				_, err := configs.Engine.Exec("update user set password = ? ", r.FormValue("new_pwd"))
				if err != nil {
					configs.ReturnJson(w, configs.SERVER_DB_UPDATE_ERR_CODE, configs.SERVER_DB_UPDATE_ERR, nil)
					return
				} else {
					configs.ReturnJson(w, configs.SUCCESS_CODE, configs.SUCCESS, nil)
				}
			} else {
				configs.ReturnJson(w, configs.OLD_PWD_ERROR_CODE, configs.OLD_PWD_ERROR, nil)
			}
		} else {
			configs.ReturnJson(w, configs.SERVER_DB_SELECT_ERR_CODE, configs.SERVER_DB_SELECT_ERR, nil)
			return
		}
	} else {
		configs.ReturnJson(w, configs.PERMISSION_ERROR_CODE, configs.PERMISSION_ERROR, nil)
	}
}
