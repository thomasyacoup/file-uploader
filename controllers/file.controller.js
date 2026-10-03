class FileController {
  async getUploadPage(req, res, next) {
    try {
      res.render("file-new", { errors: [], oldInput: {} });
    } catch (error) {
      next(error);
    }
  }

  async uploadFile(req, res, next) {
    try {
      const { file } = req;
      console.log(file);
    } catch (error) {
      next(error);
    }
  }
}

export default FileController;
