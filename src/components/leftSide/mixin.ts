export default function () {
  // 图片转为PIXI可用格式
  const getFileToUrl = (event: any, cb: any) => {
    const files = event.target.files;
    let filename = files[0].name;
    if (filename.lastIndexOf(".") <= 0) {
      return alert("请选择正确的图片文件");
    }
    const fileReader = new FileReader();
    fileReader.addEventListener("load", () => {
      // 获取图片长宽
      const img: any = new Image();
      img.src = fileReader.result;

      img.onload = () => {
        cb(fileReader.result, img);
      };
    });
    fileReader.readAsDataURL(files[0]);
  };
  return {
    getFileToUrl,
  };
}
