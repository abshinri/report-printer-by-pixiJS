import Image from "./image";
import Text from "./text";
export default (app: any, layer: any) => {
  return {
    app,
    layer,
    image: () => new Image(app, layer),
    text: () => new Text(app, layer),
  };
};
