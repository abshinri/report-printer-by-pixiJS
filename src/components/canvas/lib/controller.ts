import Image from "./image";
import Text from "./text";
export default (app: any, containers: any) => {
  return {
    app,
    image: () => new Image(app, containers),
    text: () => new Text(app, containers),
    containers,
  };
};
