package v1

import (
	"net/http"
	"strconv"
	"strings"
)

type DataRet struct {
	Data   interface{}
	Counts int64
}

type PageParams struct {
	Page   int
	Per    int
	All    string
	IfTure bool
}
type SortByIdParams struct {
	LastSortBy int
	Per        int
	Direction  string
	LeftAll    string
	All        string
	IfTure     bool
}

// TODO unfinished
func GetDataWithPageParamCheck(r *http.Request) PageParams {
	r.ParseForm()
	page := r.FormValue("page")
	per := r.FormValue("per")
	all := r.FormValue("all")

	if all != "1" {
		all = "0"
	}

	if strings.TrimSpace(page) == "" {
		page = "1"
	}
	if strings.TrimSpace(per) == "" {
		per = "20"
	}

	pageInt, err1 := strconv.Atoi(page)
	perInt, err2 := strconv.Atoi(per)

	if err1 != nil || err2 != nil || pageInt <= 0 || perInt <= 0 {
		return PageParams{IfTure: false}
	}
	return PageParams{Page: pageInt, Per: perInt, All: all, IfTure: true}
}

func GetDataWithSortByLastId(r *http.Request) SortByIdParams {
	r.ParseForm()
	lastSortBy := r.FormValue("last_sort_by")
	per := r.FormValue("per")
	direction := r.FormValue("direction")
	leftAll := r.FormValue("left_all")
	all := r.FormValue("all")

	if direction != "-1" {
		direction = "0"
	}

	if leftAll != "1" {
		leftAll = "0"
	}

	if all != "1" {
		all = "0"
	}

	if strings.TrimSpace(per) == "" {
		per = "20"
	}

	if strings.TrimSpace(lastSortBy) == "" {
		lastSortBy = "0"
	}

	lastSortByInt, err1 := strconv.Atoi(lastSortBy)
	perInt, err2 := strconv.Atoi(per)

	if err1 != nil || err2 != nil || lastSortByInt < 0 {
		return SortByIdParams{IfTure: false}
	}
	return SortByIdParams{LastSortBy: lastSortByInt, Per: perInt, Direction: direction, LeftAll: leftAll, All: all, IfTure: true}
}
