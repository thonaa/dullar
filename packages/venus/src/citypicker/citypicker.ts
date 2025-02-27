/*
* @Author: Just be free
* @Date:   2020-10-22 14:42:19
* @Last Modified by:   Just be free
* @Last Modified time: 2021-06-24 18:19:23
* @E-mail: justbefree@126.com
*/

import { h, withDirectives, vShow, VNode, nextTick } from "vue";
import Queen, { mixins, prop, Options } from "../component/Queen";
import { isChineseCharacters, isPromise, throttle } from "@dullar/cube";
import { getPropertyValue } from "../utils/dom/style";
import { EventBus } from "../utils/event/bus";
import VFlex from "../flex";
import VFlexItem from "../flex-item";
import VPopup from "../popup";
import VIcon from "../icon";
import VSpin from "../spin";
interface AnyObject {
  [propName: string]: any;
}
const CACHED_ALPHA_BETA = {} as AnyObject;
export interface Tab {
  key: string;
  label: string;
  [propName: string]: any;
}
export interface AsyncActionObject {
  params: any;
  action: (e: any, f?: any) => any;
  parse: (e: any, f?: any) => any;
  title?: string;
}
class Props {
  modelValue = prop<boolean>({ default: false })
  title = prop<string>({ default: "标题" })
  column = prop<string|number>({
    default: 4,
    validator: (c: any): boolean => {
      return String(c) === "4" || String(c) === "3";
    }
  })
  parse = prop<(v: any, o?: any) => string>({
    default: () => {
      return (city: any, o?: any) => city.CityName as string;
    }
  })
  limited = prop<boolean>({ default: false })
  limitedData = prop<Array<any>>({ default: () => [] })
  tabs = prop<Array<any>>({
    default: () => {
      return [
        { label: "中国", key: "mainland-china" },
        { label: "非中国大陆(国际/港澳台)", key: "overseas" }
      ]
    }
  })
  searchable = prop<boolean>({ default: true })
  placeholder = prop<string>({ default: "请输入城市名称" })
  showHistory = prop<boolean>({ default: false })
  showHotCity = prop<boolean>({ default: true })
  search = prop<AsyncActionObject>({
    default: () => {
      return {
        params: {},
        action: () => {
          return Promise.resolve();
        },
        parse: (e: any) => {
          return e;
        }
      }
    }
  })
  history = prop<AsyncActionObject>({
    default: () => {
      return {
        params: {},
        action: (e: any) => {
          return Promise.resolve();
        },
        parse: (e: any, f?: any) => {
          return e;
        },
        title: "历史查询"
      }
    }
  })
  hotCity = prop<AsyncActionObject>({
    default: () => {
      return {
        params: {},
        action: () => {
          return Promise.resolve();
        },
        parse: (e: any) => {
          return e;
        },
        title: "热门城市"
      }
    }
  })
  alphaBeta = prop<any>({
    default: () => {
      return {
        params: {},
        action: () => {
          return Promise.resolve();
        },
        parse: (e: any) => {
          return e;
        },
        title: "按字母查询"
      }
    }
  })
}

