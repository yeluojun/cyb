// 过滤器
package filters

import (
	"cyb/configs"
	"net/http"
)

type Filter struct {
	IsLogin bool // 是否登陆
	isAdmin bool // 是否管理员
	Request *http.Request
	UserId  interface{}
}

// 登陆过滤
func (f *Filter) LoginFilter() bool {
	f.IsLogin = false
	f.isAdmin = false

	session, serr := configs.Store.Get(f.Request, "sessionId")

	if serr != nil {
		return false
	}

	if session == nil || session.Values["UID"] == nil {
		return false
	}

	if session.Values["ROLE"] == 1 {
		f.isAdmin = true
	}

	f.UserId = session.Values["UID"]

	return true
}

// 管理员过滤
func (f *Filter) AdminFilter() bool {
	if f.LoginFilter() && f.isAdmin {
		return true
	}
	return false
}

// 其他过滤
