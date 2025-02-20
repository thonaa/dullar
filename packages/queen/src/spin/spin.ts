/*
* @Author: Just be free
* @Date:   2020-09-28 11:18:21
* @Last Modified by:   Just be free
* @Last Modified time: 2021-06-10 14:50:01
* @E-mail: justbefree@126.com
*/
import Queen, { mixins, prop, Options } from "../component/Queen";
import { hyphenate } from "@dullar/cube";
import { h, VNode } from "vue";
// export type SpinType = "snake" | "rotate" | "triple-bounce";

class Props {
  type = prop<string>({ default: "snake" })
  size = prop<string|number>({ default: 28 })
  color = prop<string>({ default: "#007aff" })
}
@Options({
  name: "QSpin"
})
export default class QSpin extends mixins(Queen).with(Props) {
  public static componentName = "QSpin";
  createSpinner(): VNode {
    const capitalizeName = hyphenate(this.type);
    let component = "span";
    try {
      component = require(`./shapes/${capitalizeName}/index.ts`)["default"];
    } catch (err) {
      console.warn(`There is no ${capitalizeName} as VgSpin type's value`);
      return h(component, {}, { default: () => [] });
    }
    return h(component, { size: Number(this.size), color: this.color }, { default: () => [] });
  }
  render() {
    return h("span", {}, { default: () => [this.createSpinner()] });
  }
}
