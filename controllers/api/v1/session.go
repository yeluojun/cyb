package v1

import (
	"cyb/configs"
	"cyb/controllers/utils"
	"cyb/models"
	"encoding/base64"
	"net/http"
	"time"

	"github.com/julienschmidt/httprouter"
	uuid "github.com/satori/go.uuid"
)

type Token struct {
	Token string `json: "token"`
}

// 注册
func SignUp(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	r.ParseForm() //解析参数，默认是不会解析的
	phone := r.FormValue("phone")
	// code := r.FormValue("code")
	// if !utils.CheckPhone(phone) {
	// 	configs.ReturnJson(w, configs.PARAM_PHONE_ERROR_CODE, configs.PARAM_PHONE_ERROR, nil)
	// 	return
	// }

	// if configs.CheckCode(phone, code).Code != 200 {
	// 	configs.ReturnJson(w, configs.PARAM_YZM_ERROR_CODE, configs.PARAM_YZM_ERROR, nil)
	// 	return
	// }

	user := &models.User{
		Nickname: r.FormValue("username"),
		Password: r.FormValue("password"),
		Role:     0,
		Phone:    phone,
		Qr:       configs.QrCreate(base64.StdEncoding.EncodeToString([]byte(phone))),
	}

	has, err := configs.Engine.Get(&models.User{Phone: phone})

	if err != nil {
		configs.RetText(w, "other")
		return
	}
	if has {
		configs.RetText(w, "exist")
		return
	}

	if _, err := configs.Engine.Insert(user); err == nil {
		configs.RetText(w, "ok")
		// configs.ReturnJson(w, configs.SUCCESS_CODE, configs.SUCCESS, models.User{Id: user.Id, Nickname: user.Nickname, Phone: user.Phone, Qr: user.Qr})
	} else {
		configs.RetText(w, "other")
		// configs.ReturnJson(w, configs.SERVER_DB_INSERT_ERR_CODE, configs.SERVER_DB_INSERT_ERR, nil)
	}
}

func SignIn(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	r.ParseForm()
	user := &models.User{
		Phone:    r.FormValue("phone"),
		Password: r.FormValue("password"),
	}

	has, err := configs.Engine.Get(user)

	if err != nil {
		// configs.ReturnJson(w, configs.SERVER_ERROR_CODE, configs.SERVER_ERROR, nil)
		configs.RetText(w, "error")
		return
	}

	if !has {
		// configs.ReturnJson(w, configs.USER_OR_PWD_ERROR_CODE, configs.USER_OR_PWD_ERROR, nil)
		configs.RetText(w, "no exists")
		return
	}

	u1 := []byte("yeluojun" + uuid.NewV4().String())
	token := base64.StdEncoding.EncodeToString(u1)
	configs.GlobalRedis.Set(token, user.Id, time.Second*3600*24)

	// configs.ReturnJson(w, configs.SUCCESS_CODE, configs.SUCCESS, Token{token})
	configs.RetText(w, "ok")
}

func SignOut(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	r.ParseForm()
	token := r.FormValue("token")
	configs.GlobalRedis.Del(token)
	configs.ReturnJson(w, configs.SUCCESS_CODE, configs.SUCCESS, nil)
}

func SendCode(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	r.ParseForm()
	phone := r.FormValue("phone")
	if !utils.CheckPhone(phone) {
		configs.ReturnJson(w, configs.PARAM_PHONE_ERROR_CODE, configs.PARAM_PHONE_ERROR, nil)
		return
	}
	data := configs.SendCode(phone)

	configs.ReturnJson(w, data.Code, data.Msg, nil)
}

// 重置密码
func Reset(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	r.ParseForm()
	phone := r.FormValue("phone")
	// code := r.FormValue("code")
	pwd := r.FormValue("password")

	// use exists？
	user := &models.User{
		Phone: phone,
	}

	has, err := configs.Engine.Get(user)

	if err != nil {
		// configs.ReturnJson(w, configs.SERVER_ERROR_CODE, configs.SERVER_ERROR, nil)
		configs.RetText(w, "other")
		return
	}

	if !has {
		// configs.ReturnJson(w, configs.USER_NO_EXISTS_CODE, configs.USER_NO_EXISTS, nil)
		configs.RetText(w, "not exist")
		return
	}

	// if configs.CheckCode(phone, code).Code != 200 {
	// 	configs.ReturnJson(w, configs.PARAM_YZM_ERROR_CODE, configs.PARAM_YZM_ERROR, nil)
	// 	return
	// }

	user.Password = pwd

	// _, err = configs.Engine.Update(user)
	_, err = configs.Engine.Exec("update user set password = ? where phone = ?", pwd, phone)

	if err != nil {
		// configs.ReturnJson(w, configs.SERVER_ERROR_CODE, configs.SERVER_ERROR, nil)
		configs.RetText(w, "other")
		return
	}
	configs.RetText(w, "ok")
	// configs.ReturnJson(w, configs.SUCCESS_CODE, configs.SUCCESS, nil)
}
