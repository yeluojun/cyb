package utils

import (
	"fmt"
	"regexp"
)

func CheckPhone(phone string) bool {
	if len(phone) <= 0 {
		return false
	}
	fmt.Println(phone)
	regular := "^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\\d{8}$"
	reg := regexp.MustCompile(regular)
	fmt.Println("丢磊螺母")
	return reg.MatchString(phone)
}

func CheckYzm(phone string) bool {
	return true
}
