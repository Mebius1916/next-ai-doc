import { Extension } from "@tiptap/core";

// 类型声明：扩展Tiptap的命令接口
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    lineHeight: {
      /** 设置行高（支持CSS单位如1.5/2/24px等） */
      setLineHeight: (lineHeight: string) => ReturnType;
      /** 重置为默认行高 */
      unsetLineHeight: () => ReturnType;
    };
  }
}

export const LineHeightExtension = Extension.create({
  name: "lineHeight",
  
  // 扩展配置项
  addOptions() {
    return {
      types: ["paragraph", "heading"], // 应用行高样式的节点类型
      defaultLineHeight: null // 默认行高（null表示不设置）
    };
  },

  // 添加全局属性处理
  addGlobalAttributes() {
    return [
      {
        types: this.options.types, // 应用到的节点类型
        attributes: {
          lineHeight: {
            // 默认值（从配置项获取）
            default: this.options.defaultLineHeight,
            
            // 渲染到HTML时的处理
            renderHTML: attributes => {
              if (!attributes.lineHeight) {
                return {};
              }
              // 将行高转换为行内样式
              return {
                style: `line-height: ${attributes.lineHeight};`
              };
            },
            
            // 从HTML解析时的处理
            parseHTML: element => {
              return {
                // 获取行高样式或使用默认值
                lineHeight: element.style.lineHeight || this.options.defaultLineHeight
              };
            }
          },
        },
      },
    ];
  },

  // 添加自定义命令
  addCommands() {
    return {
      setLineHeight: lineHeight => ({ tr, state, dispatch }) => {
        // 创建事务副本以保持不可变性
        tr = tr.setSelection(state.selection);
        
        // 遍历选区内的所有节点
        state.doc.nodesBetween(state.selection.from, state.selection.to, (node, pos) => {
          // 只处理配置的类型节点
          if (this.options.types.includes(node.type.name)) {
            tr = tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              lineHeight // 更新行高属性
            });
          }
        });
        
        // 提交事务更新
        if (dispatch) {
          dispatch(tr);
        }
        return true;
      },
      
      unsetLineHeight: () => ({ tr, state, dispatch }) => {
        tr = tr.setSelection(state.selection);
        
        // 遍历选区节点重置行高
        state.doc.nodesBetween(state.selection.from, state.selection.to, (node, pos) => {
          if (this.options.types.includes(node.type.name)) {
            tr = tr.setNodeMarkup(pos, undefined, {
              ...node.attrs,
              lineHeight: this.options.defaultLineHeight // 重置为默认值
            });
          }
        });
        
        if (dispatch) {
          dispatch(tr);
        }
        return true;
      }
    };
  }
});