@Options({
  name: "VCitypicker",
  emits: ["update:modelValue", "pick", "beforeenter", "enter", "afterenter", "beforeleave", "leave", "afterleave"],
  watch: {
    tabs: {
      handler() {
        this.caculatedTabs = [] as Array<Tab>;
        this.tabs.forEach((tab: Tab, index: number) => {
          let active;
          if (index === 0) {
            active = true;
            this.currentTab = tab.key;
          } else {
            active = false;
          }
          this.caculatedTabs.push({ ...tab, active });
        });
      },
      immediate: true
    }
  }
})
export default class VCitypicker extends mixins(Queen).with(Props) {
  public static componentName = "VCitypicker";
  public isCompose = false;
  public caculatedTabs = [] as Array<Tab>;
  public currentTab = "";
  public selectedAlphaBeta = "";
  public alphaBetaCities = [];
  public hotCityList = [];
  public historyList = [];
  public searchList = [];
  public historyLoading = false;
  public alphaBetaLoading = false;
  public hotCityLoading = false;
  public isSearching = false;
  public keywords = "";
  public textBoxWidth = 68;
  createTitle() {
    return h("span", { class: ["v-city-picker-header-title"] }, { default: () => this.title });
  }
  close() {
    this.$emit("update:modelValue", false);
  }
  handlePick(e: any) {
    if (this.isSearching) {
      // 搜索完结果后，点击结果需清空档次搜索记录
      this.clearSearchKeywords();
    }
    this.handleChange(false);
    this.$emit("pick", e);
  }
  clearSearchKeywords(): void {
    this.isSearching = false;
    this.keywords = "";
    (this.$refs.searchInput as HTMLInputElement).value = "";
  }
  handleChange(e: boolean) {
    this.$emit("update:modelValue", e);
  }
  createClose() {
    return h(VIcon,
      {
        class: ["v-city-picker-close"],
        name: "close",
        size: 24,
        onClick: this.close
      },
      { default: () => [] }
    );
  }
  createBlock({ cities, loading }: { cities: any[]; loading: boolean }): VNode {
    if (loading) {
      return h("div", { class: ["v-city-picker-searched-area"] }, {
        default: () => [
          h(VSpin, { type: "tripleBounce", size: 30 }, { default: () => [] })
        ]
      });
    } else {
      return h(VFlex,
        {
          flexWrap: "wrap",
          justifyContent: "spaceBetween",
          class: "v-city-picker-cities",
          ref: "cityBox"
        }, {
        default: () => Array.apply(null, cities).map((city, key) => {
          const text: string = this.parse(city);
          const textLength: number = text.length;
          let fontSize: number|string = this.textBoxWidth / textLength;
          const textOverflow: string[] = [];
          if (fontSize > 14) {
            fontSize = "14px";
          } else if (fontSize < 12) {
            fontSize = "12px";
            if (isChineseCharacters(text)) {
              textOverflow.push(...["text-small", "normal-lineheight"]);
            }
          } else {
            fontSize = `${fontSize}px`;
          }
          return h(VFlexItem,
            {
              key,
              onClick: this.handlePick.bind(this, city),
              style: { fontSize },
              class: ["city-item", `column-${this.column}`,
                // ...this.textOverflow(this.parse(city))
                ...textOverflow
              ]
            },
            { default: () => [h("span", {}, { default: () => this.parse(city) })] }
          );
        })
      });
    }
  }
  createBlockTitle(title: string = ""): VNode {
    return h("div", { class: ["v-city-picker-block-title"] }, {
      default: () => [
        h("span", {}, { default: () => title })
      ]
    });
  }
  createHistoryArea(): VNode[] {
    const result: VNode[] = [];
    if (this.showHistory) {
      if (this.historyList.length > 0) {
        result.push(this.createBlockTitle(this.history.title));
      }
      result.push(this.createBlock({
        cities: this.historyList,
        loading: this.historyLoading
      }))
    }
    return result;
  }
  createHotCityArea(): VNode[] {
    const result: VNode[] = [];
    if (this.showHotCity) {
      result.push(...[
        this.createBlockTitle(this.hotCity.title),
        this.createBlock({
          cities: this.hotCityList,
          loading: this.hotCityLoading
        })
      ]);
    }
    return result;
  }
  setAlphaBetaScrollTop(): void {
    if (this.limited || this.isSearching) {
      return;
    }
    nextTick(() => {
      const scrollElement = (this.$refs[`scrollElement-${this.currentTab}`] as VFlexItem)
        .$el;
      const lastChild: HTMLElement = scrollElement.lastElementChild;
      scrollElement.scrollTop = lastChild.offsetTop;
    });
  }
  handleClickAlphaBeta(e: string) {
    if (this.selectedAlphaBeta === e) {
      return false;
    }
    this.selectedAlphaBeta = e;
    this.alphaBetaCities = [];
    if (CACHED_ALPHA_BETA[e] && CACHED_ALPHA_BETA[e].length) {
      this.alphaBetaLoading = false;
      this.alphaBetaCities = CACHED_ALPHA_BETA[e];
    } else {
      this.alphaBetaLoading = true;
      const params = { ...this.alphaBeta.params, alphaBeta: e };
      const promise = this.alphaBeta.action(params);
      if (isPromise(promise)) {
        promise.then((res: any) => {
          const data = this.alphaBeta.parse(res, params);
          if (data && data.length) {
            CACHED_ALPHA_BETA[e] = data;
            this.alphaBetaCities = data;
            this.setAlphaBetaScrollTop();
          }
          this.alphaBetaLoading = false;
        });
      } else {
        console.error("The action of alphaBeta's attribute must be a Promise type!");
      }
    }
  }
  createAlphaBeta(): VNode[] {
    return [
      this.createBlockTitle(this.alphaBeta.title),
      h(VFlex,
        {
          flexWrap: "wrap",
          justifyContent: "spaceBetween",
          class: ["v-city-picker-alpha-beta"]
        },
        {
          default: () => Array.apply(null, new Array(26)).map((i, key) => {
            const char = String.fromCharCode(65 + key);
            return h(VFlexItem,
              {
                onClick: this.handleClickAlphaBeta.bind(this, char),
                class: [
                  "alpha-beta",
                  this.selectedAlphaBeta === char ? "active" : ""
                ]
              },
              { default: () => char }
            );
          })
        }
      )
    ];
  }
  createSearchedArea(): VNode {
    return this.createBlock({
      cities: this.alphaBetaCities,
      loading: this.alphaBetaLoading
    });
  }
  createBodyArea(): VNode[] {
    const body: VNode[] = [];
    body.push(...this.createHistoryArea());
    body.push(...this.createHotCityArea());
    body.push(...this.createAlphaBeta());
    body.push(this.createSearchedArea());
    return body;
  }
  createInputSearchList(): VNode {
    return h(
      "ul",
      {},
      {
        default: () => Array.apply(null, this.searchList).map((list, key) => {
          const innerHTML = this.parse(list, "search-result").replace(
            new RegExp(this.keywords, "ig"),
            `<i>${this.keywords}</i>`
          );
          return h("li", { key, onClick: this.handlePick.bind(this, list) }, {
            default: () => [
              h("span", { innerHTML }, { default: () => [] })
            ]
          });
        })
      }
    );
  }
  clearSearchResult(): void {
    this.searchList = [];
  }
  handleTabSwitch(ctab: Tab): void {
    if (ctab.active) {
      return;
    }
    this.clearSearchResult();
    this.caculatedTabs.forEach((tab: Tab) => {
      if (tab.key === ctab.key) {
        tab.active = true;
        if (this.showHistory) {
          this.getHistory(tab.key);
        }
        if (!this.limited && this.showHotCity) {
          this.getHotCity(tab.key);
        }
      } else {
        tab.active = false;
      }
    });
    this.currentTab = ctab.key;
  }
  handleOnSearch(e: any) {
    if (this.isCompose) return;
    throttle(this.searchRequest)(e);
  }
  searchRequest(e: InputEvent) {
    const value = (e.target as HTMLInputElement).value.trim();
    this.keywords = value;
    if (value) {
      this.isSearching = true;
    } else {
      this.isSearching = false;
      this.clearSearchResult();
      // 内容为空， 不搜索
      return;
    }
    const params = { ...this.search.params, tab: this.currentTab, value };
    const promise = this.search.action(params);
    promise
      .then((res: any) => {
        const data = this.search.parse(res, params);
        if (data && data.length) {
          this.searchList = data;
        }
      })
      .catch((err: any) => {
        this.clearSearchResult();
        if (err.errmsg) {
          this.Toast(err.errmsg);
        } else {
          this.print(err);
        }
      });
  }
  onComposeStart() {
    this.isCompose = true;
  }
  onComposeEnd(e: any) {
    this.isCompose = false;
    this.handleOnSearch(e);
  }
  creteInputSearchArea(): VNode[] {
    if (this.searchable) {
      return [h(VFlex,
        {
          justifyContent: "spaceBetween",
          class: ["v-city-picker-input-search"]
        },
        {
          default: () => [
            h(VFlexItem, { class: ["icon-box"] }, {
              default: () => [
                h(VIcon, { name: "search", size: "16" }, { default: () => [] })
              ]
            }),
            h(VFlexItem, { class: ["input-box", this.isSearching ? "searching" : ""], flex: 1 }, {
              default: () => [
                h("input",
                  {
                    onCompositionstart: this.onComposeStart,
                    onCompositionend: this.onComposeEnd,
                    onInput: this.handleOnSearch,
                    attrs: { placeholder: this.placeholder },
                    ref: "searchInput"
                  },
                  { default: () => [] }
                )
              ]
            }),
            withDirectives(h(VFlexItem,
              {
                onClick: this.clearSearchKeywords,
                class: ["delete-all"],
              },
              {
                default: () => [
                  h(VIcon, { name: "clear", size: 16 }, { default: () => [] })
                ]
              }
            ), [[vShow, this.isSearching]])
          ]
        }
      )];
    }
    return [] as Array<VNode>;
  }
  creteHeaderArea(): Array<VNode> {
    const header: VNode[] = [];
    header.push(this.createTitle());
    header.push(this.createClose());
    if (this.caculatedTabs.length === 2) {
      header.push(
        h(VFlex,
          {
            justifyContent: "spaceAround",
            class: ["v-city-picker-tab-bar"]
          },
          {
            default: () => Array.apply(null, this.caculatedTabs).map((ele: any, key: number, arr: any[]) => {
              return h(VFlexItem,
                {
                  key,
                  onClick: this.handleTabSwitch.bind(this, ele),
                  flex: 1,
                  class: ["v-city-picker-tab-item", ele.active ? "active" : ""]
                },
                {
                  default: () => [h("span", { class: ["v-city-picker-tab-text"] }, { default: () => ele.label })]
                }
              );
            })
          }
        )
      );
    }
    header.push(...this.creteInputSearchArea());
    return header;
  }
  createDynamicContent(): VNode[] {
    if (this.limited) {
      return [
        h(VFlexItem, { class: ["v-city-picker-header"] }, {
          default: () => [
            this.createTitle(),
            this.createClose()
          ]
        }),
        h(VFlexItem, { flex: 1 }, {
          default: () => [
            this.createBlock({ cities: this.limitedData, loading: false })
          ]
        })
      ];
    } else {
      return [
        h(VFlexItem,
          { class: ["v-city-picker-header"] },
          { default: () => this.creteHeaderArea() }
        ),
        withDirectives(h(VFlexItem,
          {
            class: ["v-city-picker-body"],
            flex: 1,
            ref: "scrollElement-mainland-china"
          },
          { default: () => [this.createBodyArea()] }
        ), [[vShow, !this.isSearching && this.currentTab === "mainland-china"]]),
        withDirectives(h(VFlexItem,
          {
            class: ["v-city-picker-body"],
            flex: 1,
            ref: "scrollElement-overseas"
          },
          { default: () => [this.createBodyArea()] }
        ), [[vShow, !this.isSearching && this.currentTab === "overseas"]]),
        withDirectives(h(VFlexItem,
          {
            class: ["v-city-picker-body", "v-city-picker-input-search-result"],
            flex: 1,
            ref: "scrollElement-searching"
          },
          { default: () => [this.createInputSearchList()] }
        ), [[vShow, this.isSearching]]),
        h(VFlexItem, { class: ["v-city-picker-footer"] }, { default: () => [] })
      ];
    }
  }
  getHistory(e: string): void {
    const params = { ...this.history.params, tab: e };
    const promise = this.history.action(params);
    if (isPromise(promise)) {
      this.historyLoading = true;
      promise.then((res: any) => {
        const data = this.history.parse(res, params);
        if (data && data.length) {
          this.historyList = data;
        }
        this.historyLoading = false;
      });
    } else {
      console.error("The action of hotCity's attribute must be a Promise type!");
    }
  }
  getHotCity(e: string): void {
    const params = { ...this.hotCity.params, tab: e };
    const promise = this.hotCity.action(params);
    if (isPromise(promise)) {
      this.hotCityLoading = true;
      promise.then((res: any) => {
        const data = this.hotCity.parse(res, params);
        if (data && data.length) {
          this.hotCityList = data;
        }
        this.hotCityLoading = false;
      });
    } else {
      console.error("The action of hotCity's attribute must be a Promise type!");
    }
  }
  beforeEnter() {
    this.bindResize();
    if (this.showHistory) {
      this.getHistory(this.currentTab);
    }
    if (!this.limited && this.showHotCity) {
      this.getHotCity(this.currentTab);
    }
    this.$emit("beforeenter");
  }
  enter() {
    this.$emit("enter");
  }
  afterEnter() {
    this.$emit("afterenter");
  }
  beforeLeave() {
    this.unbindResize();
    this.$emit("beforeleave");
  }
  leave() {
    this.$emit("leave");
  }
  afterLeave() {
    this.$emit("afterleave");
  }
  resizeEventHandler(el: HTMLElement, paddingLeft: string, paddingRight: string) {
    const actualWidth =
      el.getBoundingClientRect().width -
      parseInt(paddingLeft) -
      parseInt(paddingRight);
    const textBoxWidth =
      parseInt(String(this.column)) === 3 ? actualWidth * 0.31 : actualWidth * 0.22;
    this.textBoxWidth = textBoxWidth;
  }
  resize() {
    const cityBox = (this.$refs.cityBox as VFlex).$el;
    const paddingLeft = getPropertyValue(cityBox, "padding-left");
    const paddingRight = getPropertyValue(cityBox, "padding-right");
    const el = this.$el;
    this.resizeEventHandler(el, paddingLeft, paddingRight);
    EventBus.on("window:resize", () => {
      this.resizeEventHandler(el, paddingLeft, paddingRight);
    });
  }
  mounted() {
    this.resize();
  }
  render() {
    return h("div", { class: ["v-city-picker"] }, [
      withDirectives(h(VPopup,
        {
          onBeforeenter: this.beforeEnter,
          onEnter: this.enter,
          onAfterenter: this.afterEnter,
          onBeforeLeave: this.beforeLeave,
          onLeave: this.leave,
          onAfterleave: this.afterLeave,
          position: "bottom",
          style: { height: "90%" }
        },
        {
          default: () => [
            h(VFlex,
              {
                class: ["v-city-picker-content", this.limited ? "limited" : ""],
                flexDirection: "column"
              },
              { default: () => this.createDynamicContent() }
            )
          ]
        }
      ), [[vShow, this.modelValue]])
    ]);
  }
}
