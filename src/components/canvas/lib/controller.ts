import Image from "./image";
export default (app: any) => {
  return { app, image: new Image(app) };
};
