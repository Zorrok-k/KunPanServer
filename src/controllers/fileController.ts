class fileController {
  get(_req: any, res: any, _next: any) {
    res.send("file hello");
  }
}

export default new fileController();
