import Image from "./image";
import Text from "./text";
export default (app: any) => {
  return {
    app,
    image: () => new Image(app),
    text: () => new Text(app),
  };
};
