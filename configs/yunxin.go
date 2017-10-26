package configs

import (
	"crypto/sha1"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"
)

const (
	YUN_KEY    = "ccf3cf4470a43a9aa63889e61ff0ee32"
	YUN_SECRET = "83f239a310fc"
)

type YunData struct {
	Code int    `josn:"code"`
	Msg  string `josn:"msg"`
}

// POST https://api.netease.im/sms/sendcode.action HTTP/1.1
// Content-Type:application/x-www-form-urlencoded;charset=utf-8
func SendCode(phone string) YunData {
	postValue := url.Values{}
	postValue.Set("mobile", phone)
	return httpReq("https://api.netease.im/sms/sendcode.action", postValue.Encode())
}

func CheckCode(phone string, code string) YunData {
	postValue := url.Values{}
	postValue.Set("mobile", phone)
	postValue.Set("code", code)
	return httpReq("https://api.netease.im/sms/verifycode.action", postValue.Encode())
}

func httpReq(url string, params string) YunData {
	client := &http.Client{}
	req, err := http.NewRequest("POST", url, strings.NewReader(params))
	if err != nil {
		return YunData{500, "system error"}
	}
	t := time.Now()
	timestamp := strconv.FormatInt(t.UTC().UnixNano(), 10)
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8")
	req.Header.Set("AppKey", YUN_KEY)
	req.Header.Set("Nonce", timestamp+"123")
	req.Header.Set("CurTime", timestamp)
	req.Header.Set("CheckSum", sh1Params(YUN_SECRET+timestamp+"123"+timestamp))
	resp, err := client.Do(req)
	if err != nil {
		return YunData{500, "system error"}
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)

	if err != nil {
		return YunData{500, "system error"}
	}
	var data YunData
	json.Unmarshal([]byte(body), &data)
	return data
}

func sh1Params(data string) string {
	t := sha1.New()
	io.WriteString(t, data)
	return fmt.Sprintf("%x", t.Sum(nil))
}
