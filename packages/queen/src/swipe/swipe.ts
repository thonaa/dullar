/*
* @Author: Just be free
* @Date:   2020-11-25 14:11:49
* @Last Modified by:   Just be free
* @Last Modified time: 2021-06-07 16:37:35
* @E-mail: justbefree@126.com
*/
import Queen, { mixins, prop, Options, VisibilityChangeStatus } from "../component/Queen";
import { h, VNode } from "vue";
import { Remainder } from "../utils/number/remainder";
import { move } from "../utils/dom/animate";
import { EventBus } from "../utils/event/bus";
import { EventEmulator, EventCallbackOptions } from "../component/EventEmulator";
const VALID_CHILD_COMPONENT = "QSwipeItem";
class Props {
  vertical?: boolean
  autoPlay = prop<string|number>({
    default: 3000
  })
  showIndicator = prop<boolean>({ default: true })
  indicatorType = prop<string>({ default: "dashed" })
  height = prop<string|number>({ default: 240 })
  loadingText = prop<string>({ default: "图片加载中..." })
}

@Options({
  name: "QSwipe",
  provide() {
    return {
      swipeParent: this
    }
  },
  computed: {
    size() {
      return this.vertical ? this.height : this.width;
    },
    swipeStyle() {
      return {
        height: `${this.height}px`
      };
    }
  }
})
export default class QSwipe extends mixins(Queen, EventEmulator).with(Props) {
  public static componentName = "QSwipe";
  public rect = {} as DOMRect;
  public width = 0;
  public count = 0;
  public timer: number = -1;
  public activedIndex = 0;
  public delayActivedIndex = 0;
  public moving = false;
  public dragging = false;
  public children = [] as Element[];
  public fullScreen = false;
  public R = new Remainder();
  creteIndicator(counts: number): VNode|null {
    const { showIndicator, indicatorType, delayActivedIndex } = this;
    if (showIndicator) {
      let type = [] as VNode[];
      if (indicatorType === "number") {
        type = [
          h(
            "span",
            { class: ["index"] },
            { default: () => `${delayActivedIndex + 1}/${counts}` }
          )
        ];
      } else {
        type = Array.apply(null, new Array(counts)).map((i: any, key: number, arr: any[]) => {
          return h(
            "i",
            {
              class: [
                "indicator-dot",
                Math.abs(delayActivedIndex) === key ? "active" : ""
              ]
            },
            { default: () => [] }
          );
        });
      }
      return h(
        "div",
        {
          class: [
            "q-swipe-indicators",
            indicatorType,
            this.vertical ? "vertical" : "horizontal"
          ]
        },
        { default: () => type }
      );
    }
    return null;
  }
  initRect(): void {
    this.rect = this.$el.getBoundingClientRect();
  }
  drag(): void {
    const el = this.$refs.swipeContainer;
    if (!el) {
      return;
    }
    let prevEle: null|HTMLElement = null;
    let curEle: null|HTMLElement = null;
    let num = 1;
    let nextEle: null|HTMLElement = null;
    let moving = false;
    const that = this;
    let r: null|Remainder = null;
    let startTime = 0;
    this.bindEvent(el as EventTarget, {
      start() {
        that.stop();
        that.dragging = true;
        startTime = Date.now();
      },
      dragging() {
        if (moving) {
          return;
        }
        if (!r) {
          if (
            (!that.vertical && that.deltaX < 0) ||
            (that.vertical && that.deltaY < 0)
          ) {
            r = that.R.next((index: number) => {
              that.activedIndex = index;
            });
            num = 1;
          } else if (
            (!that.vertical && that.deltaX > 0) ||
            (that.vertical && that.deltaY > 0)
          ) {
            r = that.R.previous((index: number) => {
              that.activedIndex = index;
            });
            num = -1;
          } else {
            return;
          }
        }
        const attr = that.vertical ? "top" : "left";
        const value = that.vertical ? that.deltaY : that.deltaX;
        prevEle = that.children[(r as Remainder).getPrevious()] as HTMLElement;
        curEle = that.children[(r as Remainder).getIndex()] as HTMLElement;
        nextEle = that.children[(r as Remainder).getNext()] as HTMLElement;
        (prevEle as HTMLElement).setAttribute("style", `${attr}: ${value}px`);
        (curEle as HTMLElement).setAttribute("style", `${attr}: ${num * that.size + value}px`);
      },
      stop() {
        that.paly();
        that.dragging = false;
        that.delayActivedIndex = that.activedIndex;
        const disXY = that.vertical ? that.deltaY : that.deltaX;
        const timeDiff = Date.now() - startTime;
        // if (timeDiff < 200 && disXY === 0) {
        //   that.openImageViewer();
        //   return;
        // }
        if (moving || disXY === 0 || !prevEle || !curEle || !nextEle) {
          return;
        }
        const attr = that.vertical ? "top" : "left";
        moving = true;
        that.startMove(prevEle, -1 * num * that.size);
        (curEle as HTMLElement).setAttribute("style", `${attr}: ${num * that.size}px`);
        (nextEle as HTMLElement).setAttribute("style", `${attr}: ${num * that.size}px`);
        that.startMove(curEle, 0, () => {
          moving = false;
          prevEle = null;
          curEle = null;
          nextEle = null;
          r = null;
        });
      }
    });
  }
  updateActivedIndex(num: number, callback?: Function): void {
    // 正在运动的时候不允许连续点击
    if (this.moving) {
      return;
    }
    this.moving = true;
    const method = (num > 0) ? "next" : "previous";
    const r = this.R[method]((index: number) => {
      this.activedIndex = index;
    });
    this.delayActivedIndex = this.activedIndex;
    const prevEle = this.children[r.getPrevious()] as HTMLElement;
    const curEle = this.children[r.getIndex()] as HTMLElement;
    const nextEle = this.children[r.getNext()] as HTMLElement;
    const attr = this.vertical ? "top" : "left";
    this.startMove(prevEle, -1 * num * this.size);
    (curEle as HTMLElement).setAttribute("style", `${attr}: ${num * this.size}px`);
    this.startMove(curEle, 0, (el: HTMLElement) => {
      this.moving = false;
      callback && typeof callback === "function" && callback(el);
    });
    (nextEle as HTMLElement).setAttribute("style", `${attr}: ${num * this.size}px`);
  }
  startMove(el: HTMLElement, value = 0, fn?: Function): void {
    if (!el) {
      return;
    }
    const { vertical } = this;
    const attr = vertical ? "top" : "left";
    move(el, { [attr]: value }, () => {
      fn && typeof fn === "function" && fn.call(this, el);
    });
  }
  paly() {
    if (Number(this.autoPlay) > 0 && this.children.length > 1) {
      this.stop();
      this.timer = setTimeout(() => {
        this.updateActivedIndex(1);
        this.paly();
      }, Number(this.autoPlay));
    }
  }
  stop() {
    clearTimeout(this.timer);
  }
  next() {
    this.stop();
    this.updateActivedIndex(1, () => {
      this.paly();
    });
  }
  prev() {
    this.stop();
    this.updateActivedIndex(-1, () => {
      this.paly();
    });
  }
  initialize(): void {
    if (this.$el) {
      this.width = Math.round(this.rect.width);
    }
    const el = this.$refs.swipeContainer;
    this.children = Array.from((el as HTMLElement).children);
    const attr = this.vertical ? "top" : "left";
    this.children.forEach((child, key) => {
      if (key === this.activedIndex) {
        (child as HTMLElement).style[attr] = "0px";
      } else {
        (child as HTMLElement).style[attr] = `${this.size}px`;
      }
    });
    this.paly();
  }
  visibilityChange() {
    EventBus.on("window:visibilitychange", (status: VisibilityChangeStatus) => {
      if (status === "visible") {
        this.paly();
      } else {
        this.stop();
      }
    });
  }
  resize() {
    EventBus.on("window:resize", (ev: Event) => {
      this.initRect();
      this.width = this.rect.width;
    });
  }
  beforeMount() {
    this.bindVisibilityChange();
    this.bindResize();
  }
  mounted() {
    this.R = new Remainder(this.count, this.activedIndex);
    this.initRect();
    this.initialize();
    this.drag();
    this.visibilityChange();
    this.resize();
  }
  beforeUnmount() {
    this.unbindVisibilityChange();
    this.unbindResize();
  }
  render() {
    const slots = this.getCustomSlotsByTagName(VALID_CHILD_COMPONENT);
    this.count = slots.length;
    return h(
      "div",
      { class: ["q-swipe"], style: this.swipeStyle },
      {
        default: () => [
          h(
            "div",
            {
              style: { width: `${this.width}px`, height: `${this.height}px` },
              class: ["q-swipe-list-container"],
              ref: "swipeContainer"
            },
            { default: () => slots }
          ),
          this.creteIndicator(this.count)
        ]
      }
    )
  }
}
