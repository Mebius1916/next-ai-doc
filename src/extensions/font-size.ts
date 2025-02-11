import { Extension } from "@tiptap/core";
import "@tiptap/extension-text-style";

// 声明类型
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      /** 设置字体大小（支持CSS单位如12px/1.2rem等） */
      setFontSize: (fontSize: string) => ReturnType;
      /** 清除字体大小设置 */
      unsetFontSize: () => ReturnType;
    };
  }
}

// 创建扩展
export const FontSizeExtension = Extension.create({
  name: "fontSize",
  
  // 扩展配置项
  addOptions() {
    return {
      types: ["textStyle"], // 作用对象为文本样式标记
    }
  },

  // 注册全局属性
  addGlobalAttributes() {
    return [{
      types: this.options.types, // 应用范围（textStyle类型）
      attributes: {
        fontSize: {
          default: null, // 默认无字体大小
          // 从DOM解析字体大小（读取style属性）
          parseHTML: element => element.style.fontSize,
          // 渲染到DOM时生成样式
          renderHTML: attributes => {
            if(!attributes.fontSize) {
              return {}; // 无设置时返回空对象
            }
            return {
              style: `font-size: ${attributes.fontSize};`, // 生成内联样式
            }
          },
        },
      },
    }];
  },

  // 注册编辑器命令
  addCommands() {
    return {
      /** 设置字体大小命令 */
      setFontSize: (fontSize:string) => ({ chain }) => {
        return chain()
        .setMark("textStyle", { fontSize }) // 更新文本样式标记
        .run();
      },
      /** 清除字体大小命令 */
      unsetFontSize: () => ({ chain }) => {
        return chain()
        .setMark("textStyle", { fontSize: null }) // 清除字体大小属性
        .removeEmptyTextStyle() // 移除空文本样式标记
        .run();
      },
    };
  },
});
