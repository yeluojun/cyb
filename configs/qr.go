package configs

import (
	"image/png"
	"os"

	"github.com/boombuler/barcode"
	"github.com/boombuler/barcode/qr"
)

// create 二维码
func QrCreate(phone string) string {
	qrCode, _ := qr.Encode(phone+"下载个挪车宝扫下吧!", qr.M, qr.Auto)

	// Scale the barcode to 200x200 pixels
	qrCode, _ = barcode.Scale(qrCode, 200, 200)

	// create the output file
	str := "./statics/qr/phone" + phone + ".png"
	strS := "/statics/qr/phone" + phone + ".png"
	file, _ := os.Create(str)

	defer file.Close()
	png.Encode(file, qrCode)
	return strS
}
